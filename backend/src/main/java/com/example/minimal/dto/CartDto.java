package com.example.minimal.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartDto {
    @Builder.Default
    private List<CartItemDto> items = new ArrayList<>();
    private Integer totalItems;
    private Double subtotal;
    private Double tax;
    private Double shippingCost;
    private Double total;

    public static CartDto create(List<CartItemDto> items) {
        if (items == null) items = new ArrayList<>();
        int count = items.stream().mapToInt(CartItemDto::getQuantity).sum();
        double sub = items.stream().mapToDouble(CartItemDto::getSubtotal).sum();
        double shipping = sub > 25000 || sub == 0 ? 0.0 : 1500.0;
        double tax = 0.0;
        double total = sub + shipping + tax;

        return CartDto.builder()
                .items(items)
                .totalItems(count)
                .subtotal(sub)
                .shippingCost(shipping)
                .tax(tax)
                .total(total)
                .build();
    }
}
