package com.quickcommerce.backend.repository;

import com.quickcommerce.backend.model.Order;
import com.quickcommerce.backend.model.Order.OrderStatus;
import com.quickcommerce.backend.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    // Find orders by user
    Page<Order> findByUser(User user, Pageable pageable);
    
    // Find orders by user and status
    Page<Order> findByUserAndStatus(User user, OrderStatus status, Pageable pageable);
    
    // Find order by order number
    Optional<Order> findByOrderNumber(String orderNumber);
    
    // Find orders by delivery partner
    Page<Order> findByDeliveryPartner(User deliveryPartner, Pageable pageable);
    
    // Find orders by delivery partner and status
    Page<Order> findByDeliveryPartnerAndStatus(User deliveryPartner, OrderStatus status, Pageable pageable);
    
    // Find orders by date range
    Page<Order> findByOrderDateBetween(LocalDateTime start, LocalDateTime end, Pageable pageable);
    
    // Find orders by status
    Page<Order> findByStatus(OrderStatus status, Pageable pageable);
    
    // Find recent orders for a user
    List<Order> findTop5ByUserOrderByOrderDateDesc(User user);
    
    // Count orders by status
    long countByStatus(OrderStatus status);
    
    // Count orders by user
    long countByUser(User user);
} 