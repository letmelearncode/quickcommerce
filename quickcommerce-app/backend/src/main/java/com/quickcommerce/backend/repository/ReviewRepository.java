package com.quickcommerce.backend.repository;

import com.quickcommerce.backend.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    // Find all reviews for a given product ID, ordered by creation date descending
    List<Review> findByProductIdOrderByCreatedAtDesc(Long productId);

    // We might add pagination later if needed (e.g., using Pageable)
    // Page<Review> findByProductId(Long productId, Pageable pageable);
} 