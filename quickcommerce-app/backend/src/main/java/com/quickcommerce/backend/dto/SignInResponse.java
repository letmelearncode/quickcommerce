package com.quickcommerce.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SignInResponse {

    private String accessToken;
    private String tokenType = "Bearer";
    private String email;
    private String name;
    private Set<String> roles;
    private Long userId;

    public SignInResponse(String accessToken) {
        this.accessToken = accessToken;
    }

    public SignInResponse(String accessToken, String email, String name, Set<String> roles, Long userId) {
        this.accessToken = accessToken;
        this.email = email;
        this.name = name;
        this.roles = roles;
        this.userId = userId;
    }
} 