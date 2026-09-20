package com.example.minimal.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateProductRequest {

    @NotBlank(message = "Product name is required")
    private String name;

    private String slug;

    private String description;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be greater than 0")
    private Double price;

    private String category;

    private String gender;

    private String mainImage;

    @NotBlank(message = "Product image is required")
    private String image;

    @jakarta.validation.constraints.Size(max = 5, message = "A maximum of 5 images is allowed per product")
    private List<String> images;

    private List<ProductColorDto> colors;

    private List<String> sizes;

    private List<String> details;

    private List<String> features;

    private String material;

    private List<String> careInstructions;
}
