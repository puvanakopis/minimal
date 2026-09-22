package com.example.minimal.controller;

import com.example.minimal.dto.AddToCartRequest;
import com.example.minimal.dto.ApiResponse;
import com.example.minimal.dto.CartDto;
import com.example.minimal.dto.UpdateCartItemRequest;
import com.example.minimal.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    private String getAuthenticatedUserEmail(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getName())) {
            return null;
        }
        return authentication.getName();
    }

    @GetMapping
    public ResponseEntity<ApiResponse<CartDto>> getCart(Authentication authentication) {
        String email = getAuthenticatedUserEmail(authentication);
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Authentication required to view persisted cart"));
        }
        CartDto cart = cartService.getCart(email);
        return ResponseEntity.ok(ApiResponse.success("Cart retrieved successfully", cart));
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<CartDto>> addToCart(
            @Valid @RequestBody AddToCartRequest request,
            Authentication authentication
    ) {
        String email = getAuthenticatedUserEmail(authentication);
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Authentication required to add items to cart"));
        }
        CartDto cart = cartService.addToCart(email, request);
        return ResponseEntity.ok(ApiResponse.success("Item added to cart", cart));
    }

    @PutMapping("/item/{itemId}")
    public ResponseEntity<ApiResponse<CartDto>> updateCartItem(
            @PathVariable("itemId") Long itemId,
            @Valid @RequestBody UpdateCartItemRequest request,
            Authentication authentication
    ) {
        String email = getAuthenticatedUserEmail(authentication);
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Authentication required"));
        }
        CartDto cart = cartService.updateCartItem(email, itemId, request);
        return ResponseEntity.ok(ApiResponse.success("Cart item updated", cart));
    }

    @DeleteMapping("/item/{itemId}")
    public ResponseEntity<ApiResponse<CartDto>> removeCartItem(
            @PathVariable("itemId") Long itemId,
            Authentication authentication
    ) {
        String email = getAuthenticatedUserEmail(authentication);
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Authentication required"));
        }
        CartDto cart = cartService.removeCartItem(email, itemId);
        return ResponseEntity.ok(ApiResponse.success("Item removed from cart", cart));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<ApiResponse<Void>> clearCart(Authentication authentication) {
        String email = getAuthenticatedUserEmail(authentication);
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Authentication required"));
        }
        cartService.clearCart(email);
        return ResponseEntity.ok(ApiResponse.success("Cart cleared successfully", null));
    }

    @PostMapping("/sync")
    public ResponseEntity<ApiResponse<CartDto>> syncCart(
            @RequestBody List<AddToCartRequest> items,
            Authentication authentication
    ) {
        String email = getAuthenticatedUserEmail(authentication);
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Authentication required"));
        }
        CartDto cart = cartService.syncCart(email, items);
        return ResponseEntity.ok(ApiResponse.success("Cart synchronized successfully", cart));
    }
}
