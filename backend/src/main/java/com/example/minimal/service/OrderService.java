package com.example.minimal.service;

import com.example.minimal.dto.*;
import com.example.minimal.exception.AppException;
import com.example.minimal.model.CartItem;
import com.example.minimal.model.Order;
import com.example.minimal.model.OrderItem;
import com.example.minimal.model.Product;
import com.example.minimal.model.User;
import com.example.minimal.repository.CartItemRepository;
import com.example.minimal.repository.OrderRepository;
import com.example.minimal.repository.ProductRepository;
import com.example.minimal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private static final SecureRandom RANDOM = new SecureRandom();

    private String generateOrderNumber() {
        int code = 1000 + RANDOM.nextInt(9000);
        return "ORD-" + code;
    }

    @Transactional
    public OrderDto createOrder(String authenticatedEmail, CreateOrderRequest request) {
        ShippingDetailsDto shipping = request.getShippingDetails();
        if (shipping == null) {
            throw new AppException("Shipping details are required", HttpStatus.BAD_REQUEST);
        }

        User user = null;
        String customerEmail = shipping.getEmail();
        if (authenticatedEmail != null) {
            user = userRepository.findByEmailIgnoreCase(authenticatedEmail).orElse(null);
            if (user != null) {
                customerEmail = user.getEmail();
                // Optionally save shipping address to user profile if empty
                if (user.getPhoneNumber() == null || user.getPhoneNumber().isBlank()) {
                    user.setPhoneNumber(shipping.getPhone());
                }
                if (user.getShippingAddress() == null || user.getShippingAddress().isBlank()) {
                    user.setShippingAddress(shipping.getStreetAddress() + ", " + shipping.getCity());
                }
                userRepository.save(user);
            }
        }

        List<OrderItem> orderItems = new ArrayList<>();
        double subtotal = 0.0;

        // Determine items: check if custom items list is provided, otherwise pull from user's DB cart
        if (request.getItems() != null && !request.getItems().isEmpty()) {
            for (AddToCartRequest itemReq : request.getItems()) {
                Product product = productRepository.findById(itemReq.getProductId())
                        .orElseThrow(() -> new AppException("Product not found with id: " + itemReq.getProductId(), HttpStatus.NOT_FOUND));

                int qty = itemReq.getQuantity() != null && itemReq.getQuantity() > 0 ? itemReq.getQuantity() : 1;
                double price = product.getPrice() != null ? product.getPrice() : 0.0;
                double lineTotal = price * qty;
                subtotal += lineTotal;

                String img = product.getMainImage() != null ? product.getMainImage() : product.getImage();

                OrderItem orderItem = OrderItem.builder()
                        .product(product)
                        .productName(product.getName())
                        .productImage(img)
                        .color(itemReq.getColor())
                        .size(itemReq.getSize())
                        .price(price)
                        .quantity(qty)
                        .subtotal(lineTotal)
                        .build();

                orderItems.add(orderItem);
            }
        } else if (user != null) {
            List<CartItem> cartItems = cartItemRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
            if (cartItems.isEmpty()) {
                throw new AppException("Your shopping bag is empty", HttpStatus.BAD_REQUEST);
            }

            for (CartItem cartItem : cartItems) {
                Product product = cartItem.getProduct();
                int qty = cartItem.getQuantity() != null && cartItem.getQuantity() > 0 ? cartItem.getQuantity() : 1;
                double price = product.getPrice() != null ? product.getPrice() : 0.0;
                double lineTotal = price * qty;
                subtotal += lineTotal;

                String img = product.getMainImage() != null ? product.getMainImage() : product.getImage();

                OrderItem orderItem = OrderItem.builder()
                        .product(product)
                        .productName(product.getName())
                        .productImage(img)
                        .color(cartItem.getColor())
                        .size(cartItem.getSize())
                        .price(price)
                        .quantity(qty)
                        .subtotal(lineTotal)
                        .build();

                orderItems.add(orderItem);
            }

            // Clear DB cart once converted into order
            cartItemRepository.deleteByUserId(user.getId());
        } else {
            throw new AppException("No order items provided", HttpStatus.BAD_REQUEST);
        }

        double shippingCost = subtotal > 25000 || subtotal == 0 ? 0.0 : 1500.0;
        double tax = 0.0;
        double totalAmount = subtotal + shippingCost + tax;

        String paymentMethod = request.getPaymentMethod() != null ? request.getPaymentMethod() : "CARD";
        String paymentStatus = request.getPaymentStatus() != null ? request.getPaymentStatus() : ("CASH_ON_DELIVERY".equalsIgnoreCase(paymentMethod) ? "PENDING" : "PAID");

        Order order = Order.builder()
                .orderNumber(generateOrderNumber())
                .user(user)
                .customerEmail(customerEmail)
                .fullName(shipping.getFullName())
                .phoneNumber(shipping.getPhone())
                .streetAddress(shipping.getStreetAddress())
                .city(shipping.getCity())
                .district(shipping.getDistrict())
                .postalCode(shipping.getPostalCode())
                .country(shipping.getCountry() != null ? shipping.getCountry() : "Sri Lanka")
                .paymentMethod(paymentMethod)
                .paymentStatus(paymentStatus)
                .orderStatus("Processing")
                .subtotal(subtotal)
                .shippingCost(shippingCost)
                .tax(tax)
                .totalAmount(totalAmount)
                .build();

        for (OrderItem oi : orderItems) {
            oi.setOrder(order);
        }
        order.setItems(orderItems);

        Order saved = orderRepository.save(order);
        log.info("Successfully created order {} for customer {}", saved.getOrderNumber(), customerEmail);

        return OrderDto.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<OrderDto> getUserOrders(String email) {
        return orderRepository.findByUserEmailIgnoreCaseOrderByCreatedAtDesc(email)
                .stream()
                .map(OrderDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrderDto getOrderById(String email, Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new AppException("Order not found with id: " + id, HttpStatus.NOT_FOUND));

        if (email != null && (order.getUser() == null || !order.getUser().getEmail().equalsIgnoreCase(email))) {
            if (!order.getCustomerEmail().equalsIgnoreCase(email)) {
                throw new AppException("Unauthorized to access this order", HttpStatus.FORBIDDEN);
            }
        }

        return OrderDto.fromEntity(order);
    }

    @Transactional(readOnly = true)
    public OrderDto getOrderByOrderNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new AppException("Order not found with number: " + orderNumber, HttpStatus.NOT_FOUND));
        return OrderDto.fromEntity(order);
    }

    @Transactional(readOnly = true)
    public List<OrderDto> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(OrderDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteOrder(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new AppException("Order not found with id: " + id, HttpStatus.NOT_FOUND));
        orderRepository.delete(order);
        log.info("Admin deleted order ID: {}, Number: {}", order.getId(), order.getOrderNumber());
    }

    @Transactional
    public OrderDto updateOrderStatus(Long id, UpdateOrderStatusRequest request) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new AppException("Order not found with id: " + id, HttpStatus.NOT_FOUND));

        if (request.getOrderStatus() != null && !request.getOrderStatus().isBlank()) {
            order.setOrderStatus(request.getOrderStatus());
        }
        if (request.getPaymentStatus() != null && !request.getPaymentStatus().isBlank()) {
            order.setPaymentStatus(request.getPaymentStatus());
        }

        Order updated = orderRepository.save(order);
        log.info("Updated status for order {}: status={}, paymentStatus={}", updated.getOrderNumber(), updated.getOrderStatus(), updated.getPaymentStatus());
        return OrderDto.fromEntity(updated);
    }
}
