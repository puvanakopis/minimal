package com.example.minimal.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateOrderRequest {

    @NotNull(message = "Shipping details are required")
    @Valid
    private ShippingDetailsDto shippingDetails;

    @Builder.Default
    private String paymentMethod = "CARD";

    private String paymentStatus;

    // Optional list of items. If null or empty, uses the items from the user's database cart
    private List<AddToCartRequest> items;
}
