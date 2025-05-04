package com.quickcommerce.backend.service.impl;

import com.quickcommerce.backend.dto.*;
import com.quickcommerce.backend.exception.NotFoundException;
import com.quickcommerce.backend.exception.UnauthorizedException;
import com.quickcommerce.backend.model.*;
import com.quickcommerce.backend.model.Order.OrderStatus;
import com.quickcommerce.backend.repository.OrderRepository;
import com.quickcommerce.backend.repository.ProductRepository;
import com.quickcommerce.backend.repository.UserRepository;
import com.quickcommerce.backend.service.CartService;
import com.quickcommerce.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.quickcommerce.backend.repository.AddressRepository;
import com.quickcommerce.backend.repository.PaymentMethodRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CartService cartService;
    private final AddressRepository addressRepository;
    private final PaymentMethodRepository paymentMethodRepository;

    @Override
    @Transactional
    public OrderDTO createOrder(User user, CreateOrderRequest request) {
        log.info("Creating order for user: {}", user.getEmail());
        
        // 1. Get user's current cart
        CartDTO cartDTO = cartService.getCart(user, null);
        
        if (cartDTO.getItems().isEmpty()) {
            throw new IllegalStateException("Cannot create order with empty cart");
        }
        
        // 2. Create a new order
        Order order = new Order();
        order.setUser(user);
        order.setOrderNumber(generateOrderNumber());
        order.setStatus(OrderStatus.PENDING);
        order.setOrderDate(LocalDateTime.now());
        
        // 3. Set addresses
        Address shippingAddress = mapAddressDTOToAddress(request.getShippingAddress());
        shippingAddress.setUser(user);
        shippingAddress = addressRepository.save(shippingAddress);
        order.setShippingAddress(shippingAddress);
        
        Address billingAddress;
        if (request.getUseShippingAddressForBilling() || request.getBillingAddress() == null) {
            billingAddress = shippingAddress;
        } else {
            billingAddress = mapAddressDTOToAddress(request.getBillingAddress());
            billingAddress = addressRepository.save(billingAddress);
        }
        order.setBillingAddress(billingAddress);
        
        // 4. Set payment method
        PaymentMethod paymentMethod = new PaymentMethod();
        paymentMethod.setType(PaymentMethod.PaymentType.CREDIT_CARD);
        paymentMethod.setPaymentMethodId(request.getPaymentMethodId());
        paymentMethod = paymentMethodRepository.save(paymentMethod);
        order.setPaymentMethod(paymentMethod);
        
        // 5. Set additional info
        order.setNotes(request.getNotes());
        order.setDeliveryInstructions(request.getDeliveryInstructions());
        
        // 6. Create order items from cart items
        for (CartItemDTO cartItem : cartDTO.getItems()) {
            Product product = productRepository.findById(cartItem.getProductId())
                    .orElseThrow(() -> new NotFoundException("Product not found: " + cartItem.getProductId()));
            
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(cartItem.getPrice());
            orderItem.setProductName(product.getName());
            orderItem.setProductImage(product.getImageUrl());
            
            order.addItem(orderItem);
        }
        
        // 7. Calculate order totals
        order.setSubtotal(cartDTO.getTotal());
        order.setTax(calculateTax(cartDTO.getTotal()));
        order.setShippingCost(calculateShippingCost(cartDTO));
        order.setDiscount(BigDecimal.ZERO); // Apply discounts if promo code is provided
        order.calculateTotal();
        order.setLastUpdated(LocalDateTime.now());
        
        // 8. Save the order
        Order savedOrder = orderRepository.save(order);
        
        // 9. Clear the cart
        cartService.clearCart(user, null);
        
        return mapOrderToDTO(savedOrder);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderDTO getOrderById(User user, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Order not found: " + orderId));
        
        // Ensure the order belongs to the user
        if (!order.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You do not have permission to access this order");
        }
        
        return mapOrderToDTO(order);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderDTO getOrderByNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new NotFoundException("Order not found: " + orderNumber));
        
        return mapOrderToDTO(order);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderDTO> getUserOrders(User user, Pageable pageable) {
        Page<Order> orders = orderRepository.findByUser(user, pageable);
        return orders.map(this::mapOrderToDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderDTO> getUserOrdersByStatus(User user, OrderStatus status, Pageable pageable) {
        Page<Order> orders = orderRepository.findByUserAndStatus(user, status, pageable);
        return orders.map(this::mapOrderToDTO);
    }

    @Override
    @Transactional
    public OrderDTO cancelOrder(User user, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Order not found: " + orderId));
        
        // Ensure the order belongs to the user
        if (!order.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You do not have permission to cancel this order");
        }
        
        // Only allow cancellation of orders in certain statuses
        if (order.getStatus() != OrderStatus.PENDING && order.getStatus() != OrderStatus.PROCESSING) {
            throw new IllegalStateException("Cannot cancel an order that is already " + order.getStatus());
        }
        
        // Update order status
        order.updateStatusTimestamp(OrderStatus.CANCELLED);
        
        // Save the updated order
        Order updatedOrder = orderRepository.save(order);
        
        // TODO: Initiate refund process if payment was already processed
        
        return mapOrderToDTO(updatedOrder);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderDTO trackOrder(User user, Long orderId) {
        // For now, just return the order details
        // In a real app, you would fetch live tracking data
        return getOrderById(user, orderId);
    }

    @Override
    @Transactional
    public CartDTO reorder(User user, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Order not found: " + orderId));
        
        // Ensure the order belongs to the user
        if (!order.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You do not have permission to reorder this order");
        }
        
        // Clear the current cart
        cartService.clearCart(user, null);
        
        // Add each item from the order to the cart
        for (OrderItem item : order.getItems()) {
            AddToCartRequest request = new AddToCartRequest();
            request.setProductId(item.getProduct().getId());
            request.setQuantity(item.getQuantity());
            
            cartService.addToCart(user, null, request);
        }
        
        // Return the updated cart
        return cartService.getCart(user, null);
    }

    @Override
    @Transactional
    public OrderDTO updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Order not found: " + orderId));
        
        // Update status and timestamp
        order.updateStatusTimestamp(status);
        
        // Save the updated order
        Order updatedOrder = orderRepository.save(order);
        
        return mapOrderToDTO(updatedOrder);
    }

    @Override
    @Transactional
    public OrderDTO assignDeliveryPartner(Long orderId, Long deliveryPartnerId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Order not found: " + orderId));
        
        User deliveryPartner = userRepository.findById(deliveryPartnerId)
                .orElseThrow(() -> new NotFoundException("Delivery partner not found: " + deliveryPartnerId));
        
        // Assign delivery partner
        order.setDeliveryPartner(deliveryPartner);
        
        // Update status to IN_TRANSIT if it's currently PROCESSING
        if (order.getStatus() == OrderStatus.PROCESSING) {
            order.updateStatusTimestamp(OrderStatus.IN_TRANSIT);
        }
        
        // Save the updated order
        Order updatedOrder = orderRepository.save(order);
        
        return mapOrderToDTO(updatedOrder);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderDTO> getAllOrders(Pageable pageable) {
        Page<Order> orders = orderRepository.findAll(pageable);
        return orders.map(this::mapOrderToDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderDTO> getOrdersByStatus(OrderStatus status, Pageable pageable) {
        Page<Order> orders = orderRepository.findByStatus(status, pageable);
        return orders.map(this::mapOrderToDTO);
    }
    
    // Helper methods
    
    private String generateOrderNumber() {
        // Generate a unique order number
        return "QC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
    
    private BigDecimal calculateTax(BigDecimal subtotal) {
        // Simplified tax calculation (e.g., 10% tax)
        return subtotal.multiply(new BigDecimal("0.10"));
    }
    
    private BigDecimal calculateShippingCost(CartDTO cart) {
        // Simplified shipping cost calculation
        // In a real app, you would calculate based on weight, distance, etc.
        return new BigDecimal("5.99");
    }
    
    private Address mapAddressDTOToAddress(AddressDTO dto) {
        Address address = new Address();
        address.setFullName(dto.getFullName());
        address.setStreet(dto.getStreet());
        address.setCity(dto.getCity());
        address.setState(dto.getState());
        address.setZipCode(dto.getZipCode());
        address.setCountry(dto.getCountry());
        address.setPhone(dto.getPhone());
        address.setApartment(dto.getApartment());
        address.setAdditionalInfo(dto.getAdditionalInfo());
        address.setIsDefault(dto.getIsDefault());
        return address;
    }
    
    private AddressDTO mapAddressToDTO(Address address) {
        return AddressDTO.builder()
                .fullName(address.getFullName())
                .street(address.getStreet())
                .city(address.getCity())
                .state(address.getState())
                .zipCode(address.getZipCode())
                .country(address.getCountry())
                .phone(address.getPhone())
                .apartment(address.getApartment())
                .additionalInfo(address.getAdditionalInfo())
                .isDefault(address.getIsDefault())
                .build();
    }
    
    private PaymentMethodDTO mapPaymentMethodToDTO(PaymentMethod paymentMethod) {
        return PaymentMethodDTO.builder()
                .type(paymentMethod.getType())
                .cardBrand(paymentMethod.getCardBrand())
                .last4(paymentMethod.getLast4())
                .expiryMonth(paymentMethod.getExpiryMonth())
                .expiryYear(paymentMethod.getExpiryYear())
                .paymentMethodId(paymentMethod.getPaymentMethodId())
                .build();
    }
    
    private OrderItemDTO mapOrderItemToDTO(OrderItem item) {
        return OrderItemDTO.builder()
                .id(item.getId())
                .productId(item.getProduct().getId())
                .productName(item.getProductName())
                .productImage(item.getProductImage())
                .quantity(item.getQuantity())
                .price(item.getPrice())
                .subtotal(item.getSubtotal())
                .build();
    }
    
    private OrderDTO mapOrderToDTO(Order order) {
        List<OrderItemDTO> itemDTOs = order.getItems().stream()
                .map(this::mapOrderItemToDTO)
                .collect(Collectors.toList());
        
        Address shippingAddress = order.getShippingAddress();
        Address billingAddress = order.getBillingAddress();
        PaymentMethod paymentMethod = order.getPaymentMethod();
        
        return OrderDTO.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .userId(order.getUser().getId())
                .status(order.getStatus())
                .subtotal(order.getSubtotal())
                .tax(order.getTax())
                .shippingCost(order.getShippingCost())
                .discount(order.getDiscount())
                .total(order.getTotal())
                .items(itemDTOs)
                .shippingAddress(mapAddressToDTO(shippingAddress))
                .billingAddress(mapAddressToDTO(billingAddress))
                .paymentMethod(mapPaymentMethodToDTO(paymentMethod))
                .notes(order.getNotes())
                .deliveryInstructions(order.getDeliveryInstructions())
                .orderDate(order.getOrderDate())
                .lastUpdated(order.getLastUpdated())
                .processedDate(order.getProcessedDate())
                .shippedDate(order.getShippedDate())
                .deliveredDate(order.getDeliveredDate())
                .cancelledDate(order.getCancelledDate())
                .deliveryPartnerId(order.getDeliveryPartner() != null ? order.getDeliveryPartner().getId() : null)
                .isPaid(order.getIsPaid())
                .build();
    }
}