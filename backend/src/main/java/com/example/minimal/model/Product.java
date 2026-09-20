package com.example.minimal.model;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.persistence.*;
import lombok.*;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Table(name = "products", indexes = {
        @Index(name = "idx_products_slug", columnList = "slug", unique = true),
        @Index(name = "idx_products_category", columnList = "category"),
        @Index(name = "idx_products_gender", columnList = "gender")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Slf4j
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "slug", nullable = false, unique = true, length = 255)
    private String slug;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "price", nullable = false)
    private Double price;

    @Column(name = "category", length = 100)
    private String category;

    @Column(name = "gender", nullable = false, length = 50)
    @Builder.Default
    private String gender = "unisex";

    @Column(name = "main_image", columnDefinition = "TEXT")
    private String mainImage;

    @Column(name = "image", columnDefinition = "TEXT", nullable = false)
    private String image;

    @Convert(converter = StringListConverter.class)
    @Column(name = "images", columnDefinition = "LONGTEXT")
    @Builder.Default
    private List<String> images = new ArrayList<>();

    @Convert(converter = ProductColorListConverter.class)
    @Column(name = "colors", columnDefinition = "LONGTEXT")
    @Builder.Default
    private List<ProductColor> colors = new ArrayList<>();

    @Convert(converter = StringListConverter.class)
    @Column(name = "sizes", columnDefinition = "TEXT")
    @Builder.Default
    private List<String> sizes = new ArrayList<>();

    @Convert(converter = StringListConverter.class)
    @Column(name = "details", columnDefinition = "TEXT")
    @Builder.Default
    private List<String> details = new ArrayList<>();

    @Convert(converter = StringListConverter.class)
    @Column(name = "features", columnDefinition = "TEXT")
    @Builder.Default
    private List<String> features = new ArrayList<>();

    @Column(name = "material", length = 255)
    private String material;

    @Convert(converter = StringListConverter.class)
    @Column(name = "care_instructions", columnDefinition = "TEXT")
    @Builder.Default
    private List<String> careInstructions = new ArrayList<>();

    @Convert(converter = ReviewListConverter.class)
    @Column(name = "reviews", columnDefinition = "LONGTEXT")
    @Builder.Default
    private List<Review> reviews = new ArrayList<>();

    @Column(name = "rating")
    @Builder.Default
    private Double rating = 0.0;

    @Column(name = "review_count")
    @Builder.Default
    private Integer reviewCount = 0;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.mainImage == null && this.image != null) {
            this.mainImage = this.image;
        }
        if (this.rating == null) {
            this.rating = 0.0;
        }
        if (this.reviewCount == null) {
            this.reviewCount = 0;
        }
        if (this.images == null) {
            this.images = new ArrayList<>();
        }
        if (this.colors == null) {
            this.colors = new ArrayList<>();
        }
        if (this.sizes == null) {
            this.sizes = new ArrayList<>();
        }
        if (this.details == null) {
            this.details = new ArrayList<>();
        }
        if (this.features == null) {
            this.features = new ArrayList<>();
        }
        if (this.careInstructions == null) {
            this.careInstructions = new ArrayList<>();
        }
        if (this.reviews == null) {
            this.reviews = new ArrayList<>();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
        if (this.mainImage == null && this.image != null) {
            this.mainImage = this.image;
        }
    }

    // NESTED MODEL: ProductColor
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ProductColor {
        private String id;
        private String name;
        private String hex;
    }

    // NESTED MODEL: Review
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Review {
        private Long id;
        private Long userId;
        private String authorName;
        private String authorEmail;
        private Integer rating;
        private String title;
        private String comment;
        private LocalDateTime createdAt;
    }

    // CONVERTERS
    @Converter
    public static class ProductColorListConverter implements AttributeConverter<List<ProductColor>, String> {
        private static final ObjectMapper mapper = new ObjectMapper();

        @Override
        public String convertToDatabaseColumn(List<ProductColor> attribute) {
            if (attribute == null || attribute.isEmpty()) {
                return "[]";
            }
            try {
                return mapper.writeValueAsString(attribute);
            } catch (Exception e) {
                log.error("Error converting colors to JSON string", e);
                return "[]";
            }
        }

        @Override
        public List<ProductColor> convertToEntityAttribute(String dbData) {
            if (dbData == null || dbData.isBlank()) {
                return new ArrayList<>();
            }
            try {
                return mapper.readValue(dbData, new TypeReference<List<ProductColor>>() {});
            } catch (Exception e) {
                log.warn("Non-JSON or legacy format in ProductColorListConverter for data: {}, parsing fallback", dbData);
                try {
                    String clean = dbData.trim();
                    if (clean.startsWith("[") && clean.endsWith("]")) {
                        clean = clean.substring(1, clean.length() - 1).trim();
                    }
                    if (clean.isEmpty()) {
                        return new ArrayList<>();
                    }
                    return Arrays.stream(clean.split(","))
                            .map(s -> s.replace("\"", "").replace("'", "").trim())
                            .filter(s -> !s.isEmpty())
                            .map(name -> ProductColor.builder()
                                    .id(name.toLowerCase().replaceAll("[^a-z0-9]", "-"))
                                    .name(name)
                                    .hex("#000000")
                                    .build())
                            .collect(Collectors.toList());
                } catch (Exception ex) {
                    return new ArrayList<>();
                }
            }
        }
    }

    @Converter
    public static class ReviewListConverter implements AttributeConverter<List<Review>, String> {
        private static final ObjectMapper mapper = new ObjectMapper()
                .registerModule(new JavaTimeModule())
                .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        @Override
        public String convertToDatabaseColumn(List<Review> attribute) {
            if (attribute == null || attribute.isEmpty()) {
                return "[]";
            }
            try {
                return mapper.writeValueAsString(attribute);
            } catch (Exception e) {
                log.error("Error converting reviews to JSON string", e);
                return "[]";
            }
        }

        @Override
        public List<Review> convertToEntityAttribute(String dbData) {
            if (dbData == null || dbData.isBlank()) {
                return new ArrayList<>();
            }
            try {
                return mapper.readValue(dbData, new TypeReference<List<Review>>() {});
            } catch (Exception e) {
                log.warn("Error reading reviews from JSON: {}", dbData, e);
                return new ArrayList<>();
            }
        }
    }

    @Converter
    public static class StringListConverter implements AttributeConverter<List<String>, String> {
        private static final ObjectMapper mapper = new ObjectMapper();

        @Override
        public String convertToDatabaseColumn(List<String> attribute) {
            if (attribute == null || attribute.isEmpty()) {
                return "[]";
            }
            try {
                return mapper.writeValueAsString(attribute);
            } catch (Exception e) {
                log.error("Error converting list of strings to JSON string", e);
                return "[]";
            }
        }

        @Override
        public List<String> convertToEntityAttribute(String dbData) {
            if (dbData == null || dbData.isBlank()) {
                return new ArrayList<>();
            }
            try {
                return mapper.readValue(dbData, new TypeReference<List<String>>() {});
            } catch (Exception e) {
                log.warn("Non-JSON or legacy format in StringListConverter for data: {}, parsing fallback", dbData);
                try {
                    String clean = dbData.trim();
                    if (clean.startsWith("[") && clean.endsWith("]")) {
                        clean = clean.substring(1, clean.length() - 1).trim();
                    }
                    if (clean.isEmpty()) {
                        return new ArrayList<>();
                    }
                    return Arrays.stream(clean.split(","))
                            .map(s -> s.replace("\"", "").replace("'", "").trim())
                            .filter(s -> !s.isEmpty())
                            .collect(Collectors.toList());
                } catch (Exception ex) {
                    return new ArrayList<>();
                }
            }
        }
    }
}
