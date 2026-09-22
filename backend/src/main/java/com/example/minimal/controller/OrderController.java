package com.example.minimal.controller;

import com.example.minimal.dto.ApiResponse;
import com.example.minimal.dto.CreateOrderRequest;
import com.example.minimal.dto.OrderDto;
import com.example.minimal.dto.UpdateOrderStatusRequest;
import com.example.minimal.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    private String getAuthenticatedUserEmail(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getName())) {
            return null;
        }
        return authentication.getName();
    }

    @PostMapping
    public ResponseEntity<ApiResponse<OrderDto>> createOrder(
            @Valid @RequestBody CreateOrderRequest request,
            Authentication authentication
    ) {
        String email = getAuthenticatedUserEmail(authentication);
        OrderDto order = orderService.createOrder(email, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Order placed successfully!", order));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderDto>>> getUserOrders(Authentication authentication) {
        String email = getAuthenticatedUserEmail(authentication);
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Authentication required to view orders"));
        }
        List<OrderDto> orders = orderService.getUserOrders(email);
        return ResponseEntity.ok(ApiResponse.success("Orders retrieved successfully", orders));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderDto>> getOrderById(
            @PathVariable("id") Long id,
            Authentication authentication
    ) {
        String email = getAuthenticatedUserEmail(authentication);
        OrderDto order = orderService.getOrderById(email, id);
        return ResponseEntity.ok(ApiResponse.success("Order retrieved successfully", order));
    }

    @GetMapping("/track/{orderNumber}")
    public ResponseEntity<ApiResponse<OrderDto>> trackOrderByNumber(@PathVariable("orderNumber") String orderNumber) {
        OrderDto order = orderService.getOrderByOrderNumber(orderNumber);
        return ResponseEntity.ok(ApiResponse.success("Order status retrieved", order));
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<OrderDto>>> getAllOrders() {
        List<OrderDto> orders = orderService.getAllOrders();
        return ResponseEntity.ok(ApiResponse.success("All orders retrieved successfully", orders));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<OrderDto>> updateOrderStatus(
            @PathVariable("id") Long id,
            @RequestBody UpdateOrderStatusRequest request
    ) {
        OrderDto order = orderService.updateOrderStatus(id, request);
        return ResponseEntity.ok(ApiResponse.success("Order status updated successfully", order));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteOrder(@PathVariable("id") Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.ok(ApiResponse.success("Order deleted successfully", null));
    }
}
