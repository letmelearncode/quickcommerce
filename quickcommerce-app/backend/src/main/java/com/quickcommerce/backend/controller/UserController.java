package com.quickcommerce.backend.controller;

import com.quickcommerce.backend.dto.UserDTO;
import com.quickcommerce.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.quickcommerce.backend.dto.UpdateProfileRequest;
import com.quickcommerce.backend.dto.ChangePasswordRequest;
import com.quickcommerce.backend.security.CurrentUser;
import jakarta.validation.Valid;
import com.quickcommerce.backend.model.User;

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

    // Update current user's profile
    @PutMapping("/me")
    public ResponseEntity<UserDTO> updateCurrentUser(
            @CurrentUser User user,
            @Valid @RequestBody UpdateProfileRequest request) {
        UserDTO updated = userService.updateUserProfile(user, request);
        return ResponseEntity.ok(updated);
    }

    // Change current user's password
    @PostMapping("/change-password")
    public ResponseEntity<Void> changePassword(
            @CurrentUser User user,
            @Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(user, request);
        return ResponseEntity.noContent().build();
    }

    // Add endpoints for updating profile etc. later
} 