package com.quickcommerce.backend.repository;

import com.quickcommerce.backend.model.Cart;
import com.quickcommerce.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    
    // Find active cart by user
    Optional<Cart> findByUser(User user);
    
    // Find cart by session ID (for guest carts)
    Optional<Cart> findBySessionId(String sessionId);
} 