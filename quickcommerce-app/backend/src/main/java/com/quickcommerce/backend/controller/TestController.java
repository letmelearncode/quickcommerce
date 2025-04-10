package com.quickcommerce.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal; // To access authenticated user info

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "http://localhost:5173") // Allow React dev server
public class TestController {

    @GetMapping("/public")
    public ResponseEntity<String> getPublicData() {
        return ResponseEntity.ok("This is public data.");
    }

    @GetMapping("/protected")
    public ResponseEntity<String> getProtectedData(Principal principal) {
        // Principal will be null if not authenticated by JWT filter
        String username = (principal != null) ? principal.getName() : "Anonymous";
        return ResponseEntity.ok("Hello, " + username + "! This is protected data.");
    }
} 