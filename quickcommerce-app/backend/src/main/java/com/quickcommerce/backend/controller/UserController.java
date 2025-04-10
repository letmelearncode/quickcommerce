package com.quickcommerce.backend.controller;

import com.quickcommerce.backend.dto.UserDTO;
import com.quickcommerce.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users") // Base path for user-related endpoints
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserService userService;

    // Endpoint to get the current authenticated user's profile
    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser() {
        UserDTO userProfile = userService.getCurrentUserProfile();
        return ResponseEntity.ok(userProfile);
    }

    // Add endpoints for updating profile etc. later
} 