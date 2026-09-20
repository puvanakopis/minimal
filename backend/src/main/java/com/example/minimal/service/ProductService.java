package com.example.minimal.service;

import com.example.minimal.dto.*;
import com.example.minimal.exception.AppException;
import com.example.minimal.model.Product;
import com.example.minimal.model.User;
import com.example.minimal.repository.ProductRepository;
import com.example.minimal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    private static final Pattern NONLATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]");

    // ==========================================
    // USER PORTAL METHODS
    // ==========================================

    @Transactional(readOnly = true)
    public List<ProductDto> getAllProducts(String category, String gender, String search, String sortBy) {
        List<Product> products = productRepository.findWithFilters(
                (category != null && !category.isBlank()) ? category.trim() : null,
                (gender != null && !gender.isBlank()) ? gender.trim() : null,
                (search != null && !search.isBlank()) ? search.trim() : null
        );

        if (sortBy != null && !sortBy.isBlank()) {
            switch (sortBy.toLowerCase()) {
                case "price-asc":
                case "price_asc":
                case "low-to-high":
                    products.sort(Comparator.comparing(Product::getPrice));
                    break;
                case "price-desc":
                case "price_desc":
                case "high-to-low":
                    products.sort(Comparator.comparing(Product::getPrice).reversed());
                    break;
                case "rating":
                case "rating-desc":
                    products.sort(Comparator.comparing(Product::getRating, Comparator.nullsLast(Comparator.reverseOrder())));
                    break;
                case "newest":
                case "created_desc":
                    products.sort(Comparator.comparing(Product::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())));
                    break;
                default:
                    break;
            }
        }

        return products.stream()
                .map(ProductDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProductDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException("Product not found with id: " + id, HttpStatus.NOT_FOUND));
        return ProductDto.fromEntity(product);
    }

    @Transactional(readOnly = true)
    public ProductDto getProductBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new AppException("Product not found with slug: " + slug, HttpStatus.NOT_FOUND));
        return ProductDto.fromEntity(product);
    }

    @Transactional(readOnly = true)
    public List<ReviewDto> getProductReviews(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException("Product not found with id: " + productId, HttpStatus.NOT_FOUND));

        if (product.getReviews() == null) {
            return Collections.emptyList();
        }

        return product.getReviews().stream()
                .sorted(Comparator.comparing(Product.Review::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .map(r -> ReviewDto.fromEntity(r, productId))
                .collect(Collectors.toList());
    }

    @Transactional
    public ReviewDto addReview(Long productId, CreateReviewRequest request, String currentUserEmail) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException("Product not found with id: " + productId, HttpStatus.NOT_FOUND));

        User user = null;
        String authorName = request.getAuthorName();
        String authorEmail = request.getAuthorEmail();

        if (currentUserEmail != null && !currentUserEmail.isBlank()) {
            user = userRepository.findByEmailIgnoreCase(currentUserEmail).orElse(null);
            if (user != null) {
                if (authorName == null || authorName.isBlank()) {
                    authorName = (user.getFirstName() + " " + user.getLastName()).trim();
                }
                if (authorEmail == null || authorEmail.isBlank()) {
                    authorEmail = user.getEmail();
                }
            }
        }

        if (authorName == null || authorName.isBlank()) {
            authorName = "Anonymous Customer";
        }

        if (product.getReviews() == null) {
            product.setReviews(new ArrayList<>());
        }

        long newReviewId = System.currentTimeMillis();

        Product.Review review = Product.Review.builder()
                .id(newReviewId)
                .userId(user != null ? user.getId() : null)
                .authorName(authorName)
                .authorEmail(authorEmail)
                .rating(request.getRating())
                .title(request.getTitle())
                .comment(request.getComment().trim())
                .createdAt(LocalDateTime.now())
                .build();

        product.getReviews().add(0, review);

        // Recalculate rating and review count
        int totalReviews = product.getReviews().size();
        double avgRating = product.getReviews().stream()
                .mapToInt(Product.Review::getRating)
                .average()
                .orElse(request.getRating().doubleValue());

        product.setRating(Math.round(avgRating * 10.0) / 10.0);
        product.setReviewCount(totalReviews);
        productRepository.save(product);

        log.info("Review added for product ID: {} by {}", productId, authorName);
        return ReviewDto.fromEntity(review, productId);
    }

    // ==========================================
    // ADMIN PORTAL METHODS
    // ==========================================

    @Transactional(readOnly = true)
    public List<ProductDto> getAllProductsAdmin() {
        return productRepository.findAll().stream()
                .sorted(Comparator.comparing(Product::getId).reversed())
                .map(ProductDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductDto createProduct(CreateProductRequest request) {
        String slug = (request.getSlug() != null && !request.getSlug().isBlank())
                ? slugify(request.getSlug())
                : slugify(request.getName());

        slug = ensureUniqueSlug(slug, null);

        List<Product.ProductColor> colors = request.getColors() != null
                ? request.getColors().stream().map(ProductColorDto::toEntity).collect(Collectors.toList())
                : new ArrayList<>();

        List<String> images = request.getImages() != null ? new ArrayList<>(request.getImages()) : new ArrayList<>();
        if (images.isEmpty() && request.getImage() != null && !request.getImage().isBlank()) {
            images.add(request.getImage());
        }

        if (images.size() > 5) {
            throw new AppException("A product can have a maximum of 5 images.", HttpStatus.BAD_REQUEST);
        }

        String primaryImage = !images.isEmpty() ? images.get(0) : (request.getImage() != null ? request.getImage() : "");
        String mainImage = request.getMainImage() != null && !request.getMainImage().isBlank() ? request.getMainImage() : primaryImage;

        Product product = Product.builder()
                .name(request.getName().trim())
                .slug(slug)
                .description(request.getDescription())
                .price(request.getPrice())
                .category(request.getCategory() != null ? request.getCategory().trim() : "General")
                .gender(request.getGender() != null ? request.getGender().trim().toLowerCase() : "unisex")
                .mainImage(mainImage)
                .image(primaryImage)
                .images(images)
                .colors(colors)
                .sizes(request.getSizes() != null ? new ArrayList<>(request.getSizes()) : new ArrayList<>())
                .details(request.getDetails() != null ? new ArrayList<>(request.getDetails()) : new ArrayList<>())
                .features(request.getFeatures() != null ? new ArrayList<>(request.getFeatures()) : new ArrayList<>())
                .material(request.getMaterial())
                .careInstructions(request.getCareInstructions() != null ? new ArrayList<>(request.getCareInstructions()) : new ArrayList<>())
                .reviews(new ArrayList<>())
                .rating(0.0)
                .reviewCount(0)
                .build();

        Product savedProduct = productRepository.save(product);
        log.info("Created product ID: {} ({})", savedProduct.getId(), savedProduct.getName());

        return ProductDto.fromEntity(savedProduct);
    }

    @Transactional
    public ProductDto updateProduct(Long id, UpdateProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException("Product not found with id: " + id, HttpStatus.NOT_FOUND));

        if (request.getName() != null && !request.getName().isBlank()) {
            product.setName(request.getName().trim());
        }

        if (request.getSlug() != null && !request.getSlug().isBlank()) {
            String newSlug = slugify(request.getSlug());
            product.setSlug(ensureUniqueSlug(newSlug, id));
        }

        if (request.getDescription() != null) {
            product.setDescription(request.getDescription());
        }

        if (request.getPrice() != null) {
            product.setPrice(request.getPrice());
        }

        if (request.getCategory() != null) {
            product.setCategory(request.getCategory().trim());
        }

        if (request.getGender() != null) {
            product.setGender(request.getGender().trim().toLowerCase());
        }

        if (request.getImages() != null) {
            if (request.getImages().size() > 5) {
                throw new AppException("A product can have a maximum of 5 images.", HttpStatus.BAD_REQUEST);
            }
            List<String> updatedImages = new ArrayList<>(request.getImages());
            product.setImages(updatedImages);
            if (!updatedImages.isEmpty()) {
                product.setImage(updatedImages.get(0));
                product.setMainImage(updatedImages.get(0));
            }
        } else if (request.getImage() != null && !request.getImage().isBlank()) {
            product.setImage(request.getImage());
            if (product.getImages() == null || product.getImages().isEmpty()) {
                product.setImages(new ArrayList<>(List.of(request.getImage())));
            }
        }

        if (request.getMainImage() != null && !request.getMainImage().isBlank()) {
            product.setMainImage(request.getMainImage());
        }

        if (request.getColors() != null) {
            product.setColors(request.getColors().stream().map(ProductColorDto::toEntity).collect(Collectors.toList()));
        }

        if (request.getSizes() != null) {
            product.setSizes(new ArrayList<>(request.getSizes()));
        }

        if (request.getDetails() != null) {
            product.setDetails(new ArrayList<>(request.getDetails()));
        }

        if (request.getFeatures() != null) {
            product.setFeatures(new ArrayList<>(request.getFeatures()));
        }

        if (request.getMaterial() != null) {
            product.setMaterial(request.getMaterial());
        }

        if (request.getCareInstructions() != null) {
            product.setCareInstructions(new ArrayList<>(request.getCareInstructions()));
        }

        Product updatedProduct = productRepository.save(product);
        log.info("Updated product ID: {}", updatedProduct.getId());

        return ProductDto.fromEntity(updatedProduct);
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException("Product not found with id: " + id, HttpStatus.NOT_FOUND));
        productRepository.delete(product);
        log.info("Deleted product ID: {}", id);
    }

    // ==========================================
    // HELPER METHODS
    // ==========================================

    private String slugify(String input) {
        if (input == null || input.isBlank()) {
            return "product-" + System.currentTimeMillis();
        }
        String nowhitespace = WHITESPACE.matcher(input.trim()).replaceAll("-");
        String normalized = Normalizer.normalize(nowhitespace, Normalizer.Form.NFD);
        String slug = NONLATIN.matcher(normalized).replaceAll("");
        return slug.toLowerCase(Locale.ENGLISH).replaceAll("-+", "-").replaceAll("^-|-$", "");
    }

    private String ensureUniqueSlug(String baseSlug, Long excludeId) {
        String slug = baseSlug;
        int counter = 1;
        while (true) {
            Optional<Product> existing = productRepository.findBySlug(slug);
            if (existing.isEmpty() || (excludeId != null && existing.get().getId().equals(excludeId))) {
                return slug;
            }
            slug = baseSlug + "-" + counter++;
        }
    }
}
