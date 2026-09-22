package com.example.minimal.controller;

import com.example.minimal.dto.ApiResponse;
import com.example.minimal.dto.ProductDto;
import com.example.minimal.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/favorites")
public class FavoriteController {

    private final FavoriteService favoriteService;

    private String getAuthenticatedUserEmail(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getName())) {
            return null;
        }
        return authentication.getName();
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductDto>>> getFavorites(Authentication authentication) {
        String email = getAuthenticatedUserEmail(authentication);
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Authentication required"));
        }
        List<ProductDto> favorites = favoriteService.getFavoriteProducts(email);
        return ResponseEntity.ok(ApiResponse.success("Favorites fetched successfully", favorites));
    }

    @GetMapping("/ids")
    public ResponseEntity<ApiResponse<List<Long>>> getFavoriteIds(Authentication authentication) {
        String email = getAuthenticatedUserEmail(authentication);
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Authentication required"));
        }
        List<Long> ids = favoriteService.getFavoriteProductIds(email);
        return ResponseEntity.ok(ApiResponse.success("Favorite IDs fetched successfully", ids));
    }

    @PostMapping("/{productId}")
    public ResponseEntity<ApiResponse<ProductDto>> addFavorite(
            @PathVariable("productId") Long productId,
            Authentication authentication
    ) {
        String email = getAuthenticatedUserEmail(authentication);
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Authentication required"));
        }
        ProductDto product = favoriteService.addFavorite(email, productId);
        return ResponseEntity.ok(ApiResponse.success("Product added to favorites", product));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<ApiResponse<Void>> removeFavorite(
            @PathVariable("productId") Long productId,
            Authentication authentication
    ) {
        String email = getAuthenticatedUserEmail(authentication);
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Authentication required"));
        }
        favoriteService.removeFavorite(email, productId);
        return ResponseEntity.ok(ApiResponse.success("Product removed from favorites", null));
    }

    @PostMapping("/{productId}/toggle")
    public ResponseEntity<ApiResponse<Map<String, Object>>> toggleFavorite(
            @PathVariable("productId") Long productId,
            Authentication authentication
    ) {
        String email = getAuthenticatedUserEmail(authentication);
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Authentication required"));
        }
        boolean favorited = favoriteService.toggleFavorite(email, productId);
        Map<String, Object> data = new HashMap<>();
        data.put("productId", productId);
        data.put("favorited", favorited);
        String message = favorited ? "Product added to favorites" : "Product removed from favorites";
        return ResponseEntity.ok(ApiResponse.success(message, data));
    }

    @GetMapping("/check/{productId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkFavorite(
            @PathVariable("productId") Long productId,
            Authentication authentication
    ) {
        String email = getAuthenticatedUserEmail(authentication);
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Authentication required"));
        }
        boolean favorited = favoriteService.isFavorite(email, productId);
        Map<String, Object> data = new HashMap<>();
        data.put("productId", productId);
        data.put("favorited", favorited);
        return ResponseEntity.ok(ApiResponse.success("Favorite status checked", data));
    }
}
