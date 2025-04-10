package com.quickcommerce.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SignInResponse {

    private String accessToken;
    private String tokenType = "Bearer";
    // You could add user details here too if needed, e.g., name, roles
    // private String email;
    // private String name;

    public SignInResponse(String accessToken) {
        this.accessToken = accessToken;
    }
} 