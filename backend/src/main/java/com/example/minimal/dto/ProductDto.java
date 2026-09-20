package com.example.minimal.dto;

import com.example.minimal.model.Product;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDto {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private Double price;
    private String category;
    private String gender;
    private String mainImage;
    private String image;
    private List<String> images;
    private List<ProductColorDto> colors;
    private List<String> sizes;
    private List<String> details;
    private List<String> features;
    private String material;
    private List<String> careInstructions;
    private Double rating;
    private Integer reviewCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ProductDto fromEntity(Product product) {
        if (product == null) return null;

        List<ProductColorDto> colorDtos = product.getColors() != null
                ? product.getColors().stream()
                        .map(ProductColorDto::fromEntity)
                        .collect(Collectors.toList())
                : new ArrayList<>();

        return ProductDto.builder()
                .id(product.getId())
                .name(product.getName())
                .slug(product.getSlug())
                .description(product.getDescription())
                .price(product.getPrice())
                .category(product.getCategory())
                .gender(product.getGender())
                .mainImage(product.getMainImage() != null ? product.getMainImage() : product.getImage())
                .image(product.getImage())
                .images(product.getImages() != null ? new ArrayList<>(product.getImages()) : new ArrayList<>())
                .colors(colorDtos)
                .sizes(product.getSizes() != null ? new ArrayList<>(product.getSizes()) : new ArrayList<>())
                .details(product.getDetails() != null ? new ArrayList<>(product.getDetails()) : new ArrayList<>())
                .features(product.getFeatures() != null ? new ArrayList<>(product.getFeatures()) : new ArrayList<>())
                .material(product.getMaterial())
                .careInstructions(product.getCareInstructions() != null ? new ArrayList<>(product.getCareInstructions()) : new ArrayList<>())
                .rating(product.getRating() != null ? product.getRating() : 0.0)
                .reviewCount(product.getReviewCount() != null ? product.getReviewCount() : 0)
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }
}
