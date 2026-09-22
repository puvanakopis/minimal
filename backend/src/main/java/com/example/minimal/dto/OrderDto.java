package com.example.minimal.dto;

import com.example.minimal.model.Order;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDto {
    private Long id;
    private String orderNumber;
    private String customerEmail;
    private String fullName;
    private String phoneNumber;
    private String streetAddress;
    private String city;
    private String district;
    private String postalCode;
    private String country;
    private String paymentMethod;
    private String paymentStatus;
    private String orderStatus;
    private Double subtotal;
    private Double shippingCost;
    private Double tax;
    private Double totalAmount;
    private List<OrderItemDto> items;
    private LocalDateTime createdAt;
    private String date;

    public static OrderDto fromEntity(Order order) {
        if (order == null) return null;

        List<OrderItemDto> itemDtos = order.getItems() != null
                ? order.getItems().stream()
                        .map(OrderItemDto::fromEntity)
                        .collect(Collectors.toList())
                : new ArrayList<>();

        String formattedDate = "";
        if (order.getCreatedAt() != null) {
            formattedDate = order.getCreatedAt().format(DateTimeFormatter.ofPattern("MMMM d, yyyy"));
        }

        return OrderDto.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .customerEmail(order.getCustomerEmail())
                .fullName(order.getFullName())
                .phoneNumber(order.getPhoneNumber())
                .streetAddress(order.getStreetAddress())
                .city(order.getCity())
                .district(order.getDistrict())
                .postalCode(order.getPostalCode())
                .country(order.getCountry())
                .paymentMethod(order.getPaymentMethod())
                .paymentStatus(order.getPaymentStatus())
                .orderStatus(order.getOrderStatus())
                .subtotal(order.getSubtotal())
                .shippingCost(order.getShippingCost())
                .tax(order.getTax())
                .totalAmount(order.getTotalAmount())
                .items(itemDtos)
                .createdAt(order.getCreatedAt())
                .date(formattedDate)
                .build();
    }
}
