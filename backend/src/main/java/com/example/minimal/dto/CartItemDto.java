package com.example.minimal.dto;

import com.example.minimal.model.CartItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemDto {
    private Long id;
    private Long productId;
    private String name;
    private String slug;
    private Double price;
    private String image;
    private String size;
    private String colorSize;
    private Integer quantity;
    private Double subtotal;

    public static CartItemDto fromEntity(CartItem item) {
        if (item == null) return null;

        String productName = item.getProduct() != null ? item.getProduct().getName() : "";
        String slug = item.getProduct() != null ? item.getProduct().getSlug() : "";
        Double price = item.getProduct() != null ? item.getProduct().getPrice() : 0.0;
        String image = "";
        if (item.getProduct() != null) {
            image = item.getProduct().getMainImage() != null ? item.getProduct().getMainImage() : item.getProduct().getImage();
        }

        String sizeDisplay = item.getSize() != null && !item.getSize().isBlank() ? "Size " + item.getSize() : "";

        int qty = item.getQuantity() != null ? item.getQuantity() : 1;
        double lineSubtotal = (price != null ? price : 0.0) * qty;

        return CartItemDto.builder()
                .id(item.getId())
                .productId(item.getProduct() != null ? item.getProduct().getId() : null)
                .name(productName)
                .slug(slug)
                .price(price)
                .image(image)
                .size(item.getSize())
                .colorSize(sizeDisplay)
                .quantity(qty)
                .subtotal(lineSubtotal)
                .build();
    }
}
