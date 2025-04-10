package com.quickcommerce.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartDTO {
    private Long id;
    private Long userId;
    private String sessionId;
    private LocalDateTime updatedAt;
    private List<CartItemDTO> items;
    private BigDecimal total;
    private Integer itemCount;
} 