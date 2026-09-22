package com.example.minimal.dto;

import com.example.minimal.model.OrderItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemDto {
    private Long id;
    private Long productId;
    private String name;
    private String image;
    private String color;
    private String size;
    private Double price;
    private Integer quantity;
    private Double subtotal;

    public static OrderItemDto fromEntity(OrderItem item) {
        if (item == null) return null;
        return OrderItemDto.builder()
                .id(item.getId())
                .productId(item.getProduct() != null ? item.getProduct().getId() : null)
                .name(item.getProductName())
                .image(item.getProductImage())
                .color(item.getColor())
                .size(item.getSize())
                .price(item.getPrice())
                .quantity(item.getQuantity())
                .subtotal(item.getSubtotal())
                .build();
    }
}
