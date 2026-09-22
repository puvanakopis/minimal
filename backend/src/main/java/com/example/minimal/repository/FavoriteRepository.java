package com.example.minimal.repository;

import com.example.minimal.model.Favorite;
import com.example.minimal.model.Product;
import com.example.minimal.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    List<Favorite> findByUserEmailIgnoreCaseOrderByCreatedAtDesc(String email);

    List<Favorite> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<Favorite> findByUserAndProduct(User user, Product product);

    Optional<Favorite> findByUserEmailIgnoreCaseAndProductId(String email, Long productId);

    Optional<Favorite> findByUserIdAndProductId(Long userId, Long productId);

    boolean existsByUserEmailIgnoreCaseAndProductId(String email, Long productId);

    boolean existsByUserIdAndProductId(Long userId, Long productId);

    void deleteByUserEmailIgnoreCaseAndProductId(String email, Long productId);

    void deleteByUserId(Long userId);

    void deleteByUserEmailIgnoreCase(String email);

    @Query("SELECT f.product.id FROM Favorite f WHERE LOWER(f.user.email) = LOWER(:email) ORDER BY f.createdAt DESC")
    List<Long> findProductIdsByUserEmailIgnoreCase(@Param("email") String email);
}
