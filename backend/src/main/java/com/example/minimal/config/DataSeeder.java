package com.example.minimal.config;

import com.example.minimal.model.*;
import com.example.minimal.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final FavoriteRepository favoriteRepository;
    private final CartItemRepository cartItemRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Starting database seeding process with local upload images...");

        ensureUploadDirectories();
        List<User> users = seedUsers();
        List<Product> products = seedProducts();
        seedFavorites(users, products);
        seedCartItems(users, products);
        seedOrders(users, products);

        log.info("Database seeding successfully completed with local uploads!");
    }

    private void ensureUploadDirectories() {
        try {
            Path prodPath = Paths.get("uploads", "products").toAbsolutePath().normalize();
            Path avatPath = Paths.get("uploads", "avatars").toAbsolutePath().normalize();
            if (!Files.exists(prodPath)) {
                Files.createDirectories(prodPath);
            }
            if (!Files.exists(avatPath)) {
                Files.createDirectories(avatPath);
            }
        } catch (Exception e) {
            log.warn("Could not create upload directories: {}", e.getMessage());
        }
    }

    private String saveOrGetUpload(String subDir, String fileName, String fallbackUrl) {
        try {
            Path targetDir = Paths.get("uploads", subDir).toAbsolutePath().normalize();
            if (!Files.exists(targetDir)) {
                Files.createDirectories(targetDir);
            }
            Path targetFile = targetDir.resolve(fileName);
            if (!Files.exists(targetFile) || Files.size(targetFile) == 0) {
                if (fallbackUrl != null && !fallbackUrl.isBlank()) {
                    HttpClient client = HttpClient.newBuilder()
                            .followRedirects(HttpClient.Redirect.ALWAYS)
                            .connectTimeout(Duration.ofSeconds(10))
                            .build();
                    HttpRequest request = HttpRequest.newBuilder()
                            .uri(URI.create(fallbackUrl))
                            .header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
                            .timeout(Duration.ofSeconds(15))
                            .GET()
                            .build();
                    HttpResponse<InputStream> response = client.send(request, HttpResponse.BodyHandlers.ofInputStream());
                    if (response.statusCode() == 200) {
                        try (InputStream is = response.body()) {
                            Files.copy(is, targetFile, StandardCopyOption.REPLACE_EXISTING);
                        }
                    }
                }
            }
        } catch (Exception e) {
            log.warn("Notice: could not auto-fetch fallback image {}: {}", fileName, e.getMessage());
        }
        return "/uploads/" + subDir + "/" + fileName;
    }

    private List<User> seedUsers() {
        String commonPassword = passwordEncoder.encode("Puvan#1234");
        List<User> savedUsers = new ArrayList<>();

        // 1. Admin User
        User admin = userRepository.findByEmailIgnoreCase("mehanathanpuvanakopis@gmail.com")
                .orElse(User.builder()
                        .email("mehanathanpuvanakopis@gmail.com")
                        .build());
        admin.setFirstName("Puvanakopis");
        admin.setLastName("Mehanathan");
        admin.setPassword(commonPassword);
        admin.setRole(User.Role.admin);
        admin.setEmailVerified(true);
        admin.setBlocked(false);
        admin.setDeleted(false);
        admin.setPhoneNumber("+94 77 000 0001");
        admin.setShippingAddress("HQ Minimal, Galle Road, Colombo 03, Sri Lanka");
        admin.setAvatar(saveOrGetUpload("avatars", "admin-avatar.jpg", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"));
        savedUsers.add(userRepository.save(admin));

        // 2. User 1
        User user1 = userRepository.findByEmailIgnoreCase("puvanakopis@gmail.com")
                .orElse(User.builder()
                        .email("puvanakopis@gmail.com")
                        .build());
        user1.setFirstName("Puvan");
        user1.setLastName("Kopis");
        user1.setPassword(commonPassword);
        user1.setRole(User.Role.user);
        user1.setEmailVerified(true);
        user1.setBlocked(false);
        user1.setDeleted(false);
        user1.setPhoneNumber("+94 77 123 4567");
        user1.setShippingAddress("142/B Temple Road, Colombo 04, Sri Lanka");
        user1.setAvatar(saveOrGetUpload("avatars", "user1-avatar.jpg", "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80"));
        savedUsers.add(userRepository.save(user1));

        // 3. User 2
        User user2 = userRepository.findByEmailIgnoreCase("puvanakopis1@gmail.com")
                .orElse(User.builder()
                        .email("puvanakopis1@gmail.com")
                        .build());
        user2.setFirstName("Kopis");
        user2.setLastName("One");
        user2.setPassword(commonPassword);
        user2.setRole(User.Role.user);
        user2.setEmailVerified(true);
        user2.setBlocked(false);
        user2.setDeleted(false);
        user2.setPhoneNumber("+94 77 234 5678");
        user2.setShippingAddress("56 Lake Drive, Kandy, Sri Lanka");
        user2.setAvatar(saveOrGetUpload("avatars", "user2-avatar.jpg", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80"));
        savedUsers.add(userRepository.save(user2));

        // 4. User 3
        User user3 = userRepository.findByEmailIgnoreCase("puvanakopis2@gmail.com")
                .orElse(User.builder()
                        .email("puvanakopis2@gmail.com")
                        .build());
        user3.setFirstName("Puvan");
        user3.setLastName("Two");
        user3.setPassword(commonPassword);
        user3.setRole(User.Role.user);
        user3.setEmailVerified(true);
        user3.setBlocked(false);
        user3.setDeleted(false);
        user3.setPhoneNumber("+94 77 345 6789");
        user3.setShippingAddress("89 Marine Drive, Jaffna, Sri Lanka");
        user3.setAvatar(saveOrGetUpload("avatars", "user3-avatar.jpg", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80"));
        savedUsers.add(userRepository.save(user3));

        log.info("Seeded 4 users (1 admin, 3 customers) with password Puvan#1234");
        return savedUsers;
    }

    private List<Product> seedProducts() {
        List<Product> productsToSeed = List.of(
                // 1. Heavyweight Relaxed Boxy T-Shirt
                Product.builder()
                        .name("Heavyweight Relaxed Boxy T-Shirt")
                        .slug("heavyweight-relaxed-boxy-t-shirt")
                        .description("Crafted from 280 GSM organic combed cotton, this heavyweight boxy tee features dropped shoulders, a structured silhouette, and minimal ribbed crewneck.")
                        .price(38.00)
                        .category("T-Shirts")
                        .gender("unisex")
                        .mainImage(saveOrGetUpload("products", "boxy-tee-1.jpg", "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80"))
                        .image(saveOrGetUpload("products", "boxy-tee-1.jpg", "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80"))
                        .images(List.of(
                                saveOrGetUpload("products", "boxy-tee-1.jpg", "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80"),
                                saveOrGetUpload("products", "boxy-tee-2.jpg", "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80"),
                                saveOrGetUpload("products", "boxy-tee-3.jpg", "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80"),
                                saveOrGetUpload("products", "boxy-tee-4.jpg", "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop&q=80"),
                                saveOrGetUpload("products", "boxy-tee-5.jpg", "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&auto=format&fit=crop&q=80")
                        ))
                        .sizes(List.of("XS", "S", "M", "L", "XL"))
                        .details(List.of("280 GSM 100% Organic Cotton", "Preshrunk fabric", "Ribbed collar", "Blind stitch hem"))
                        .features(List.of("Breathable", "Ultra-durable", "Oversized boxy drape"))
                        .material("100% Organic Combed Cotton")
                        .careInstructions(List.of("Machine wash cold", "Do not tumble dry", "Iron on reverse"))
                        .rating(4.8)
                        .reviewCount(14)
                        .reviews(List.of(
                                Product.Review.builder()
                                        .authorName("Alex Johnson")
                                        .authorEmail("alex@example.com")
                                        .rating(5)
                                        .title("Best basic tee I own")
                                        .comment("The weight and collar stiffness are exceptional. Holds shape after multiple washes.")
                                        .createdAt(LocalDateTime.now().minusDays(10))
                                        .build(),
                                Product.Review.builder()
                                        .authorName("Sarah M.")
                                        .authorEmail("sarah@example.com")
                                        .rating(5)
                                        .title("Perfect oversized fit")
                                        .comment("Love the clean minimal look. Exactly what I was looking for.")
                                        .createdAt(LocalDateTime.now().minusDays(4))
                                        .build()
                        ))
                        .build(),

                // 2. Essential Minimal French Terry Hoodie
                Product.builder()
                        .name("Essential Minimal French Terry Hoodie")
                        .slug("essential-minimal-french-terry-hoodie")
                        .description("A clean-cut loopback French terry hoodie engineered with a double-layered hood without drawstrings for an uninterrupted aesthetic.")
                        .price(88.00)
                        .category("Hoodies & Sweatshirts")
                        .gender("unisex")
                        .mainImage(saveOrGetUpload("products", "terry-hoodie-1.jpg", "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80"))
                        .image(saveOrGetUpload("products", "terry-hoodie-1.jpg", "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80"))
                        .images(List.of(
                                saveOrGetUpload("products", "terry-hoodie-1.jpg", "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80"),
                                saveOrGetUpload("products", "terry-hoodie-2.jpg", "https://images.unsplash.com/photo-1578768079052-aa76e520036c?w=800&auto=format&fit=crop&q=80"),
                                saveOrGetUpload("products", "terry-hoodie-3.jpg", "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&auto=format&fit=crop&q=80"),
                                saveOrGetUpload("products", "terry-hoodie-4.jpg", "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop&q=80"),
                                saveOrGetUpload("products", "terry-hoodie-5.jpg", "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80")
                        ))
                        .sizes(List.of("S", "M", "L", "XL"))
                        .details(List.of("420 GSM French Terry", "No drawstrings minimal neck", "Deep kangaroo pocket", "Ribbed cuffs and hem"))
                        .features(List.of("Thermal regulation", "Pre-washed for softness", "Structured drape"))
                        .material("100% French Terry Cotton")
                        .careInstructions(List.of("Machine wash cold with like colors", "Lay flat to dry"))
                        .rating(4.9)
                        .reviewCount(22)
                        .reviews(List.of(
                                Product.Review.builder()
                                        .authorName("Michael Ray")
                                        .authorEmail("michael@example.com")
                                        .rating(5)
                                        .title("Incredible quality")
                                        .comment("Heavy, cozy, and no logos or annoying drawstrings. Premium luxury feel.")
                                        .createdAt(LocalDateTime.now().minusDays(15))
                                        .build()
                        ))
                        .build(),

                // 3. Tailored Pleated Wool-Blend Trousers
                Product.builder()
                        .name("Tailored Pleated Wool-Blend Trousers")
                        .slug("tailored-pleated-wool-blend-trousers")
                        .description("Contemporary wide-tapered trousers featuring subtle double pleats, concealed hook fastening, and side adjusters.")
                        .price(125.00)
                        .category("Pants")
                        .gender("men")
                        .mainImage(saveOrGetUpload("products", "wool-trouser-1.jpg", "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80"))
                        .image(saveOrGetUpload("products", "wool-trouser-1.jpg", "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80"))
                        .images(List.of(
                                saveOrGetUpload("products", "wool-trouser-1.jpg", "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80"),
                                saveOrGetUpload("products", "wool-trouser-2.jpg", "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=80"),
                                saveOrGetUpload("products", "wool-trouser-3.jpg", "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80"),
                                saveOrGetUpload("products", "wool-trouser-4.jpg", "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=800&auto=format&fit=crop&q=80"),
                                saveOrGetUpload("products", "wool-trouser-5.jpg", "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&auto=format&fit=crop&q=80")
                        ))
                        .sizes(List.of("S", "M", "L", "XL"))
                        .details(List.of("Double front pleats", "Concealed tab closure", "Slanted side pockets", "Unfinished cuffs for tailoring"))
                        .features(List.of("Wrinkle-resistant", "Subtle stretch", "Elegant drape"))
                        .material("70% Wool, 28% Polyester, 2% Elastane")
                        .careInstructions(List.of("Dry clean only", "Steam press on low"))
                        .rating(4.7)
                        .reviewCount(9)
                        .reviews(new ArrayList<>())
                        .build(),

                // 4. Oversized Linen Camp-Collar Shirt
                Product.builder()
                        .name("Oversized Linen Camp-Collar Shirt")
                        .slug("oversized-linen-camp-collar-shirt")
                        .description("Relaxed open-collar button down made from naturally cooling pure European flax linen. Softened with an enzyme wash.")
                        .price(65.00)
                        .category("Shirts")
                        .gender("men")
                        .mainImage(saveOrGetUpload("products", "linen-shirt-1.jpg", "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80"))
                        .image(saveOrGetUpload("products", "linen-shirt-1.jpg", "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80"))
                        .images(List.of(
                                saveOrGetUpload("products", "linen-shirt-1.jpg", "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80"),
                                saveOrGetUpload("products", "linen-shirt-2.jpg", "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80"),
                                saveOrGetUpload("products", "linen-shirt-3.jpg", "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&auto=format&fit=crop&q=80"),
                                saveOrGetUpload("products", "linen-shirt-4.jpg", "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&auto=format&fit=crop&q=80"),
                                saveOrGetUpload("products", "linen-shirt-5.jpg", "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=800&auto=format&fit=crop&q=80")
                        ))
                        .sizes(List.of("S", "M", "L", "XL"))
                        .details(List.of("Cuban camp collar", "Natural mother of pearl buttons", "Straight hem with side slits"))
                        .features(List.of("Moisture wicking", "Naturally hypoallergenic", "Becomes softer with every wash"))
                        .material("100% Normandy Linen")
                        .careInstructions(List.of("Machine wash gentle 30°C", "Hang to dry", "Warm iron while damp"))
                        .rating(4.6)
                        .reviewCount(11)
                        .reviews(new ArrayList<>())
                        .build(),

                // 5. Structured Cotton Twill Overshirt
                Product.builder()
                        .name("Structured Cotton Twill Overshirt")
                        .slug("structured-cotton-twill-overshirt")
                        .description("A versatile transitional outerwear piece with large utility chest pockets and matte horn buttons.")
                        .price(95.00)
                        .category("Jackets")
                        .gender("unisex")
                        .mainImage(saveOrGetUpload("products", "twill-overshirt-1.jpg", "https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80"))
                        .image(saveOrGetUpload("products", "twill-overshirt-1.jpg", "https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80"))
                        .images(List.of(
                                saveOrGetUpload("products", "twill-overshirt-1.jpg", "https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80"),
                                saveOrGetUpload("products", "twill-overshirt-2.jpg", "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=800&auto=format&fit=crop&q=80"),
                                saveOrGetUpload("products", "twill-overshirt-3.jpg", "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&auto=format&fit=crop&q=80"),
                                saveOrGetUpload("products", "twill-overshirt-4.jpg", "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80"),
                                saveOrGetUpload("products", "twill-overshirt-5.jpg", "https://images.unsplash.com/photo-1550614000-4895a10e1bfd?w=800&auto=format&fit=crop&q=80")
                        ))
                        .sizes(List.of("XS", "S", "M", "L", "XL"))
                        .details(List.of("320 GSM heavy cotton twill", "Twin patch pockets", "Point collar", "Interior security pocket"))
                        .features(List.of("All-season layering", "Reinforced stress points"))
                        .material("100% Heavyweight Cotton Twill")
                        .careInstructions(List.of("Machine wash cold", "Tumble dry low"))
                        .rating(4.85)
                        .reviewCount(18)
                        .reviews(new ArrayList<>())
                        .build(),

                // 6. Ribbed Knit Cashmere-Blend Sweater
                Product.builder()
                        .name("Ribbed Knit Cashmere-Blend Sweater")
                        .slug("ribbed-knit-cashmere-blend-sweater")
                        .description("Pure minimalism knitted from 70% merino wool and 30% Mongolian cashmere. Soft, non-itchy, and cloud-light.")
                        .price(140.00)
                        .category("Knitwear")
                        .gender("women")
                        .mainImage(saveOrGetUpload("products", "cashmere-sweater-1.jpg", "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop&q=80"))
                        .image(saveOrGetUpload("products", "cashmere-sweater-1.jpg", "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop&q=80"))
                        .images(List.of(
                                saveOrGetUpload("products", "cashmere-sweater-1.jpg", "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop&q=80"),
                                saveOrGetUpload("products", "cashmere-sweater-2.jpg", "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=800&auto=format&fit=crop&q=80"),
                                saveOrGetUpload("products", "cashmere-sweater-3.jpg", "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=800&auto=format&fit=crop&q=80"),
                                saveOrGetUpload("products", "cashmere-sweater-4.jpg", "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80"),
                                saveOrGetUpload("products", "cashmere-sweater-5.jpg", "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=800&auto=format&fit=crop&q=80")
                        ))
                        .sizes(List.of("XS", "S", "M", "L"))
                        .details(List.of("7-gauge rib knit", "Raglan shoulders", "Seamless neckline"))
                        .features(List.of("Ultra thermal retention", "Buttery hand-feel", "Anti-pilling finish"))
                        .material("70% Extra-fine Merino Wool, 30% Grade-A Cashmere")
                        .careInstructions(List.of("Hand wash cold or dry clean", "Dry flat"))
                        .rating(5.0)
                        .reviewCount(8)
                        .reviews(new ArrayList<>())
                        .build(),

                // 7. Minimal High-Waisted Wide Leg Trouser
                Product.builder()
                        .name("Minimal High-Waisted Wide Leg Trouser")
                        .slug("minimal-high-waisted-wide-leg-trouser")
                        .description("Sculptural wide-leg pants tailored with deep front pleats and a clean high-rise waistband.")
                        .price(110.00)
                        .category("Pants")
                        .gender("women")
                        .mainImage(saveOrGetUpload("products", "wide-trouser-1.jpg", "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80"))
                        .image(saveOrGetUpload("products", "wide-trouser-1.jpg", "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80"))
                        .images(List.of(
                                saveOrGetUpload("products", "wide-trouser-1.jpg", "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80"),
                                saveOrGetUpload("products", "wide-trouser-2.jpg", "https://images.unsplash.com/photo-1551803091-e20673f15770?w=800&auto=format&fit=crop&q=80"),
                                saveOrGetUpload("products", "wide-trouser-3.jpg", "https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=800&auto=format&fit=crop&q=80"),
                                saveOrGetUpload("products", "wide-trouser-4.jpg", "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80"),
                                saveOrGetUpload("products", "wide-trouser-5.jpg", "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&auto=format&fit=crop&q=80")
                        ))
                        .sizes(List.of("XS", "S", "M", "L"))
                        .details(List.of("High waist fit", "Deep side pockets", "Concealed side zip"))
                        .features(List.of("Fluid drape", "Crease-resistant blend"))
                        .material("65% Viscose, 30% Nylon, 5% Spandex")
                        .careInstructions(List.of("Gentle cycle wash cold", "Line dry"))
                        .rating(4.75)
                        .reviewCount(16)
                        .reviews(new ArrayList<>())
                        .build(),

                // 8. Silk Modal Slip Midi Dress
                Product.builder()
                        .name("Silk Modal Slip Midi Dress")
                        .slug("silk-modal-slip-midi-dress")
                        .description("Effortless elegance cut on the bias to gently hug natural curves. Features delicate adjustable micro straps.")
                        .price(115.00)
                        .category("Dresses")
                        .gender("women")
                        .mainImage(saveOrGetUpload("products", "silk-dress-1.jpg", "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80"))
                        .image(saveOrGetUpload("products", "silk-dress-1.jpg", "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80"))
                        .images(List.of(
                                saveOrGetUpload("products", "silk-dress-1.jpg", "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80"),
                                saveOrGetUpload("products", "silk-dress-2.jpg", "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80"),
                                saveOrGetUpload("products", "silk-dress-3.jpg", "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop&q=80"),
                                saveOrGetUpload("products", "silk-dress-4.jpg", "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&auto=format&fit=crop&q=80"),
                                saveOrGetUpload("products", "silk-dress-5.jpg", "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=800&auto=format&fit=crop&q=80")
                        ))
                        .sizes(List.of("XS", "S", "M", "L"))
                        .details(List.of("Bias cut silhouette", "Soft V-neckline", "Discreet side slit", "Adjustable straps"))
                        .features(List.of("Silky drape", "Lightweight breathable touch"))
                        .material("40% Mulberry Silk, 60% Modal")
                        .careInstructions(List.of("Hand wash cold with silk detergent", "Do not wring"))
                        .rating(4.9)
                        .reviewCount(12)
                        .reviews(new ArrayList<>())
                        .build(),

                // 9. Relaxed Fit Organic Cotton Chino Shorts
                Product.builder()
                        .name("Relaxed Fit Organic Cotton Chino Shorts")
                        .slug("relaxed-fit-organic-cotton-chino-shorts")
                        .description("Clean casual shorts featuring an elasticated back waistband, button front, and 7-inch inseam.")
                        .price(52.00)
                        .category("Shorts")
                        .gender("men")
                        .mainImage(saveOrGetUpload("products", "chino-shorts-1.jpg", "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&auto=format&fit=crop&q=80"))
                        .image(saveOrGetUpload("products", "chino-shorts-1.jpg", "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&auto=format&fit=crop&q=80"))
                        .images(List.of(
                                saveOrGetUpload("products", "chino-shorts-1.jpg", "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&auto=format&fit=crop&q=80"),
                                saveOrGetUpload("products", "chino-shorts-2.jpg", "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=800&auto=format&fit=crop&q=80"),
                                saveOrGetUpload("products", "chino-shorts-3.jpg", "https://images.unsplash.com/photo-1506152983158-b4a74a01c721?w=800&auto=format&fit=crop&q=80"),
                                saveOrGetUpload("products", "chino-shorts-4.jpg", "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=800&auto=format&fit=crop&q=80"),
                                saveOrGetUpload("products", "chino-shorts-5.jpg", "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80")
                        ))
                        .sizes(List.of("S", "M", "L", "XL"))
                        .details(List.of("7-inch inseam", "Elasticated rear waist", "Front slant pockets", "Rear welt pockets"))
                        .features(List.of("Comfort stretch", "Breathable weave"))
                        .material("98% Organic Cotton, 2% Elastane")
                        .careInstructions(List.of("Machine wash warm", "Tumble dry low"))
                        .rating(4.65)
                        .reviewCount(7)
                        .reviews(new ArrayList<>())
                        .build(),

                // 10. Minimalist Waterproof Shell Parka
                Product.builder()
                        .name("Minimalist Waterproof Shell Parka")
                        .slug("minimalist-waterproof-shell-parka")
                        .description("Modern weatherproof jacket engineered with fully taped seams, matte waterproof zippers, and an ergonomic hood.")
                        .price(185.00)
                        .category("Jackets")
                        .gender("unisex")
                        .mainImage(saveOrGetUpload("products", "waterproof-parka-1.jpg", "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800&auto=format&fit=crop&q=80"))
                        .image(saveOrGetUpload("products", "waterproof-parka-1.jpg", "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800&auto=format&fit=crop&q=80"))
                        .images(List.of(
                                saveOrGetUpload("products", "waterproof-parka-1.jpg", "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800&auto=format&fit=crop&q=80"),
                                saveOrGetUpload("products", "waterproof-parka-2.jpg", "https://images.unsplash.com/photo-1544022613-e87ce71c85b9?w=800&auto=format&fit=crop&q=80"),
                                saveOrGetUpload("products", "waterproof-parka-3.jpg", "https://images.unsplash.com/photo-1542272604-780c96856592?w=800&auto=format&fit=crop&q=80"),
                                saveOrGetUpload("products", "waterproof-parka-4.jpg", "https://images.unsplash.com/photo-1516826957135-700dedea698c?w=800&auto=format&fit=crop&q=80"),
                                saveOrGetUpload("products", "waterproof-parka-5.jpg", "https://images.unsplash.com/photo-1520975916090-3105956dac38?w=800&auto=format&fit=crop&q=80")
                        ))
                        .sizes(List.of("S", "M", "L", "XL"))
                        .details(List.of("10,000mm waterproof rating", "YKK Aquaguard zippers", "Articulated sleeves", "Adjustable storm hood"))
                        .features(List.of("Windproof", "100% Waterproof", "Breathable membrane"))
                        .material("3-Layer Recycled Nylon Shell")
                        .careInstructions(List.of("Wipe clean with damp cloth or gentle cycle 30°C"))
                        .rating(4.95)
                        .reviewCount(30)
                        .reviews(new ArrayList<>())
                        .build(),

                // 11. Seamless Ribbed Modal Tank
                Product.builder()
                        .name("Seamless Ribbed Modal Tank")
                        .slug("seamless-ribbed-modal-tank")
                        .description("Micro-ribbed everyday essential with high neckline and low armholes designed for effortless layering.")
                        .price(32.00)
                        .category("T-Shirts")
                        .gender("women")
                        .mainImage(saveOrGetUpload("products", "modal-tank-1.jpg", "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80"))
                        .image(saveOrGetUpload("products", "modal-tank-1.jpg", "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80"))
                        .images(List.of(
                                saveOrGetUpload("products", "modal-tank-1.jpg", "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80"),
                                saveOrGetUpload("products", "modal-tank-2.jpg", "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80"),
                                saveOrGetUpload("products", "modal-tank-3.jpg", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80"),
                                saveOrGetUpload("products", "modal-tank-4.jpg", "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80"),
                                saveOrGetUpload("products", "modal-tank-5.jpg", "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=80")
                        ))
                        .sizes(List.of("XS", "S", "M", "L"))
                        .details(List.of("Fine 2x2 ribbing", "High crew neckline", "Seamless side construction"))
                        .features(List.of("Ultra-stretchy", "Soft breathable touch"))
                        .material("93% Lenzing Modal, 7% Elastane")
                        .careInstructions(List.of("Machine wash cold", "Lay flat to dry"))
                        .rating(4.8)
                        .reviewCount(19)
                        .reviews(new ArrayList<>())
                        .build(),

                // 12. Raw Selvedge Denim Jacket
                Product.builder()
                        .name("Raw Selvedge Denim Jacket")
                        .slug("raw-selvedge-denim-jacket")
                        .description("Unwashed 14oz Japanese red-line selvedge denim jacket designed to age uniquely with wear.")
                        .price(160.00)
                        .category("Jackets")
                        .gender("men")
                        .mainImage(saveOrGetUpload("products", "denim-jacket-1.jpg", "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80"))
                        .image(saveOrGetUpload("products", "denim-jacket-1.jpg", "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80"))
                        .images(List.of(
                                saveOrGetUpload("products", "denim-jacket-1.jpg", "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80"),
                                saveOrGetUpload("products", "denim-jacket-2.jpg", "https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=800&auto=format&fit=crop&q=80"),
                                saveOrGetUpload("products", "denim-jacket-3.jpg", "https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?w=800&auto=format&fit=crop&q=80"),
                                saveOrGetUpload("products", "denim-jacket-4.jpg", "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&auto=format&fit=crop&q=80"),
                                saveOrGetUpload("products", "denim-jacket-5.jpg", "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80")
                        ))
                        .sizes(List.of("S", "M", "L", "XL"))
                        .details(List.of("14oz Japanese Selvedge Denim", "Custom copper buttons", "Interior selvedge ID line"))
                        .features(List.of("Develops custom fades", "Sturdy heritage construction"))
                        .material("100% Selvedge Cotton")
                        .careInstructions(List.of("Cold soak only", "Hang dry in shade"))
                        .rating(4.9)
                        .reviewCount(25)
                        .reviews(new ArrayList<>())
                        .build()
        );

        List<Product> savedProducts = new ArrayList<>();
        for (Product p : productsToSeed) {
            Product existing = productRepository.findBySlug(p.getSlug()).orElse(null);
            if (existing != null) {
                existing.setName(p.getName());
                existing.setDescription(p.getDescription());
                existing.setPrice(p.getPrice());
                existing.setCategory(p.getCategory());
                existing.setGender(p.getGender());
                existing.setMainImage(p.getMainImage());
                existing.setImage(p.getImage());
                existing.setImages(p.getImages());
                existing.setSizes(p.getSizes());
                existing.setDetails(p.getDetails());
                existing.setFeatures(p.getFeatures());
                existing.setMaterial(p.getMaterial());
                existing.setCareInstructions(p.getCareInstructions());
                existing.setRating(p.getRating());
                existing.setReviewCount(p.getReviewCount());
                if (existing.getReviews() == null || existing.getReviews().isEmpty()) {
                    existing.setReviews(p.getReviews());
                }
                savedProducts.add(productRepository.save(existing));
            } else {
                savedProducts.add(productRepository.save(p));
            }
        }

        log.info("Seeded {} products with local /uploads/ images", savedProducts.size());
        return savedProducts;
    }

    private void seedFavorites(List<User> users, List<Product> products) {
        if (users.isEmpty() || products.isEmpty()) return;

        User user1 = users.stream().filter(u -> "puvanakopis@gmail.com".equalsIgnoreCase(u.getEmail())).findFirst().orElse(users.get(0));
        User user2 = users.stream().filter(u -> "puvanakopis1@gmail.com".equalsIgnoreCase(u.getEmail())).findFirst().orElse(users.get(1));
        User user3 = users.stream().filter(u -> "puvanakopis2@gmail.com".equalsIgnoreCase(u.getEmail())).findFirst().orElse(users.get(2));

        for (int i = 0; i < Math.min(4, products.size()); i++) {
            Product prod = products.get(i);
            if (!favoriteRepository.existsByUserEmailIgnoreCaseAndProductId(user1.getEmail(), prod.getId())) {
                favoriteRepository.save(Favorite.builder()
                        .user(user1)
                        .product(prod)
                        .build());
            }
        }

        for (int i = 2; i < Math.min(6, products.size()); i++) {
            Product prod = products.get(i);
            if (!favoriteRepository.existsByUserEmailIgnoreCaseAndProductId(user2.getEmail(), prod.getId())) {
                favoriteRepository.save(Favorite.builder()
                        .user(user2)
                        .product(prod)
                        .build());
            }
        }

        for (int i = 4; i < Math.min(8, products.size()); i++) {
            Product prod = products.get(i);
            if (!favoriteRepository.existsByUserEmailIgnoreCaseAndProductId(user3.getEmail(), prod.getId())) {
                favoriteRepository.save(Favorite.builder()
                        .user(user3)
                        .product(prod)
                        .build());
            }
        }
        log.info("Seeded user favorites");
    }

    private void seedCartItems(List<User> users, List<Product> products) {
        if (users.isEmpty() || products.isEmpty()) return;

        User user1 = users.stream().filter(u -> "puvanakopis@gmail.com".equalsIgnoreCase(u.getEmail())).findFirst().orElse(users.get(0));
        User user2 = users.stream().filter(u -> "puvanakopis1@gmail.com".equalsIgnoreCase(u.getEmail())).findFirst().orElse(users.get(1));
        User user3 = users.stream().filter(u -> "puvanakopis2@gmail.com".equalsIgnoreCase(u.getEmail())).findFirst().orElse(users.get(2));

        if (products.size() > 0) {
            Product p1 = products.get(0);
            if (cartItemRepository.findByUserEmailIgnoreCaseAndProductIdAndSizeAndColor(user1.getEmail(), p1.getId(), "M", "Black").isEmpty()) {
                cartItemRepository.save(CartItem.builder()
                        .user(user1)
                        .product(p1)
                        .size("M")
                        .color("Black")
                        .quantity(2)
                        .build());
            }
        }

        if (products.size() > 1) {
            Product p2 = products.get(1);
            if (cartItemRepository.findByUserEmailIgnoreCaseAndProductIdAndSizeAndColor(user1.getEmail(), p2.getId(), "L", "Heather Grey").isEmpty()) {
                cartItemRepository.save(CartItem.builder()
                        .user(user1)
                        .product(p2)
                        .size("L")
                        .color("Heather Grey")
                        .quantity(1)
                        .build());
            }
        }

        if (products.size() > 2) {
            Product p3 = products.get(2);
            if (cartItemRepository.findByUserEmailIgnoreCaseAndProductIdAndSizeAndColor(user2.getEmail(), p3.getId(), "L", "Charcoal").isEmpty()) {
                cartItemRepository.save(CartItem.builder()
                        .user(user2)
                        .product(p3)
                        .size("L")
                        .color("Charcoal")
                        .quantity(1)
                        .build());
            }
        }

        if (products.size() > 4) {
            Product p5 = products.get(4);
            if (cartItemRepository.findByUserEmailIgnoreCaseAndProductIdAndSizeAndColor(user3.getEmail(), p5.getId(), "M", "Olive").isEmpty()) {
                cartItemRepository.save(CartItem.builder()
                        .user(user3)
                        .product(p5)
                        .size("M")
                        .color("Olive")
                        .quantity(1)
                        .build());
            }
        }
        log.info("Seeded cart items");
    }

    private void seedOrders(List<User> users, List<Product> products) {
        if (users.isEmpty() || products.isEmpty()) return;

        User user1 = users.stream().filter(u -> "puvanakopis@gmail.com".equalsIgnoreCase(u.getEmail())).findFirst().orElse(users.get(0));
        User user2 = users.stream().filter(u -> "puvanakopis1@gmail.com".equalsIgnoreCase(u.getEmail())).findFirst().orElse(users.get(1));
        User user3 = users.stream().filter(u -> "puvanakopis2@gmail.com".equalsIgnoreCase(u.getEmail())).findFirst().orElse(users.get(2));

        // Order 1 for User 1
        String ord1Num = "ORD-20260901-1001";
        if (orderRepository.findByOrderNumber(ord1Num).isEmpty()) {
            Product p1 = products.get(0);
            Product p2 = products.get(1);

            double item1Subtotal = p1.getPrice() * 2;
            double item2Subtotal = p2.getPrice() * 1;
            double subtotal = item1Subtotal + item2Subtotal;
            double shipping = 10.00;
            double tax = subtotal * 0.05;
            double total = subtotal + shipping + tax;

            Order order1 = Order.builder()
                    .orderNumber(ord1Num)
                    .user(user1)
                    .customerEmail(user1.getEmail())
                    .fullName(user1.getFirstName() + " " + user1.getLastName())
                    .phoneNumber(user1.getPhoneNumber())
                    .streetAddress(user1.getShippingAddress())
                    .city("Colombo")
                    .district("Western")
                    .postalCode("00300")
                    .country("Sri Lanka")
                    .paymentMethod("CARD")
                    .paymentStatus("PAID")
                    .orderStatus("Delivered")
                    .subtotal(subtotal)
                    .shippingCost(shipping)
                    .tax(tax)
                    .totalAmount(total)
                    .items(new ArrayList<>())
                    .build();

            OrderItem item1 = OrderItem.builder()
                    .order(order1)
                    .product(p1)
                    .productName(p1.getName())
                    .productImage(p1.getMainImage())
                    .size("M")
                    .color("Black")
                    .price(p1.getPrice())
                    .quantity(2)
                    .subtotal(item1Subtotal)
                    .build();

            OrderItem item2 = OrderItem.builder()
                    .order(order1)
                    .product(p2)
                    .productName(p2.getName())
                    .productImage(p2.getMainImage())
                    .size("L")
                    .color("Heather Grey")
                    .price(p2.getPrice())
                    .quantity(1)
                    .subtotal(item2Subtotal)
                    .build();

            order1.getItems().add(item1);
            order1.getItems().add(item2);

            orderRepository.save(order1);
        }

        // Order 2 for User 2
        String ord2Num = "ORD-20260915-1002";
        if (orderRepository.findByOrderNumber(ord2Num).isEmpty()) {
            Product p3 = products.get(2);
            Product p4 = products.get(3);

            double item3Subtotal = p3.getPrice() * 1;
            double item4Subtotal = p4.getPrice() * 1;
            double subtotal = item3Subtotal + item4Subtotal;
            double shipping = 0.00;
            double tax = subtotal * 0.05;
            double total = subtotal + shipping + tax;

            Order order2 = Order.builder()
                    .orderNumber(ord2Num)
                    .user(user2)
                    .customerEmail(user2.getEmail())
                    .fullName(user2.getFirstName() + " " + user2.getLastName())
                    .phoneNumber(user2.getPhoneNumber())
                    .streetAddress(user2.getShippingAddress())
                    .city("Kandy")
                    .district("Central")
                    .postalCode("20000")
                    .country("Sri Lanka")
                    .paymentMethod("COD")
                    .paymentStatus("PENDING")
                    .orderStatus("Processing")
                    .subtotal(subtotal)
                    .shippingCost(shipping)
                    .tax(tax)
                    .totalAmount(total)
                    .items(new ArrayList<>())
                    .build();

            OrderItem item3 = OrderItem.builder()
                    .order(order2)
                    .product(p3)
                    .productName(p3.getName())
                    .productImage(p3.getMainImage())
                    .size("L")
                    .color("Navy")
                    .price(p3.getPrice())
                    .quantity(1)
                    .subtotal(item3Subtotal)
                    .build();

            OrderItem item4 = OrderItem.builder()
                    .order(order2)
                    .product(p4)
                    .productName(p4.getName())
                    .productImage(p4.getMainImage())
                    .size("M")
                    .color("Natural Linen")
                    .price(p4.getPrice())
                    .quantity(1)
                    .subtotal(item4Subtotal)
                    .build();

            order2.getItems().add(item3);
            order2.getItems().add(item4);

            orderRepository.save(order2);
        }

        // Order 3 for User 3
        String ord3Num = "ORD-20260920-1003";
        if (orderRepository.findByOrderNumber(ord3Num).isEmpty()) {
            Product p5 = products.get(4);
            Product p6 = products.get(5);

            double item5Subtotal = p5.getPrice() * 1;
            double item6Subtotal = p6.getPrice() * 1;
            double subtotal = item5Subtotal + item6Subtotal;
            double shipping = 5.00;
            double tax = subtotal * 0.05;
            double total = subtotal + shipping + tax;

            Order order3 = Order.builder()
                    .orderNumber(ord3Num)
                    .user(user3)
                    .customerEmail(user3.getEmail())
                    .fullName(user3.getFirstName() + " " + user3.getLastName())
                    .phoneNumber(user3.getPhoneNumber())
                    .streetAddress(user3.getShippingAddress())
                    .city("Jaffna")
                    .district("Northern")
                    .postalCode("40000")
                    .country("Sri Lanka")
                    .paymentMethod("CARD")
                    .paymentStatus("PAID")
                    .orderStatus("Shipped")
                    .subtotal(subtotal)
                    .shippingCost(shipping)
                    .tax(tax)
                    .totalAmount(total)
                    .items(new ArrayList<>())
                    .build();

            OrderItem item5 = OrderItem.builder()
                    .order(order3)
                    .product(p5)
                    .productName(p5.getName())
                    .productImage(p5.getMainImage())
                    .size("L")
                    .color("Olive")
                    .price(p5.getPrice())
                    .quantity(1)
                    .subtotal(item5Subtotal)
                    .build();

            OrderItem item6 = OrderItem.builder()
                    .order(order3)
                    .product(p6)
                    .productName(p6.getName())
                    .productImage(p6.getMainImage())
                    .size("S")
                    .color("Cream")
                    .price(p6.getPrice())
                    .quantity(1)
                    .subtotal(item6Subtotal)
                    .build();

            order3.getItems().add(item5);
            order3.getItems().add(item6);

            orderRepository.save(order3);
        }

        log.info("Seeded sample orders");
    }
}
