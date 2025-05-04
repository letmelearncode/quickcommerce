package com.quickcommerce.backend.service;

import com.quickcommerce.backend.dto.UserDTO;
import com.quickcommerce.backend.model.User;
import com.quickcommerce.backend.dto.UpdateProfileRequest;
import com.quickcommerce.backend.dto.ChangePasswordRequest;

public interface UserService {
    UserDTO getCurrentUserProfile();
    UserDTO updateUserProfile(User user, UpdateProfileRequest request);
    void changePassword(User user, ChangePasswordRequest request);
} 