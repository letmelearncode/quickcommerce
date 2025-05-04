'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

// Define types for cart items and cart
interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  subtotal: number;
}

interface Cart {
  id?: number;
  userId?: number;
  sessionId?: string;
  updatedAt?: string;
  items: CartItem[];
  total: number;
  itemCount: number;
}

interface AddToCartRequest {
  productId: number;
  quantity: number;
}

interface UpdateCartItemRequest {
  quantity: number;
}

interface CartContextType {
  cart: Cart;
  isLoading: boolean;
  error: string | null;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateCartItem: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

// Create default cart state
const defaultCart: Cart = {
  items: [],
  total: 0,
  itemCount: 0,
};

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>(defaultCart);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  // Fetch cart on initial load and when authentication state changes
  useEffect(() => {
    refreshCart();
  }, [isAuthenticated]);

  // Function to refresh cart from backend
  const refreshCart = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/cart', {
        method: 'GET',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }
      
      const data = await response.json();
      setCart(data);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError('Failed to load cart. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to add an item to the cart
  const addToCart = async (productId: number, quantity: number): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    const addToCartRequest: AddToCartRequest = {
      productId,
      quantity
    };
    
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(addToCartRequest),
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to add item to cart');
      }
      
      const data = await response.json();
      setCart(data);
    } catch (err) {
      console.error('Error adding to cart:', err);
      setError('Failed to add item to cart. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to update cart item quantity
  const updateCartItem = async (itemId: number, quantity: number): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    const updateRequest: UpdateCartItemRequest = {
      quantity
    };
    
    try {
      const response = await fetch(`/api/cart/items/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateRequest),
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to update cart item');
      }
      
      const data = await response.json();
      setCart(data);
    } catch (err) {
      console.error('Error updating cart item:', err);
      setError('Failed to update cart item. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to remove an item from the cart
  const removeFromCart = async (itemId: number): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/cart/items/${itemId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove item from cart');
      }
      
      const data = await response.json();
      setCart(data);
    } catch (err) {
      console.error('Error removing from cart:', err);
      setError('Failed to remove item from cart. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to clear the cart
  const clearCart = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/cart', {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to clear cart');
      }
      
      const data = await response.json();
      setCart(data);
    } catch (err) {
      console.error('Error clearing cart:', err);
      setError('Failed to clear cart. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        error,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        refreshCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 