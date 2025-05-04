package com.quickcommerce.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SuccessResponse {
    private LocalDateTime timestamp;
    private int status;
    private String message;
    private String path;
    private Object data; // Optional field for any additional data

    // Constructor without data field
    public SuccessResponse(LocalDateTime timestamp, int status, String message, String path) {
        this.timestamp = timestamp;
        this.status = status;
        this.message = message;
        this.path = path;
        this.data = null;
    }
} 