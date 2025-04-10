package com.quickcommerce.backend.service;

import com.quickcommerce.backend.dto.ReviewDTO;
import com.quickcommerce.backend.dto.ReviewInputDTO;
import com.quickcommerce.backend.exception.ResourceNotFoundException;
import com.quickcommerce.backend.model.Product;
import com.quickcommerce.backend.model.Review;
import com.quickcommerce.backend.model.User;
import com.quickcommerce.backend.repository.ProductRepository;
import com.quickcommerce.backend.repository.ReviewRepository;
import com.quickcommerce.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private UserRepository userRepository;

    // Helper Mapper Method
    private ReviewDTO mapToReviewDTO(Review review) {
        if (review == null) return null;
        // Assuming User entity has a getName() method
        String userName = (review.getUser() != null) ? review.getUser().getName() : "Unknown User";
        return new ReviewDTO(
            review.getId(),
            review.getRating(),
            review.getComment(),
            review.getProduct().getId(), // Get product ID from Review entity
            review.getUser().getId(),   // Get user ID from Review entity
            userName,
            review.getCreatedAt(),
            review.getUpdatedAt()
        );
    }

    // Get reviews for a specific product
    @Transactional(readOnly = true) // Needed for potential lazy loading of User/Product within mapToReviewDTO
    public List<ReviewDTO> getReviewsForProduct(Long productId) {
        // First, check if the product actually exists
        if (!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException("Product", "id", productId);
        }

        List<Review> reviews = reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);
        return reviews.stream()
                      .map(this::mapToReviewDTO)
                      .collect(Collectors.toList());
    }

    // Method for creating/submitting a new review
    @Transactional // Not read-only as we are saving data
    public ReviewDTO saveReview(Long productId, ReviewInputDTO reviewInput) {
        // 1. Get current authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName(); 
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + userEmail));

        // 2. Get the product being reviewed
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

        // 3. Create and populate the new Review entity
        Review newReview = new Review();
        newReview.setRating(reviewInput.getRating());
        newReview.setComment(reviewInput.getComment());
        newReview.setProduct(product);
        newReview.setUser(user);
        // Timestamps (createdAt, updatedAt) will be set automatically by @CreationTimestamp / @UpdateTimestamp

        // 4. Save the review
        Review savedReview = reviewRepository.save(newReview);

        // 5. Return the DTO of the saved review
        return mapToReviewDTO(savedReview);
    }
} 