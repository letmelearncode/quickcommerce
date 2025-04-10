package com.quickcommerce.backend.service;

import com.quickcommerce.backend.dto.UserDTO;
import com.quickcommerce.backend.exception.ResourceNotFoundException;
import com.quickcommerce.backend.model.User;
import com.quickcommerce.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Helper Mapper
    private UserDTO mapToUserDTO(User user) {
        return new UserDTO(user.getId(), user.getName(), user.getEmail());
    }

    // Get current authenticated user's details
    @Transactional(readOnly = true)
    public UserDTO getCurrentUserProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            // Should ideally not happen if endpoint is secured correctly, but good practice
            throw new IllegalStateException("User is not authenticated.");
        }

        String userEmail = authentication.getName(); // Get email from principal
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> 
                    new UsernameNotFoundException("User not found with email: " + userEmail + " in security context")
                );
        
        return mapToUserDTO(user);
    }
    
    // Add methods for updating profile later
} 