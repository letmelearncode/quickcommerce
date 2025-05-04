'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCartIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import SearchBar from './SearchBar';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { cart } = useCart();
  const cartItemCount = cart.itemCount || 0;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-2 sm:gap-8">

          {/* Left: Brand Name - Hidden on mobile */}
          <div className="hidden sm:flex flex-shrink-0 items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-extrabold tracking-tight text-[#253858] sm:text-3xl">
                Quikkly
              </span>
            </Link>
          </div>

          {/* Small logo for very small screens */}
          <div className="sm:hidden flex flex-shrink-0 items-center">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-extrabold tracking-tight text-[#253858] w-8 h-8 flex items-center justify-center bg-[#0052CC] text-white rounded-full">
                Q
              </span>
            </Link>
          </div>

          {/* Center: Search Bar (Takes up flexible space) */}
          <div className="flex-1 min-w-0 px-1 sm:px-4">
             <div className="w-full mx-auto max-w-xl">
               <SearchBar />
             </div>
          </div>

          {/* Right: Actions */}
          <div className="flex flex-shrink-0 items-center space-x-2 sm:space-x-4 md:space-x-6">
            {/* Cart Icon */}
            <Link
              href="/cart"
              className="relative rounded-full p-1 text-[#253858] hover:text-[#0052CC] focus:outline-none focus:ring-2 focus:ring-[#4C9AFF] focus:ring-offset-2 focus:ring-offset-white"
            >
              <span className="sr-only">View cart</span>
              <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF5630] text-[10px] font-bold text-white ring-2 ring-white">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Auth Section: Conditional Rendering */}
            {isAuthenticated ? (
              // Logged-in State (Sketch 2)
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Link
                  href="/account"
                  className="flex items-center rounded-md px-2 sm:px-3 py-2 text-sm font-medium text-[#253858] hover:bg-[#F4F5F7] focus:ring-2 focus:ring-[#4C9AFF] focus:outline-none"
                >
                   <UserCircleIcon className="h-6 w-6 sm:mr-1" aria-hidden="true" />
                   <span className="hidden sm:inline">{user?.name || 'Account'}</span>
                </Link>
                 {/* Sign Out Button */}
                <button
                   onClick={logout} 
                   className="rounded-md bg-[#FF5630]/10 px-2 sm:px-3 py-2 text-sm font-medium text-[#FF5630] hover:bg-[#FF5630]/20 focus:ring-2 focus:ring-[#FF5630] focus:outline-none"
                 >
                   <span className="hidden sm:inline">Sign Out</span>
                   <span className="sm:hidden">Exit</span>
                </button>
              </div>
            ) : (
              // Guest State (Sketch 1)
              <div className="flex items-center space-x-2">
                <Link
                  href="/login" 
                  className="hidden sm:block rounded-md px-3 py-2 text-sm font-medium text-[#253858] hover:bg-[#F4F5F7] focus:ring-2 focus:ring-[#4C9AFF] focus:outline-none"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="rounded-md bg-[#0052CC] px-2 sm:px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#0747A6] focus:outline-none focus:ring-2 focus:ring-[#4C9AFF] focus:ring-offset-2 focus:ring-offset-white"
                >
                  <span className="hidden sm:inline">Sign Up</span>
                  <span className="sm:hidden">Join</span>
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
} 