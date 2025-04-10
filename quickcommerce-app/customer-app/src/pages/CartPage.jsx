import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartPage = () => {
    const { 
        cartItems, 
        removeFromCart, 
        updateQuantity, 
        clearCart, 
        isLoading, 
        error, 
        cartTotal 
    } = useCart();

    if (isLoading) {
        return (
            <div className="py-8 px-4 max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
                <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-8 px-4 max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="py-8 px-4 max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                    <h2 className="text-xl mb-4">Your cart is empty</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">Looks like you haven't added anything to your cart yet.</p>
                    <Link to="/" className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                        Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="py-8 px-4 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between">
                    <h2 className="text-lg font-medium">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart</h2>
                    <button
                        onClick={clearCart}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                        Clear Cart
                    </button>
                </div>
                
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {cartItems.map(item => (
                        <div key={item.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center">
                            <div className="flex-shrink-0 w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden mr-4 mb-3 sm:mb-0">
                                {item.imageUrl ? (
                                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        No Image
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex-grow mb-3 sm:mb-0">
                                <Link to={`/product/${item.id}`} className="text-lg font-medium text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400">
                                    {item.name}
                                </Link>
                                <p className="text-gray-600 dark:text-gray-400">
                                    ${item.price.toFixed(2)} per item
                                </p>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        -
                                    </button>
                                    <span className="px-3 py-1 border-l border-r border-gray-300 dark:border-gray-600">
                                        {item.quantity}
                                    </span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        +
                                    </button>
                                </div>
                                
                                <div className="text-right">
                                    <div className="font-medium text-gray-900 dark:text-gray-100">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-sm text-red-600 hover:text-red-800"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="p-4 bg-gray-50 dark:bg-gray-900">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                        <span className="text-xl font-semibold">${cartTotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                        <Link 
                            to="/categories" 
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            Continue Shopping
                        </Link>
                        <Link 
                            to="/checkout" 
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        >
                            Proceed to Checkout
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage; 