package com.example.minimal.service;

import com.example.minimal.dto.ProductDto;
import com.example.minimal.exception.AppException;
import com.example.minimal.model.Favorite;
import com.example.minimal.model.Product;
import com.example.minimal.model.User;
import com.example.minimal.repository.FavoriteRepository;
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
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public List<ProductDto> getFavoriteProducts(String email) {
        return favoriteRepository.findByUserEmailIgnoreCaseOrderByCreatedAtDesc(email)
                .stream()
                .map(favorite -> ProductDto.fromEntity(favorite.getProduct()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<Long> getFavoriteProductIds(String email) {
        return favoriteRepository.findProductIdsByUserEmailIgnoreCase(email);
    }

    @Transactional
    public ProductDto addFavorite(String email, Long productId) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException("Product not found with id: " + productId, HttpStatus.NOT_FOUND));

        Optional<Favorite> existing = favoriteRepository.findByUserAndProduct(user, product);
        if (existing.isEmpty()) {
            Favorite favorite = Favorite.builder()
                    .user(user)
                    .product(product)
                    .build();
            favoriteRepository.save(favorite);
            log.info("Product ID {} added to favorites for user {}", productId, email);
        }

        return ProductDto.fromEntity(product);
    }

    @Transactional
    public void removeFavorite(String email, Long productId) {
        if (favoriteRepository.existsByUserEmailIgnoreCaseAndProductId(email, productId)) {
            favoriteRepository.deleteByUserEmailIgnoreCaseAndProductId(email, productId);
            log.info("Product ID {} removed from favorites for user {}", productId, email);
        }
    }

    @Transactional
    public boolean toggleFavorite(String email, Long productId) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException("Product not found with id: " + productId, HttpStatus.NOT_FOUND));

        Optional<Favorite> existing = favoriteRepository.findByUserAndProduct(user, product);
        if (existing.isPresent()) {
            favoriteRepository.delete(existing.get());
            log.info("Product ID {} removed from favorites via toggle for user {}", productId, email);
            return false;
        } else {
            Favorite favorite = Favorite.builder()
                    .user(user)
                    .product(product)
                    .build();
            favoriteRepository.save(favorite);
            log.info("Product ID {} added to favorites via toggle for user {}", productId, email);
            return true;
        }
    }

    @Transactional(readOnly = true)
    public boolean isFavorite(String email, Long productId) {
        return favoriteRepository.existsByUserEmailIgnoreCaseAndProductId(email, productId);
    }
}
