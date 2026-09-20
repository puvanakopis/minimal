package com.example.minimal.controller;

import com.example.minimal.dto.*;
import com.example.minimal.service.FileStorageService;
import com.example.minimal.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final FileStorageService fileStorageService;

    // USER PORTAL 

    @GetMapping("/api/products")
    public ResponseEntity<ApiResponse<List<ProductDto>>> getProducts(
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "gender", required = false) String gender,
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "sortBy", required = false) String sortBy) {
        List<ProductDto> products = productService.getAllProducts(category, gender, search, sortBy);
        return ResponseEntity.ok(ApiResponse.success("Products fetched successfully", products));
    }

    @GetMapping("/api/products/{id}")
    public ResponseEntity<ApiResponse<ProductDto>> getProductById(@PathVariable("id") Long id) {
        ProductDto product = productService.getProductById(id);
        return ResponseEntity.ok(ApiResponse.success("Product fetched successfully", product));
    }

    @GetMapping("/api/products/slug/{slug}")
    public ResponseEntity<ApiResponse<ProductDto>> getProductBySlug(@PathVariable("slug") String slug) {
        ProductDto product = productService.getProductBySlug(slug);
        return ResponseEntity.ok(ApiResponse.success("Product fetched successfully", product));
    }

    @GetMapping("/api/products/{id}/reviews")
    public ResponseEntity<ApiResponse<List<ReviewDto>>> getProductReviews(@PathVariable("id") Long id) {
        List<ReviewDto> reviews = productService.getProductReviews(id);
        return ResponseEntity.ok(ApiResponse.success("Reviews fetched successfully", reviews));
    }

    @PostMapping("/api/products/{id}/reviews")
    public ResponseEntity<ApiResponse<ReviewDto>> addReview(
            @PathVariable("id") Long id,
            @Valid @RequestBody CreateReviewRequest request,
            Authentication authentication) {
        String userEmail = (authentication != null && authentication.isAuthenticated()
                && !"anonymousUser".equals(authentication.getName()))
                        ? authentication.getName()
                        : null;

        ReviewDto review = productService.addReview(id, request, userEmail);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Review submitted successfully", review));
    }

    // ADMIN ENDPOINTS

    @GetMapping("/api/admin/products")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('admin')")
    public ResponseEntity<ApiResponse<List<ProductDto>>> getAllProductsAdmin() {
        List<ProductDto> products = productService.getAllProductsAdmin();
        return ResponseEntity.ok(ApiResponse.success("Products fetched successfully", products));
    }

    @GetMapping("/api/admin/products/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('admin')")
    public ResponseEntity<ApiResponse<ProductDto>> getProductByIdAdmin(@PathVariable("id") Long id) {
        ProductDto product = productService.getProductById(id);
        return ResponseEntity.ok(ApiResponse.success("Product fetched successfully", product));
    }

    @PostMapping("/api/admin/products/upload-image")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('admin')")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadImage(
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        MultipartFile targetFile = file != null ? file : image;
        if (targetFile == null || targetFile.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Please provide a valid image file."));
        }
        String imageUrl = fileStorageService.storeFile(targetFile);
        Map<String, String> response = new HashMap<>();
        response.put("imageUrl", imageUrl);
        return ResponseEntity.ok(ApiResponse.success("Image uploaded successfully", response));
    }

    @PostMapping("/api/admin/products")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('admin')")
    public ResponseEntity<ApiResponse<ProductDto>> createProduct(@Valid @RequestBody CreateProductRequest request) {
        ProductDto created = productService.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Product created successfully", created));
    }

    @PutMapping("/api/admin/products/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('admin')")
    public ResponseEntity<ApiResponse<ProductDto>> updateProductWithId(
            @PathVariable("id") Long id,
            @RequestBody UpdateProductRequest request) {
        ProductDto updated = productService.updateProduct(id, request);
        return ResponseEntity.ok(ApiResponse.success("Product updated successfully", updated));
    }

    @PutMapping("/api/admin/products")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('admin')")
    public ResponseEntity<ApiResponse<ProductDto>> updateProduct(@RequestBody UpdateProductRequest request) {
        if (request.getId() == null) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Product ID is required for update"));
        }
        ProductDto updated = productService.updateProduct(request.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Product updated successfully", updated));
    }

    @DeleteMapping("/api/admin/products/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('admin')")
    public ResponseEntity<ApiResponse<Void>> deleteProductWithId(@PathVariable("id") Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.success("Product deleted successfully", null));
    }

    @DeleteMapping("/api/admin/products")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('admin')")
    public ResponseEntity<ApiResponse<Void>> deleteProductByParam(@RequestParam("id") Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.success("Product deleted successfully", null));
    }
}
