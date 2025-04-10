package com.quickcommerce.backend.controller;

import com.quickcommerce.backend.dto.SignUpRequest;
import com.quickcommerce.backend.model.User;
import com.quickcommerce.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

import com.quickcommerce.backend.dto.SignInRequest;
import com.quickcommerce.backend.dto.SignInResponse;
import com.quickcommerce.backend.dto.GoogleTokenRequest;

import java.io.IOException; // For exception handling
import java.security.GeneralSecurityException; // For exception handling

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173") // Allow React dev server (adjust port if needed)
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) {

        User result = authService.registerUser(signUpRequest);

        // Create response location header for the newly created user (optional)
        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath().path("/api/users/{username}") // Assuming a future endpoint
                .buildAndExpand(result.getEmail()).toUri(); // Or use result.getId()

        // Return a 201 Created response
        // You might want to return a simple success message or the user object (without password)
        return ResponseEntity.created(location).body("User registered successfully!");
        // Or consider a dedicated SignUpResponse DTO
    }

    @PostMapping("/signin")
    public ResponseEntity<SignInResponse> authenticateUser(@Valid @RequestBody SignInRequest signInRequest) {
        SignInResponse signInResponse = authService.authenticateUser(signInRequest);
        return ResponseEntity.ok(signInResponse);
    }

    // Endpoint for Google Sign-In
    @PostMapping("/google")
    public ResponseEntity<?> authenticateWithGoogle(@Valid @RequestBody GoogleTokenRequest googleTokenRequest) {
        try {
            SignInResponse response = authService.loginOrRegisterGoogleUser(googleTokenRequest);
            return ResponseEntity.ok(response);
        } catch (GeneralSecurityException | IOException | IllegalArgumentException e) {
            // Handle exceptions specifically related to Google token verification
            System.err.println("Google Auth Failed: " + e.getMessage());
            // Return a structured error using the GlobalExceptionHandler pattern (manually here or throw specific exception)
            // For simplicity, returning BAD_REQUEST here, could refine with specific statuses
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Google Sign-In failed: " + e.getMessage()); 
        } catch (Exception e) {
            // Catch any other unexpected errors during user creation/token generation
            System.err.println("Google Auth - Unexpected Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred during Google Sign-In.");
        }
    }
} 