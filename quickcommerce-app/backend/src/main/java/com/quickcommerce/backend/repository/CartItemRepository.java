package com.quickcommerce.backend.repository;

import com.quickcommerce.backend.model.Cart;
import com.quickcommerce.backend.model.CartItem;
import com.quickcommerce.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    
    // Find cart item by cart and product
    Optional<CartItem> findByCartAndProduct(Cart cart, Product product);
    
    // Delete all items in a cart
    void deleteAllByCart(Cart cart);
} 