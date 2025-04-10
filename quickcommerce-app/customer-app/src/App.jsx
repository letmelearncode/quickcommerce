import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; // Import useAuth
import { useCart } from './context/CartContext'; // Import useCart
import ProtectedRoute from './routes/ProtectedRoute'; // Import ProtectedRoute
import HomePage from './pages/HomePage'; // Assuming we create this next
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage'; // Placeholder for next step
import ProfilePage from './pages/ProfilePage'; // Import ProfilePage
import CategoryPage from './pages/CategoryPage'; // Import the new CategoryPage
import SearchBar from './components/SearchBar'; // Import the SearchBar component
import SearchResultsPage from './pages/SearchResultsPage'; // Import SearchResultsPage
import ProductDetailPage from './pages/ProductDetailPage'; // Import ProductDetailPage
import CartPage from './pages/CartPage'; // Import the new CartPage
import './App.css';

// Make the Logo smaller
function Logo() {
  return (
    <Link to="/" className="flex items-center space-x-1">
      <div className="p-0.5 bg-indigo-100 rounded dark:bg-indigo-900">
        <svg
          className="h-3 w-3 text-indigo-600 dark:text-indigo-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      </div>
      <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
        <span className="text-indigo-600 dark:text-indigo-400">Quick</span>Commerce
      </span>
    </Link>
  );
}

function App() {
  const { isAuthenticated, logout } = useAuth(); // Get auth state and logout function
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  // Get actual cart items count from context
  const { itemCount } = useCart();

  return (
    <div className="min-h-screen flex flex-col">
      {/* === Navbar === */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4">
          <div className="flex items-center justify-between h-8">
            {/* Left side: Logo & Main Links */} 
            <div className="flex items-center space-x-2">
              <Logo />
              <div className="hidden sm:flex sm:space-x-2"> {/* Hide links on small screens */} 
                 <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-1.5 py-0.5 rounded text-xs font-medium transition-colors">Home</Link>
                 <Link to="/categories" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-1.5 py-0.5 rounded text-xs font-medium transition-colors">Categories</Link>
              </div>
            </div>
            
            {/* Right side: Search, Cart, Auth */} 
            <div className="flex items-center space-x-2">
              <div className="hidden sm:block w-40 md:w-56">
                <SearchBar /> 
              </div>
              
              {/* Cart Icon with Badge */}
              <Link to="/cart" className="relative p-0.5 text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-3 w-3 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
              
              {/* Auth Menu */}
              <div className="hidden sm:flex sm:items-center"> {/* Hide auth links on small screens */} 
                {isAuthenticated ? (
                  <div className="relative">
                    <button 
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center text-xs font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-1.5 py-0.5 rounded"
                    >
                      <span className="mr-0.5">Account</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {userMenuOpen && (
                      <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-gray-700 rounded shadow-lg py-1 z-50 text-left">
                        <Link to="/profile" className="block px-3 py-1 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">Profile</Link>
                        <Link to="/orders" className="block px-3 py-1 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">Orders</Link>
                        <Link to="/settings" className="block px-3 py-1 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">Settings</Link>
                        <button 
                          onClick={logout} 
                          className="block w-full text-left px-3 py-1 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                          Sign out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Link to="/login" className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
                      Log in
                    </Link>
                    <Link 
                      to="/signup" 
                      className="inline-flex items-center px-1.5 py-0.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
              
              {/* Mobile Menu Button */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="sm:hidden p-0.5 rounded text-gray-700 hover:text-indigo-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-indigo-400 dark:hover:bg-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden px-2 pt-1 pb-2 space-y-1 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div className="pb-1">
              <SearchBar />
            </div>
            <Link to="/" className="block px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">Home</Link>
            <Link to="/categories" className="block px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">Categories</Link>
            <Link to="/cart" className="flex items-center px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
              <span>Cart</span>
              {itemCount > 0 && (
                <span className="ml-1 bg-red-500 text-white text-xs font-bold rounded-full h-3 w-3 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="block px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">Log in</Link>
                <Link to="/signup" className="block px-2 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">Sign up</Link>
              </>
            ) : (
              <>
                <Link to="/profile" className="block px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">Profile</Link>
                <Link to="/orders" className="block px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">Orders</Link>
                <Link to="/settings" className="block px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">Settings</Link>
                <button 
                  onClick={logout} 
                  className="block w-full text-left px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
                >
                  Sign out
                </button>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Main Content Area - Allow to grow */} 
      <main className="flex-grow max-w-7xl w-full mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/categories" element={<CategoryPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/product/:productId" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />

            {/* Protected Routes */}
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
          </Routes>
      </main>
      
      {/* Footer (Placeholder) */}
      <footer className="bg-gray-200 dark:bg-gray-800 py-2 mt-auto">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600 dark:text-gray-400 text-xs">
             &copy; {new Date().getFullYear()} QuickCommerce. All rights reserved.
         </div>
      </footer>
    </div>
  );
}

export default App;
