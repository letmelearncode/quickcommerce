'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { XMarkIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { cart, isLoading, error, updateCartItem, removeFromCart, clearCart } = useCart();
  const [removing, setRemoving] = useState<number | null>(null);
  const [updating, setUpdating] = useState<number | null>(null);
  
  const handleQuantityChange = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setUpdating(itemId);
    await updateCartItem(itemId, newQuantity);
    setUpdating(null);
  };
  
  const handleRemoveItem = async (itemId: number) => {
    setRemoving(itemId);
    await removeFromCart(itemId);
    setRemoving(null);
  };
  
  const handleClearCart = async () => {
    await clearCart();
  };
  
  if (isLoading && cart.items.length === 0) {
    return (
      <main>
        <section className="bg-gradient-to-r from-[#0052CC] to-[#4C9AFF] text-white py-12">
          <div className="mx-[5%] max-w-[1440px] mx-auto">
            <h1 className="text-4xl font-extrabold mb-4">Your Cart</h1>
          </div>
        </section>
        
        <section className="py-16 bg-[#F4F5F7]">
          <div className="mx-[5%] max-w-[1440px] mx-auto">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0052CC]"></div>
            </div>
          </div>
        </section>
      </main>
    );
  }
  
  if (error) {
    return (
      <main>
        <section className="bg-gradient-to-r from-[#0052CC] to-[#4C9AFF] text-white py-12">
          <div className="mx-[5%] max-w-[1440px] mx-auto">
            <h1 className="text-4xl font-extrabold mb-4">Your Cart</h1>
          </div>
        </section>
        
        <section className="py-16 bg-[#F4F5F7]">
          <div className="mx-[5%] max-w-[1440px] mx-auto">
            <div className="bg-red-50 border-l-4 border-[#FF5630] p-4 mb-6 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <XMarkIcon className="h-5 w-5 text-[#FF5630]" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-[#FF5630]">{error}</p>
                </div>
              </div>
            </div>
            <div className="text-center">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0052CC] hover:bg-[#0747A6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4C9AFF]"
              >
                Try Again
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }
  
  if (cart.items.length === 0) {
    return (
      <main>
        <section className="bg-gradient-to-r from-[#0052CC] to-[#4C9AFF] text-white py-12">
          <div className="mx-[5%] max-w-[1440px] mx-auto">
            <h1 className="text-4xl font-extrabold mb-4">Your Cart</h1>
          </div>
        </section>
        
        <section className="py-16 bg-[#F4F5F7]">
          <div className="mx-[5%] max-w-[1440px] mx-auto">
            <div className="bg-white shadow rounded-lg p-10 text-center">
              <div className="flex flex-col items-center justify-center">
                <svg className="h-16 w-16 text-[#6B778C] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h2 className="text-xl font-medium text-[#172B4D] mb-2">Your cart is empty</h2>
                <p className="text-[#6B778C] mb-6">Looks like you haven't added any products to your cart yet.</p>
                <Link
                  href="/products"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0052CC] hover:bg-[#0747A6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4C9AFF]"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }
  
  return (
    <main className="bg-[#F4F5F7]">
      <section className="bg-gradient-to-r from-[#0052CC] to-[#4C9AFF] text-white py-12">
        <div className="mx-[5%] max-w-[1440px] mx-auto">
          <h1 className="text-4xl font-extrabold mb-4">Your Cart</h1>
          <p className="text-xl text-white max-w-3xl">
            Review your items and proceed to checkout when you're ready.
          </p>
        </div>
      </section>
      
      <section className="py-16">
        <div className="mx-[5%] max-w-[1440px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart items - Left Column */}
            <div className="w-full lg:w-2/3">
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-[#172B4D]">
                      Cart Items ({cart.itemCount})
                    </h2>
                    <Link
                      href="/products"
                      className="text-[#0052CC] hover:text-[#0747A6] inline-flex items-center"
                    >
                      <svg className="-ml-1 mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                      Continue Shopping
                    </Link>
                  </div>
                </div>
                
                <ul className="divide-y divide-gray-200">
                  {cart.items.map((item) => (
                    <li key={item.id} className="px-4 py-6 sm:px-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-md overflow-hidden relative">
                          {item.productImage ? (
                            <img
                              src={item.productImage}
                              alt={item.productName}
                              className="w-full h-full object-center object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full w-full bg-gray-200">
                              <span className="text-gray-400 text-xs">No image</span>
                            </div>
                          )}
                        </div>
                        <div className="ml-6 flex-1 flex flex-col">
                          <div>
                            <div className="flex justify-between">
                              <h4 className="text-lg font-medium text-[#172B4D]">{item.productName}</h4>
                              <p className="ml-4 text-lg font-medium text-[#172B4D]">${item.price.toFixed(2)}</p>
                            </div>
                          </div>
                          <div className="mt-2 flex-1 flex items-end justify-between">
                            <div className="flex items-center space-x-3">
                              <button
                                type="button"
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                disabled={updating === item.id || item.quantity <= 1}
                                className="inline-flex items-center p-1 border border-gray-300 rounded-md shadow-sm text-[#172B4D] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4C9AFF] disabled:opacity-50"
                              >
                                <MinusIcon className="h-4 w-4" aria-hidden="true" />
                              </button>
                              <span className="text-[#6B778C]">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                disabled={updating === item.id}
                                className="inline-flex items-center p-1 border border-gray-300 rounded-md shadow-sm text-[#172B4D] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4C9AFF] disabled:opacity-50"
                              >
                                <PlusIcon className="h-4 w-4" aria-hidden="true" />
                              </button>
                            </div>
                            <div className="flex items-center">
                              <p className="text-sm text-[#6B778C] mr-4">Subtotal: ${item.subtotal.toFixed(2)}</p>
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(item.id)}
                                disabled={removing === item.id}
                                className="text-[#FF5630] hover:text-red-800 focus:outline-none"
                              >
                                {removing === item.id ? (
                                  <svg className="animate-spin h-5 w-5 text-[#FF5630]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                ) : (
                                  <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                  <div className="flex justify-end items-center">
                    <button
                      type="button"
                      onClick={handleClearCart}
                      className="text-[#FF5630] hover:text-red-800"
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Cart summary - Right Column */}
            <div className="w-full lg:w-1/3">
              <div className="bg-white shadow rounded-lg p-6 lg:sticky lg:top-6">
                <h2 className="text-xl font-semibold text-[#172B4D] mb-6">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-[#6B778C]">Subtotal ({cart.itemCount} items)</span>
                    <span className="text-[#172B4D] font-medium">${cart.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B778C]">Shipping</span>
                    <span className="text-[#172B4D] font-medium">Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B778C]">Tax</span>
                    <span className="text-[#172B4D] font-medium">Calculated at checkout</span>
                  </div>
                  
                  <div className="border-t border-gray-200 my-4 pt-4"></div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-[#172B4D]">Total</span>
                    <span className="text-xl font-bold text-[#172B4D]">${cart.total.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Link
                    href="/checkout"
                    className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#0052CC] hover:bg-[#0747A6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4C9AFF]"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
                
                <div className="mt-4">
                  <div className="bg-[#F4F5F7] rounded-md p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-[#0052CC]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-[#6B778C]">
                          <span className="font-medium text-[#172B4D]">Secure Checkout</span><br />
                          All transactions are secure and encrypted.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 