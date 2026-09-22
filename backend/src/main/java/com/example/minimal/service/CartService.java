package com.example.minimal.service;

import com.example.minimal.dto.AddToCartRequest;
import com.example.minimal.dto.CartDto;
import com.example.minimal.dto.CartItemDto;
import com.example.minimal.dto.UpdateCartItemRequest;
import com.example.minimal.exception.AppException;
import com.example.minimal.model.CartItem;
import com.example.minimal.model.Product;
import com.example.minimal.model.User;
import com.example.minimal.repository.CartItemRepository;
import com.example.minimal.repository.ProductRepository;
import com.example.minimal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public CartDto getCart(String email) {
        List<CartItem> items = cartItemRepository.findByUserEmailIgnoreCaseOrderByCreatedAtDesc(email);
        List<CartItemDto> itemDtos = items.stream()
                .map(CartItemDto::fromEntity)
                .collect(Collectors.toList());
        return CartDto.create(itemDtos);
    }

    @Transactional
    public CartDto addToCart(String email, AddToCartRequest request) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new AppException("Product not found with id: " + request.getProductId(), HttpStatus.NOT_FOUND));

        String size = request.getSize() != null ? request.getSize() : "";
        String color = request.getColor() != null ? request.getColor() : "";
        int quantityToAdd = request.getQuantity() != null && request.getQuantity() > 0 ? request.getQuantity() : 1;

        Optional<CartItem> existing = cartItemRepository.findByUserAndProductAndSizeAndColor(user, product, size, color);

        if (existing.isPresent()) {
            CartItem item = existing.get();
            item.setQuantity(item.getQuantity() + quantityToAdd);
            cartItemRepository.save(item);
            log.info("Increased quantity for product ID {} in cart for user {}", product.getId(), email);
        } else {
            CartItem newItem = CartItem.builder()
                    .user(user)
                    .product(product)
                    .size(size)
                    .color(color)
                    .quantity(quantityToAdd)
                    .build();
            cartItemRepository.save(newItem);
            log.info("Added new product ID {} to cart for user {}", product.getId(), email);
        }

        return getCart(email);
    }

    @Transactional
    public CartDto updateCartItem(String email, Long itemId, UpdateCartItemRequest request) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new AppException("Cart item not found with id: " + itemId, HttpStatus.NOT_FOUND));

        if (!item.getUser().getEmail().equalsIgnoreCase(email)) {
            throw new AppException("Unauthorized to modify this cart item", HttpStatus.FORBIDDEN);
        }

        if (request.getQuantity() <= 0) {
            cartItemRepository.delete(item);
            log.info("Deleted cart item ID {} for user {}", itemId, email);
        } else {
            item.setQuantity(request.getQuantity());
            cartItemRepository.save(item);
            log.info("Updated quantity for cart item ID {} to {} for user {}", itemId, request.getQuantity(), email);
        }

        return getCart(email);
    }

    @Transactional
    public CartDto removeCartItem(String email, Long itemId) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new AppException("Cart item not found with id: " + itemId, HttpStatus.NOT_FOUND));

        if (!item.getUser().getEmail().equalsIgnoreCase(email)) {
            throw new AppException("Unauthorized to delete this cart item", HttpStatus.FORBIDDEN);
        }

        cartItemRepository.delete(item);
        log.info("Removed cart item ID {} for user {}", itemId, email);
        return getCart(email);
    }

    @Transactional
    public void clearCart(String email) {
        cartItemRepository.deleteByUserEmailIgnoreCase(email);
        log.info("Cleared cart for user {}", email);
    }

    @Transactional
    public CartDto syncCart(String email, List<AddToCartRequest> items) {
        if (items != null && !items.isEmpty()) {
            for (AddToCartRequest req : items) {
                if (req.getProductId() != null) {
                    try {
                        addToCart(email, req);
                    } catch (Exception e) {
                        log.warn("Failed to sync cart item for product ID {}: {}", req.getProductId(), e.getMessage());
                    }
                }
            }
        }
        return getCart(email);
    }
}
