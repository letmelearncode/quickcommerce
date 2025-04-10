package com.quickcommerce.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemDTO {
    
    private Long id;
    
    private Long productId;
    
    private String productName;
    
    private String productImage;
    
    private Integer quantity;
    
    private BigDecimal price;
    
    private BigDecimal subtotal;
} 