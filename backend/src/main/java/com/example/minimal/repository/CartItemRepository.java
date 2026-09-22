package com.example.minimal.repository;

import com.example.minimal.model.CartItem;
import com.example.minimal.model.Product;
import com.example.minimal.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    List<CartItem> findByUserEmailIgnoreCaseOrderByCreatedAtDesc(String email);

    List<CartItem> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<CartItem> findByUserAndProductAndSizeAndColor(User user, Product product, String size, String color);

    Optional<CartItem> findByUserEmailIgnoreCaseAndProductIdAndSizeAndColor(String email, Long productId, String size, String color);

    void deleteByUserEmailIgnoreCase(String email);

    void deleteByUserId(Long userId);
}
