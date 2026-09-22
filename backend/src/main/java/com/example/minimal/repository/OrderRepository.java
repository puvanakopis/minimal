package com.example.minimal.repository;

import com.example.minimal.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findAllByOrderByCreatedAtDesc();

    List<Order> findByUserEmailIgnoreCaseOrderByCreatedAtDesc(String email);

    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Order> findByCustomerEmailIgnoreCaseOrderByCreatedAtDesc(String customerEmail);

    Optional<Order> findByOrderNumber(String orderNumber);
}
