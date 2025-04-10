package com.quickcommerce.backend.controller;

import com.quickcommerce.backend.dto.ReviewDTO;
import com.quickcommerce.backend.dto.ReviewInputDTO;
import com.quickcommerce.backend.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api") // Base path for API
@CrossOrigin(origins = "http://localhost:5173") // Allow frontend dev server
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    // Get all reviews for a specific product
    // Endpoint: GET /api/products/{productId}/reviews
    @GetMapping("/products/{productId}/reviews")
    public ResponseEntity<List<ReviewDTO>> getProductReviews(@PathVariable Long productId) {
        List<ReviewDTO> reviews = reviewService.getReviewsForProduct(productId);
        return ResponseEntity.ok(reviews);
    }

    // Submit a new review for a specific product
    // Endpoint: POST /api/products/{productId}/reviews
    // Requires authentication (configured in SecurityConfig)
    @PostMapping("/products/{productId}/reviews")
    public ResponseEntity<ReviewDTO> submitProductReview(
            @PathVariable Long productId,
            @Valid @RequestBody ReviewInputDTO reviewInput) {
        
        ReviewDTO savedReview = reviewService.saveReview(productId, reviewInput);
        // Return 201 Created status with the created review DTO
        return new ResponseEntity<>(savedReview, HttpStatus.CREATED);
    }
} 