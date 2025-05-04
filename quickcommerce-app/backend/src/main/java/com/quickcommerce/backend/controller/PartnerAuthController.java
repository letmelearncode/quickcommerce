package com.quickcommerce.backend.controller;

import com.quickcommerce.backend.dto.ErrorResponse;
import com.quickcommerce.backend.dto.SignInRequest;
import com.quickcommerce.backend.dto.SignInResponse;
import com.quickcommerce.backend.dto.SignUpRequest;
import com.quickcommerce.backend.dto.SuccessResponse;
import com.quickcommerce.backend.exception.EmailAlreadyExistsException;
import com.quickcommerce.backend.model.User;
import com.quickcommerce.backend.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/partner/auth")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {
    RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, 
    RequestMethod.DELETE, RequestMethod.OPTIONS, RequestMethod.HEAD
})
public class PartnerAuthController {

    private static final Logger logger = LoggerFactory.getLogger(PartnerAuthController.class);

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> partnerLogin(@Valid @RequestBody SignInRequest signInRequest, HttpServletRequest request) {
        logger.info("Partner login attempt for email: {}", signInRequest.getEmail());
        
        SignInResponse response = authService.authenticateUser(signInRequest);
        
        // Check if user has partner role
        if (response.getRoles() == null || !response.getRoles().contains("ROLE_PARTNER")) {
            logger.warn("Access denied: User {} attempted to login as partner but lacks required role", signInRequest.getEmail());
            
            // Return structured error response
            ErrorResponse errorResponse = new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.FORBIDDEN.value(),
                HttpStatus.FORBIDDEN.getReasonPhrase(),
                "Access denied: Not a delivery partner",
                request.getRequestURI()
            );
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
        }
        
        logger.info("Partner login successful for user: {}, userId: {}", response.getName(), response.getUserId());
        
        // Return JWT token and user info wrapped in a consistent response format
        SuccessResponse successResponse = new SuccessResponse(
            LocalDateTime.now(),
            HttpStatus.OK.value(),
            "Partner login successful",
            request.getRequestURI(),
            response
        );
        
        return ResponseEntity.ok(successResponse);
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerPartner(@Valid @RequestBody SignUpRequest signUpRequest, HttpServletRequest request) {
        logger.info("Partner registration attempt for email: {}", signUpRequest.getEmail());
        
        try {
            // Register user with base user fields
            User partner = authService.registerUser(signUpRequest);
            
            // Add partner role
            partner.addRole("ROLE_PARTNER");
            
            // Save the updated user with the partner role
            authService.updateUserRoles(partner);
            
            logger.info("Partner registered successfully: {}, id: {}", partner.getName(), partner.getId());
            
            // Create response location header
            URI location = ServletUriComponentsBuilder
                    .fromCurrentContextPath().path("/api/partner/profile") 
                    .buildAndExpand().toUri();
            
            // Create success response with user info (excluding sensitive fields)
            Map<String, Object> partnerData = new HashMap<>();
            partnerData.put("id", partner.getId());
            partnerData.put("name", partner.getName());
            partnerData.put("email", partner.getEmail());
            partnerData.put("roles", partner.getRoles());
            
            SuccessResponse successResponse = new SuccessResponse(
                LocalDateTime.now(),
                HttpStatus.CREATED.value(),
                "Partner registered successfully!",
                request.getRequestURI(),
                partnerData
            );
            
            // Return success response with location header
            return ResponseEntity.created(location).body(successResponse);
        } catch (EmailAlreadyExistsException e) {
            logger.warn("Partner registration failed: Email already exists: {}", signUpRequest.getEmail());
            
            // Return structured error response
            ErrorResponse errorResponse = new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.CONFLICT.value(),
                HttpStatus.CONFLICT.getReasonPhrase(),
                e.getMessage(),
                request.getRequestURI()
            );
            return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
        } catch (Exception e) {
            logger.error("Partner registration failed with unexpected error for email: {}", signUpRequest.getEmail(), e);
            
            // Handle other exceptions with structured error response
            ErrorResponse errorResponse = new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase(),
                "Failed to register partner: " + e.getMessage(),
                request.getRequestURI()
            );
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
} 