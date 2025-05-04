package com.quickcommerce.backend.service.impl;

import com.quickcommerce.backend.dto.UserDTO;
import com.quickcommerce.backend.dto.UpdateProfileRequest;
import com.quickcommerce.backend.dto.ChangePasswordRequest;
import com.quickcommerce.backend.model.User;
import com.quickcommerce.backend.repository.UserRepository;
import com.quickcommerce.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private UserDTO mapToUserDTO(User user) {
        return new UserDTO(user.getId(), user.getName(), user.getEmail());
    }

    @Override
    @Transactional(readOnly = true)
    public UserDTO getCurrentUserProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new IllegalStateException("User is not authenticated.");
        }
        String userEmail = authentication.getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail + " in security context"));
        return mapToUserDTO(user);
    }

    @Override
    @Transactional
    public UserDTO updateUserProfile(User user, UpdateProfileRequest request) {
        user.setName(request.getName());
        user.setPhone(request.getPhone());
        userRepository.save(user);
        return mapToUserDTO(user);
    }

    @Override
    @Transactional
    public void changePassword(User user, ChangePasswordRequest request) {
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
} 