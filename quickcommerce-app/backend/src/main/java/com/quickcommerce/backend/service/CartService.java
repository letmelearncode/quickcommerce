package com.quickcommerce.backend.service;

import com.quickcommerce.backend.dto.AddToCartRequest;
import com.quickcommerce.backend.dto.CartDTO;
import com.quickcommerce.backend.dto.UpdateCartItemRequest;
import com.quickcommerce.backend.model.User;

public interface CartService {
    
    // Get current user's cart
    CartDTO getCart(User user, String sessionId);
    
    // Add item to cart
    CartDTO addToCart(User user, String sessionId, AddToCartRequest request);
    
    // Update cart item quantity
    CartDTO updateCartItem(User user, String sessionId, Long itemId, UpdateCartItemRequest request);
    
    // Remove item from cart
    CartDTO removeFromCart(User user, String sessionId, Long itemId);
    
    // Clear cart
    void clearCart(User user, String sessionId);
    
    // Merge guest cart with user cart after login
    CartDTO mergeGuestCart(User user, String sessionId);
} 