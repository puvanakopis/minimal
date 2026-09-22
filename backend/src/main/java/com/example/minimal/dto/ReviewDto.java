package com.example.minimal.dto;

import com.example.minimal.model.Product;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewDto {
    private Long id;
    private Long productId;
    private Long userId;
    private String authorName;
    private String authorEmail;
    private Integer rating;
    private String title;
    private String comment;
    private LocalDateTime createdAt;

    public static ReviewDto fromEntity(Product.Review review) {
        return fromEntity(review, null);
    }

    public static ReviewDto fromEntity(Product.Review review, Long productId) {
        if (review == null) return null;
        return ReviewDto.builder()
                .id(review.getId())
                .productId(productId)
                .userId(review.getUserId())
                .authorName(review.getAuthorName())
                .authorEmail(review.getAuthorEmail())
                .rating(review.getRating())
                .title(review.getTitle())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
