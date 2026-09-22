package com.example.minimal.repository;

import com.example.minimal.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findBySlug(String slug);

    boolean existsBySlug(String slug);

    List<Product> findByCategoryIgnoreCase(String category);

    List<Product> findByGenderIgnoreCase(String gender);

    @Query("SELECT p FROM Product p WHERE " +
           "(:category IS NULL OR LOWER(p.category) = LOWER(:category)) AND " +
           "(:gender IS NULL OR LOWER(p.gender) = LOWER(:gender) OR LOWER(p.gender) = 'unisex') AND " +
           "(:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Product> findWithFilters(
            @Param("category") String category,
            @Param("gender") String gender,
            @Param("search") String search
    );
}
