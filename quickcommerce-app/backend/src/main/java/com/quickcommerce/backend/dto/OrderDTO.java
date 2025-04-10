package com.quickcommerce.backend.dto;

import com.quickcommerce.backend.model.Order.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDTO {
    
    private Long id;
    
    private String orderNumber;
    
    private Long userId;
    
    private OrderStatus status;
    
    private BigDecimal subtotal;
    
    private BigDecimal tax;
    
    private BigDecimal shippingCost;
    
    private BigDecimal discount;
    
    private BigDecimal total;
    
    private List<OrderItemDTO> items;
    
    private AddressDTO shippingAddress;
    
    private AddressDTO billingAddress;
    
    private PaymentMethodDTO paymentMethod;
    
    private String notes;
    
    private String deliveryInstructions;
    
    private LocalDateTime orderDate;
    
    private LocalDateTime lastUpdated;
    
    private LocalDateTime processedDate;
    
    private LocalDateTime shippedDate;
    
    private LocalDateTime deliveredDate;
    
    private LocalDateTime cancelledDate;
    
    private Long deliveryPartnerId;
    
    private Boolean isPaid;
} 