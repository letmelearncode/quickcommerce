package com.quickcommerce.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewDTO {
    private Long id;
    private Integer rating;
    private String comment;
    private Long productId; // Keep product ID
    private Long userId;    // Keep user ID
    private String userName; // Include user's name for display
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 