package com.quickcommerce.backend.service.impl;

import com.quickcommerce.backend.dto.AddToCartRequest;
import com.quickcommerce.backend.dto.CartDTO;
import com.quickcommerce.backend.dto.CartItemDTO;
import com.quickcommerce.backend.dto.UpdateCartItemRequest;
import com.quickcommerce.backend.exception.NotFoundException;
import com.quickcommerce.backend.model.Cart;
import com.quickcommerce.backend.model.CartItem;
import com.quickcommerce.backend.model.Product;
import com.quickcommerce.backend.model.User;
import com.quickcommerce.backend.repository.CartItemRepository;
import com.quickcommerce.backend.repository.CartRepository;
import com.quickcommerce.backend.repository.ProductRepository;
import com.quickcommerce.backend.service.CartService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    @Override
    @Transactional
    public CartDTO getCart(User user, String sessionId) {
        log.info("Getting cart for user: {}, sessionId: {}", user, sessionId);
        Cart cart = getOrCreateCart(user, sessionId);
        log.info("Retrieved cart: {}", cart);
        return mapCartToDTO(cart);
    }

    @Override
    @Transactional
    public CartDTO addToCart(User user, String sessionId, AddToCartRequest request) {
        Cart cart = getOrCreateCart(user, sessionId);
        
        // Find product
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new NotFoundException("Product not found with ID: " + request.getProductId()));
        
        // Check if product is already in cart
        Optional<CartItem> existingItemOpt = cartItemRepository.findByCartAndProduct(cart, product);
        
        if (existingItemOpt.isPresent()) {
            // Update existing item quantity
            CartItem existingItem = existingItemOpt.get();
            existingItem.setQuantity(existingItem.getQuantity() + request.getQuantity());
            cartItemRepository.save(existingItem);
        } else {
            // Create new cart item
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(request.getQuantity());
            // Use the product's price directly (now both are BigDecimal)
            newItem.setPrice(product.getPrice());
            
            cart.addItem(newItem);
            cartRepository.save(cart);
        }
        
        return mapCartToDTO(cart);
    }

    @Override
    @Transactional
    public CartDTO updateCartItem(User user, String sessionId, Long itemId, UpdateCartItemRequest request) {
        log.info("Updating cart item: itemId={}, user={}, sessionId={}, quantity={}", 
                itemId, user, sessionId, request.getQuantity());
        
        Cart cart = getOrCreateCart(user, sessionId);
        log.info("Retrieved cart: id={}, userId={}, sessionId={}, itemCount={}", 
                cart.getId(), cart.getUser() != null ? cart.getUser().getId() : null, 
                cart.getSessionId(), cart.getItems().size());
        
        // Find cart item - using cart ID now instead of cart entity
        Optional<CartItem> itemOpt = cartItemRepository.findByProductIdAndCartId(itemId, cart.getId());
        
        if (!itemOpt.isPresent()) {
            // Debug why the item wasn't found
            log.error("Cart item not found. itemId={}, cartId={}", itemId, cart.getId());
            
            // Get all items for this cart from DB for debug purposes
            List<CartItem> allCartItems = cartItemRepository.findAll().stream()
                .filter(item -> item.getCart().getId().equals(cart.getId()))
                .collect(Collectors.toList());
            
            log.info("All items for cart {}: {}", cart.getId(), 
                    allCartItems.stream()
                    .map(item -> String.format("ID=%d, Product=%d", 
                            item.getId(), item.getProduct().getId()))
                    .collect(Collectors.joining(", ")));
            
            throw new NotFoundException("Cart item not found with ID: " + itemId + " in your cart");
        }
        
        CartItem item = itemOpt.get();
        
        // Update quantity
        item.setQuantity(request.getQuantity());
        cartItemRepository.save(item);
        log.info("Updated cart item quantity: itemId={}, newQuantity={}", item.getId(), item.getQuantity());
        
        return mapCartToDTO(cart);
    }

    @Override
    @Transactional
    public CartDTO removeFromCart(User user, String sessionId, Long itemId) {
        Cart cart = getOrCreateCart(user, sessionId);
        
        // Find cart item using the repository with cart ID
        CartItem item = cartItemRepository.findByProductIdAndCartId(itemId, cart.getId())
                .orElseThrow(() -> new NotFoundException("Cart item not found with ID: " + itemId + " in your cart"));
        
        // Remove item
        cart.removeItem(item);
        cartItemRepository.delete(item);
        cartRepository.save(cart);
        
        return mapCartToDTO(cart);
    }

    @Override
    @Transactional
    public void clearCart(User user, String sessionId) {
        Cart cart = getOrCreateCart(user, sessionId);
        cartItemRepository.deleteAllByCart(cart);
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    @Override
    @Transactional
    public CartDTO mergeGuestCart(User user, String sessionId) {
        // If there's no sessionId or the user is not authenticated, just return the user's cart
        if (sessionId == null || user == null) {
            return getCart(user, null);
        }
        
        // Find guest cart
        Optional<Cart> guestCartOpt = cartRepository.findBySessionId(sessionId);
        if (guestCartOpt.isEmpty() || guestCartOpt.get().getItems().isEmpty()) {
            return getCart(user, null);
        }
        
        // Find or create user cart
        Cart userCart = cartRepository.findByUser(user)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartRepository.save(newCart);
                });
        
        // Merge items from guest cart to user cart
        Cart guestCart = guestCartOpt.get();
        for (CartItem guestItem : guestCart.getItems()) {
            Optional<CartItem> existingItemOpt = cartItemRepository.findByCartAndProduct(userCart, guestItem.getProduct());
            
            if (existingItemOpt.isPresent()) {
                // Update existing item quantity
                CartItem existingItem = existingItemOpt.get();
                existingItem.setQuantity(existingItem.getQuantity() + guestItem.getQuantity());
                cartItemRepository.save(existingItem);
            } else {
                // Create new cart item in user cart
                CartItem newItem = new CartItem();
                newItem.setCart(userCart);
                newItem.setProduct(guestItem.getProduct());
                newItem.setQuantity(guestItem.getQuantity());
                newItem.setPrice(guestItem.getPrice());
                
                userCart.addItem(newItem);
            }
        }
        
        // Save user cart and delete guest cart
        cartRepository.save(userCart);
        cartItemRepository.deleteAllByCart(guestCart);
        cartRepository.delete(guestCart);
        
        return mapCartToDTO(userCart);
    }
    
    // Helper methods
    
    private Cart getOrCreateCart(User user, String sessionId) {
        log.info("getOrCreateCart called with user: {}, sessionId: {}", 
                user != null ? user.getId() : "null", sessionId);
                
        // Prioritize authenticated users
        if (user != null) {
            // For logged-in users, search or create by user ID, ignoring session ID
            Optional<Cart> userCartOpt = cartRepository.findByUser(user);
            
            if (userCartOpt.isPresent()) {
                log.info("Found existing cart for user: {}, cartId: {}", 
                        user.getId(), userCartOpt.get().getId());
                return userCartOpt.get();
            } else {
                Cart newCart = new Cart();
                newCart.setUser(user);
                // Don't set sessionId for authenticated users
                Cart savedCart = cartRepository.save(newCart);
                log.info("Created new cart for user: {}, cartId: {}", 
                        user.getId(), savedCart.getId());
                return savedCart;
            }
        } 
        // For guest users, use session ID
        else if (sessionId != null) {
            Optional<Cart> guestCartOpt = cartRepository.findBySessionId(sessionId);
            
            if (guestCartOpt.isPresent()) {
                log.info("Found existing cart for sessionId: {}, cartId: {}", 
                        sessionId, guestCartOpt.get().getId());
                return guestCartOpt.get();
            } else {
                Cart newCart = new Cart();
                newCart.setSessionId(sessionId);
                // Explicitly set user to null for guest carts
                newCart.setUser(null);
                Cart savedCart = cartRepository.save(newCart);
                log.info("Created new cart for sessionId: {}, cartId: {}", 
                        sessionId, savedCart.getId());
                return savedCart;
            }
        } 
        // Fallback for edge cases - should never happen in normal operation
        else {
            log.warn("Both user and sessionId are null, creating transient cart");
            // Create an empty transient cart (not saved to DB)
            Cart transientCart = new Cart();
            transientCart.setUser(null);
            transientCart.setSessionId(null);
            return transientCart;
        }
    }
    
    private CartDTO mapCartToDTO(Cart cart) {
        List<CartItemDTO> itemDTOs = cart.getItems().stream()
                .map(this::mapCartItemToDTO)
                .collect(Collectors.toList());
        
        return CartDTO.builder()
                .id(cart.getId())
                .userId(cart.getUser() != null ? cart.getUser().getId() : null)
                .sessionId(cart.getSessionId())
                .updatedAt(cart.getUpdatedAt())
                .items(itemDTOs)
                .total(cart.getTotal())
                .itemCount(cart.getItemCount())
                .build();
    }
    
    private CartItemDTO mapCartItemToDTO(CartItem item) {
        return CartItemDTO.builder()
                .id(item.getId())
                .productId(item.getProduct().getId())
                .productName(item.getProduct().getName())
                .productImage(item.getProduct().getImageUrl())
                .price(item.getPrice())
                .quantity(item.getQuantity())
                .subtotal(item.getSubtotal())
                .build();
    }
} 