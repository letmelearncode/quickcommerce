import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Helper function to get initial cart state from localStorage
const getInitialCart = () => {
    const savedCart = localStorage.getItem('quickCommerceCart');
    try {
        return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
        console.error("Failed to parse cart from localStorage", e);
        return []; // Return empty array on error
    }
};

// Create the context
const CartContext = createContext(null);

// Create a provider component
export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(getInitialCart);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { isAuthenticated, token } = useAuth();

    // Effect to save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('quickCommerceCart', JSON.stringify(cartItems));
    }, [cartItems]);

    // Effect to fetch cart from backend when user logs in
    useEffect(() => {
        if (isAuthenticated) {
            fetchCartFromBackend();
        }
    }, [isAuthenticated]);

    // Function to fetch cart data from backend
    const fetchCartFromBackend = async () => {
        if (!isAuthenticated) return;
        
        setIsLoading(true);
        setError(null);
        
        try {
            // Add cache-busting query parameter and no-store cache option
            const response = await fetch(`/api/cart?_=${Date.now()}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                cache: 'no-store', // Tell browser not to use cache
                credentials: 'include' // Include cookies in the request
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch cart');
            }
            
            const data = await response.json();
            
            // Update local cart state with backend data
            setCartItems(data.items.map(item => ({
                id: item.productId,
                name: item.productName,
                price: item.price,
                imageUrl: item.productImage,
                quantity: item.quantity
            })));
            
        } catch (err) {
            console.error('Error fetching cart:', err);
            setError('Failed to load your cart. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Function to merge guest cart with user cart after login
    const mergeCart = async () => {
        if (!isAuthenticated) return;
        
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await fetch(`/api/cart/merge?_=${Date.now()}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                cache: 'no-store',
                credentials: 'include'
            });
            
            if (!response.ok) {
                throw new Error('Failed to merge cart');
            }
            
            const data = await response.json();
            
            // Update local cart state with merged cart data
            setCartItems(data.items.map(item => ({
                id: item.productId,
                name: item.productName,
                price: item.price,
                imageUrl: item.productImage,
                quantity: item.quantity
            })));
            
        } catch (err) {
            console.error('Error merging cart:', err);
            setError('Failed to merge your cart. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Function to add an item to the cart
    const addToCart = async (productToAdd, quantity = 1) => {
        setError(null);
        
        // Update local cart state immediately for better UX
        setCartItems(prevItems => {
            const existingItemIndex = prevItems.findIndex(item => item.id === productToAdd.id);

            if (existingItemIndex > -1) {
                // Product already in cart, update quantity
                const updatedItems = [...prevItems];
                const existingItem = updatedItems[existingItemIndex];
                updatedItems[existingItemIndex] = {
                    ...existingItem,
                    quantity: existingItem.quantity + quantity,
                };
                console.log("Updated item quantity in cart:", updatedItems[existingItemIndex]);
                return updatedItems;
            } else {
                // Product not in cart, add as new item
                const newItem = {
                    id: productToAdd.id,
                    name: productToAdd.name,
                    price: productToAdd.price,
                    imageUrl: productToAdd.imageUrl,
                    quantity: quantity,
                };
                console.log("Added new item to cart:", newItem);
                return [...prevItems, newItem];
            }
        });
        
        // If user is authenticated, sync with backend
        if (isAuthenticated) {
            setIsLoading(true);
            
            try {
                const response = await fetch(`/api/cart/items?_=${Date.now()}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        productId: productToAdd.id,
                        quantity: quantity
                    }),
                    cache: 'no-store',
                    credentials: 'include'
                });
                
                if (!response.ok) {
                    throw new Error('Failed to add item to cart');
                }
                
                // Optionally refresh cart from backend, but not needed
                // since we've already updated the local state
                
            } catch (err) {
                console.error('Error adding to cart:', err);
                setError('Failed to add item to cart. Please try again.');
                // Revert the local change if the API call fails
                fetchCartFromBackend();
            } finally {
                setIsLoading(false);
            }
        }
    };

    // Function to update item quantity in cart
    const updateQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) {
            // If quantity is less than 1, remove the item
            return removeFromCart(productId);
        }
        
        setError(null);
        
        // Update local cart state immediately
        setCartItems(prevItems => {
            const updatedItems = prevItems.map(item => 
                item.id === productId 
                    ? { ...item, quantity: newQuantity } 
                    : item
            );
            return updatedItems;
        });
        
        // If user is authenticated, sync with backend
        if (isAuthenticated) {
            setIsLoading(true);
            
            try {
                // In our backend, the itemId parameter is actually the productId
                const itemId = productId;
                
                const response = await fetch(`/api/cart/items/${itemId}?_=${Date.now()}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        quantity: newQuantity
                    }),
                    cache: 'no-store',
                    credentials: 'include'
                });
                
                if (!response.ok) {
                    throw new Error('Failed to update item quantity');
                }
                
            } catch (err) {
                console.error('Error updating cart:', err);
                setError('Failed to update quantity. Please try again.');
                // Revert the local change if the API call fails
                fetchCartFromBackend();
            } finally {
                setIsLoading(false);
            }
        }
    };

    // Function to remove an item from cart
    const removeFromCart = async (productId) => {
        setError(null);
        
        // Update local cart state immediately
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
        
        // If user is authenticated, sync with backend
        if (isAuthenticated) {
            setIsLoading(true);
            
            try {
                // In our backend, the itemId parameter is actually the productId
                const itemId = productId;
                
                const response = await fetch(`/api/cart/items/${itemId}?_=${Date.now()}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    cache: 'no-store',
                    credentials: 'include'
                });
                
                if (!response.ok) {
                    throw new Error('Failed to remove item from cart');
                }
                
            } catch (err) {
                console.error('Error removing from cart:', err);
                setError('Failed to remove item. Please try again.');
                // Revert the local change if the API call fails
                fetchCartFromBackend();
            } finally {
                setIsLoading(false);
            }
        }
    };

    // Function to clear the entire cart
    const clearCart = async () => {
        setError(null);
        
        // Update local cart state immediately
        setCartItems([]);
        
        // If user is authenticated, sync with backend
        if (isAuthenticated) {
            setIsLoading(true);
            
            try {
                const response = await fetch(`/api/cart?_=${Date.now()}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    cache: 'no-store',
                    credentials: 'include'
                });
                
                if (!response.ok) {
                    throw new Error('Failed to clear cart');
                }
                
            } catch (err) {
                console.error('Error clearing cart:', err);
                setError('Failed to clear cart. Please try again.');
                // Revert the local change if the API call fails
                fetchCartFromBackend();
            } finally {
                setIsLoading(false);
            }
        }
    };

    // Calculate total price of items in cart
    const cartTotal = cartItems.reduce(
        (total, item) => total + (item.price * item.quantity), 
        0
    );

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        mergeCart,
        isLoading,
        error,
        itemCount: cartItems.reduce((count, item) => count + item.quantity, 0),
        cartTotal
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Create a custom hook to use the cart context
export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}; 