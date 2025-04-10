package com.quickcommerce.backend.service;

import com.quickcommerce.backend.dto.CreateOrderRequest;
import com.quickcommerce.backend.dto.OrderDTO;
import com.quickcommerce.backend.dto.CartDTO;
import com.quickcommerce.backend.model.Order.OrderStatus;
import com.quickcommerce.backend.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface OrderService {
    
    /**
     * Create a new order for a user
     * 
     * @param user the authenticated user
     * @param request the order creation request
     * @return the created order
     */
    OrderDTO createOrder(User user, CreateOrderRequest request);
    
    /**
     * Get an order by ID, ensuring it belongs to the current user
     * 
     * @param user the authenticated user
     * @param orderId the order ID
     * @return the order if found and belongs to user
     */
    OrderDTO getOrderById(User user, Long orderId);
    
    /**
     * Get an order by order number
     * 
     * @param orderNumber the order number
     * @return the order if found
     */
    OrderDTO getOrderByNumber(String orderNumber);
    
    /**
     * Get user's order history with pagination
     * 
     * @param user the authenticated user
     * @param pageable pagination parameters
     * @return a page of orders
     */
    Page<OrderDTO> getUserOrders(User user, Pageable pageable);
    
    /**
     * Get user's order history filtered by status
     * 
     * @param user the authenticated user
     * @param status the order status
     * @param pageable pagination parameters
     * @return a page of filtered orders
     */
    Page<OrderDTO> getUserOrdersByStatus(User user, OrderStatus status, Pageable pageable);
    
    /**
     * Cancel an order
     * 
     * @param user the authenticated user
     * @param orderId the order ID
     * @return the updated order
     */
    OrderDTO cancelOrder(User user, Long orderId);
    
    /**
     * Track order delivery
     * 
     * @param user the authenticated user
     * @param orderId the order ID
     * @return the tracking information
     */
    OrderDTO trackOrder(User user, Long orderId);
    
    /**
     * Reorder a previous order
     * 
     * @param user the authenticated user
     * @param orderId the order ID to reorder
     * @return the cart DTO with items from the original order
     */
    CartDTO reorder(User user, Long orderId);
    
    /**
     * Update order status
     * 
     * @param orderId the order ID
     * @param status the new status
     * @return the updated order
     */
    OrderDTO updateOrderStatus(Long orderId, OrderStatus status);
    
    /**
     * Assign a delivery partner to an order
     * 
     * @param orderId the order ID
     * @param deliveryPartnerId the delivery partner ID
     * @return the updated order
     */
    OrderDTO assignDeliveryPartner(Long orderId, Long deliveryPartnerId);
    
    /**
     * Get all orders for admin use
     * 
     * @param pageable pagination parameters
     * @return a page of all orders
     */
    Page<OrderDTO> getAllOrders(Pageable pageable);
    
    /**
     * Get orders by status for admin use
     * 
     * @param status the order status
     * @param pageable pagination parameters
     * @return a page of filtered orders
     */
    Page<OrderDTO> getOrdersByStatus(OrderStatus status, Pageable pageable);
} 