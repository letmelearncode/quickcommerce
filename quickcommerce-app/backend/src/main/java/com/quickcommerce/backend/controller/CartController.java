package com.quickcommerce.backend.controller;

import com.quickcommerce.backend.dto.AddToCartRequest;
import com.quickcommerce.backend.dto.CartDTO;
import com.quickcommerce.backend.dto.UpdateCartItemRequest;
import com.quickcommerce.backend.model.User;
import com.quickcommerce.backend.security.CurrentUser;
import com.quickcommerce.backend.service.CartService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@Slf4j
public class CartController {

    private final CartService cartService;
    
    // Session ID cookie name for guest carts
    private static final String SESSION_ID_COOKIE = "qc_session_id";
    
    /**
     * Get current cart contents
     */
    @GetMapping
    public ResponseEntity<CartDTO> getCart(@CurrentUser User user, HttpServletRequest request) {
        // Debug logging
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        log.info("Authentication: {}", auth);
        if (auth != null) {
            log.info("Authentication principal: {}, name: {}, authorities: {}", 
                auth.getPrincipal(), auth.getName(), auth.getAuthorities());
        }
        
        log.info("getCart called with user: {}", user);
        String sessionId = getOrCreateSessionId(request, user);
        return ResponseEntity.ok(cartService.getCart(user, sessionId));
    }
    
    /**
     * Add item to cart
     */
    @PostMapping("/items")
    public ResponseEntity<CartDTO> addToCart(
            @CurrentUser User user,
            HttpServletRequest request,
            @Valid @RequestBody AddToCartRequest addToCartRequest) {
        
        String sessionId = getOrCreateSessionId(request, user);
        return ResponseEntity.ok(cartService.addToCart(user, sessionId, addToCartRequest));
    }
    
    /**
     * Update cart item quantity
     */
    @PutMapping("/items/{itemId}")
    public ResponseEntity<CartDTO> updateCartItem(
            @CurrentUser User user,
            HttpServletRequest request,
            @PathVariable Long itemId,
            @Valid @RequestBody UpdateCartItemRequest updateRequest) {
        
        String sessionId = getOrCreateSessionId(request, user);
        return ResponseEntity.ok(cartService.updateCartItem(user, sessionId, itemId, updateRequest));
    }
    
    /**
     * Remove item from cart
     */
    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<CartDTO> removeFromCart(
            @CurrentUser User user,
            HttpServletRequest request,
            @PathVariable Long itemId) {
        
        String sessionId = getOrCreateSessionId(request, user);
        return ResponseEntity.ok(cartService.removeFromCart(user, sessionId, itemId));
    }
    
    /**
     * Clear entire cart
     */
    @DeleteMapping
    public ResponseEntity<Void> clearCart(
            @CurrentUser User user,
            HttpServletRequest request) {
        
        String sessionId = getOrCreateSessionId(request, user);
        cartService.clearCart(user, sessionId);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Merge guest cart with user cart (called after login)
     */
    @PostMapping("/merge")
    public ResponseEntity<CartDTO> mergeGuestCart(
            @CurrentUser User user,
            HttpServletRequest request) {
        
        String sessionId = getOrCreateSessionId(request, user);
        return ResponseEntity.ok(cartService.mergeGuestCart(user, sessionId));
    }
    
    /**
     * Helper method to get or create a session ID for guest carts
     * For authenticated users, returns null to ensure they use their user-based cart
     */
    private String getOrCreateSessionId(HttpServletRequest request, User user) {
        // For authenticated users, return null so they use their user-based cart
        if (user != null) {
            return null;
        }
        
        // For guest users, get or create a session ID
        jakarta.servlet.http.Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (jakarta.servlet.http.Cookie cookie : cookies) {
                if (SESSION_ID_COOKIE.equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        
        // No session ID found, return a generated one
        // In a real app, this would be set as a cookie in the response
        return UUID.randomUUID().toString();
    }
} 