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
import java.util.UUID;

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
        String reqId = UUID.randomUUID().toString();
        log.info("[{}] [INFO] Creating order for user: {}", reqId, user.getEmail());
        log.debug("[{}] [DEBUG] CreateOrderRequest: {}", reqId, request);
        try {
            OrderDTO order = orderService.createOrder(user, request);
            log.info("[{}] [INFO] Order created successfully: orderId={}", reqId, order.getId());
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            log.error("[{}] [ERROR] Failed to create order: {}", reqId, e.getMessage(), e);
            throw e;
        }
    }
    
    /**
     * Get user's order history
     */
    @GetMapping
    public ResponseEntity<Page<OrderDTO>> getUserOrders(
            @CurrentUser User user,
            @RequestParam(required = false) OrderStatus status,
            @PageableDefault(size = 10) Pageable pageable) {
        String reqId = UUID.randomUUID().toString();
        log.info("[{}] [INFO] Fetching orders for user: {}, status: {}", reqId, user.getEmail(), status);
        try {
            Page<OrderDTO> orders;
            if (status != null) {
                orders = orderService.getUserOrdersByStatus(user, status, pageable);
            } else {
                orders = orderService.getUserOrders(user, pageable);
            }
            log.info("[{}] [INFO] Orders fetched: count={}", reqId, orders.getTotalElements());
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            log.error("[{}] [ERROR] Failed to fetch user orders: {}", reqId, e.getMessage(), e);
            throw e;
        }
    }
    
    /**
     * Get order details by ID
     */
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDTO> getOrderById(
            @CurrentUser User user,
            @PathVariable Long orderId) {
        String reqId = UUID.randomUUID().toString();
        log.info("[{}] [INFO] Fetching order details for user: {}, orderId: {}", reqId, user.getEmail(), orderId);
        try {
            OrderDTO order = orderService.getOrderById(user, orderId);
            log.info("[{}] [INFO] Order details fetched for orderId={}", reqId, orderId);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            log.error("[{}] [ERROR] Failed to fetch order details for orderId={}: {}", reqId, orderId, e.getMessage(), e);
            throw e;
        }
    }
    
    /**
     * Cancel an order
     */
    @PostMapping("/{orderId}/cancel")
    public ResponseEntity<OrderDTO> cancelOrder(
            @CurrentUser User user,
            @PathVariable Long orderId) {
        String reqId = UUID.randomUUID().toString();
        log.info("[{}] [INFO] Cancelling order for user: {}, orderId: {}", reqId, user.getEmail(), orderId);
        try {
            OrderDTO order = orderService.cancelOrder(user, orderId);
            log.info("[{}] [INFO] Order cancelled: orderId={}", reqId, orderId);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            log.error("[{}] [ERROR] Failed to cancel orderId={}: {}", reqId, orderId, e.getMessage(), e);
            throw e;
        }
    }
    
    /**
     * Track order delivery
     */
    @GetMapping("/{orderId}/tracking")
    public ResponseEntity<OrderDTO> trackOrder(
            @CurrentUser User user,
            @PathVariable Long orderId) {
        String reqId = UUID.randomUUID().toString();
        log.info("[{}] [INFO] Tracking order for user: {}, orderId: {}", reqId, user.getEmail(), orderId);
        try {
            OrderDTO order = orderService.trackOrder(user, orderId);
            log.info("[{}] [INFO] Order tracking fetched for orderId={}", reqId, orderId);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            log.error("[{}] [ERROR] Failed to track orderId={}: {}", reqId, orderId, e.getMessage(), e);
            throw e;
        }
    }
    
    /**
     * Reorder items from a previous order
     */
    @PostMapping("/{orderId}/reorder")
    public ResponseEntity<CartDTO> reorder(
            @CurrentUser User user,
            @PathVariable Long orderId) {
        String reqId = UUID.randomUUID().toString();
        log.info("[{}] [INFO] Reordering for user: {}, orderId: {}", reqId, user.getEmail(), orderId);
        try {
            CartDTO cart = orderService.reorder(user, orderId);
            log.info("[{}] [INFO] Reorder successful for orderId={}", reqId, orderId);
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            log.error("[{}] [ERROR] Failed to reorder orderId={}: {}", reqId, orderId, e.getMessage(), e);
            throw e;
        }
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
        String reqId = UUID.randomUUID().toString();
        log.info("[{}] [INFO] Admin fetching all orders, status: {}", reqId, status);
        try {
            Page<OrderDTO> orders;
            if (status != null) {
                orders = orderService.getOrdersByStatus(status, pageable);
            } else {
                orders = orderService.getAllOrders(pageable);
            }
            log.info("[{}] [INFO] Admin fetched orders: count={}", reqId, orders.getTotalElements());
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            log.error("[{}] [ERROR] Admin failed to fetch orders: {}", reqId, e.getMessage(), e);
            throw e;
        }
    }
    
    /**
     * Update order status (admin only)
     */
    @PutMapping("/admin/{orderId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderDTO> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam OrderStatus status) {
        String reqId = UUID.randomUUID().toString();
        log.info("[{}] [INFO] Admin updating order status, orderId: {}, status: {}", reqId, orderId, status);
        try {
            OrderDTO order = orderService.updateOrderStatus(orderId, status);
            log.info("[{}] [INFO] Admin updated order status for orderId={}", reqId, orderId);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            log.error("[{}] [ERROR] Admin failed to update order status for orderId={}: {}", reqId, orderId, e.getMessage(), e);
            throw e;
        }
    }
    
    /**
     * Assign delivery partner (admin only)
     */
    @PutMapping("/admin/{orderId}/delivery-partner")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderDTO> assignDeliveryPartner(
            @PathVariable Long orderId,
            @RequestParam Long deliveryPartnerId) {
        String reqId = UUID.randomUUID().toString();
        log.info("[{}] [INFO] Admin assigning delivery partner, orderId: {}, partnerId: {}", reqId, orderId, deliveryPartnerId);
        try {
            OrderDTO order = orderService.assignDeliveryPartner(orderId, deliveryPartnerId);
            log.info("[{}] [INFO] Admin assigned delivery partner for orderId={}", reqId, orderId);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            log.error("[{}] [ERROR] Admin failed to assign delivery partner for orderId={}: {}", reqId, orderId, e.getMessage(), e);
            throw e;
        }
    }
} 