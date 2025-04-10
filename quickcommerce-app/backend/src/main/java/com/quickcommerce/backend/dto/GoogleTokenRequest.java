package com.quickcommerce.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class GoogleTokenRequest {

    @NotBlank(message = "Google token is required")
    private String token;
} 