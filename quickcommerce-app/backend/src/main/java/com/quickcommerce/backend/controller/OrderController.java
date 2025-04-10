package com.quickcommerce.backend.controller;

import com.quickcommerce.backend.dto.CartDTO;
import com.quickcommerce.backend.dto.CreateOrderRequest;
import com.quickcommerce.backend.dto.OrderDTO;
import com.quickcommerce.backend.model.Order.OrderStatus;
import com.quickcommerce.backend.model.User;
import com.quickcommerce.backend.security.CurrentUser;
import com.quickcommerce.backend.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Slf4j
public class OrderController {

    private final OrderService orderService;
    
    /**
     * Create a new order
     */
    @PostMapping
    public ResponseEntity<OrderDTO> createOrder(
            @CurrentUser User user,
            @Valid @RequestBody CreateOrderRequest request) {
        
        log.info("Creating order for user: {}", user.getEmail());
        OrderDTO order = orderService.createOrder(user, request);
        return ResponseEntity.ok(order);
    }
    
    /**
     * Get user's order history
     */
    @GetMapping
    public ResponseEntity<Page<OrderDTO>> getUserOrders(
            @CurrentUser User user,
            @RequestParam(required = false) OrderStatus status,
            @PageableDefault(size = 10) Pageable pageable) {
        
        log.info("Fetching orders for user: {}, status: {}", user.getEmail(), status);
        
        Page<OrderDTO> orders;
        if (status != null) {
            orders = orderService.getUserOrdersByStatus(user, status, pageable);
        } else {
            orders = orderService.getUserOrders(user, pageable);
        }
        
        return ResponseEntity.ok(orders);
    }
    
    /**
     * Get order details by ID
     */
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDTO> getOrderById(
            @CurrentUser User user,
            @PathVariable Long orderId) {
        
        log.info("Fetching order details for user: {}, orderId: {}", user.getEmail(), orderId);
        OrderDTO order = orderService.getOrderById(user, orderId);
        return ResponseEntity.ok(order);
    }
    
    /**
     * Cancel an order
     */
    @PostMapping("/{orderId}/cancel")
    public ResponseEntity<OrderDTO> cancelOrder(
            @CurrentUser User user,
            @PathVariable Long orderId) {
        
        log.info("Cancelling order for user: {}, orderId: {}", user.getEmail(), orderId);
        OrderDTO order = orderService.cancelOrder(user, orderId);
        return ResponseEntity.ok(order);
    }
    
    /**
     * Track order delivery
     */
    @GetMapping("/{orderId}/tracking")
    public ResponseEntity<OrderDTO> trackOrder(
            @CurrentUser User user,
            @PathVariable Long orderId) {
        
        log.info("Tracking order for user: {}, orderId: {}", user.getEmail(), orderId);
        OrderDTO order = orderService.trackOrder(user, orderId);
        return ResponseEntity.ok(order);
    }
    
    /**
     * Reorder items from a previous order
     */
    @PostMapping("/{orderId}/reorder")
    public ResponseEntity<CartDTO> reorder(
            @CurrentUser User user,
            @PathVariable Long orderId) {
        
        log.info("Reordering for user: {}, orderId: {}", user.getEmail(), orderId);
        CartDTO cart = orderService.reorder(user, orderId);
        return ResponseEntity.ok(cart);
    }
    
    // Admin-only endpoints
    
    /**
     * Get all orders (admin only)
     */
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<OrderDTO>> getAllOrders(
            @RequestParam(required = false) OrderStatus status,
            @PageableDefault(size = 10) Pageable pageable) {
        
        log.info("Admin fetching all orders, status: {}", status);
        
        Page<OrderDTO> orders;
        if (status != null) {
            orders = orderService.getOrdersByStatus(status, pageable);
        } else {
            orders = orderService.getAllOrders(pageable);
        }
        
        return ResponseEntity.ok(orders);
    }
    
    /**
     * Update order status (admin only)
     */
    @PutMapping("/admin/{orderId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderDTO> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam OrderStatus status) {
        
        log.info("Admin updating order status, orderId: {}, status: {}", orderId, status);
        OrderDTO order = orderService.updateOrderStatus(orderId, status);
        return ResponseEntity.ok(order);
    }
    
    /**
     * Assign delivery partner (admin only)
     */
    @PutMapping("/admin/{orderId}/delivery-partner")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderDTO> assignDeliveryPartner(
            @PathVariable Long orderId,
            @RequestParam Long deliveryPartnerId) {
        
        log.info("Admin assigning delivery partner, orderId: {}, partnerId: {}", orderId, deliveryPartnerId);
        OrderDTO order = orderService.assignDeliveryPartner(orderId, deliveryPartnerId);
        return ResponseEntity.ok(order);
    }
} 