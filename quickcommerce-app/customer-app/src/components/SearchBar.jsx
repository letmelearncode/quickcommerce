import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProductSuggestions } from '../services/productService'; // Import the suggestion service

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const searchContainerRef = useRef(null); // Use this ref on the form now
  const debounceTimeoutRef = useRef(null); // Ref for debounce timeout

  // Fetch suggestions with debouncing
  const fetchSuggestions = useCallback(async (currentQuery) => {
    console.log("[SearchBar] Fetching suggestions for:", currentQuery);
    if (currentQuery.length < 2) { // Match backend logic
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    try {
      const data = await getProductSuggestions(currentQuery);
      console.log("[SearchBar] Suggestions received:", data);
      setSuggestions(data || []);
      const shouldShow = data && data.length > 0;
      setShowSuggestions(shouldShow);
      console.log("[SearchBar] State after fetch: suggestions=", data || [], "showSuggestions=", shouldShow);
    } catch (error) {
      console.error("[SearchBar] Failed to fetch suggestions:", error);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, []);

  // Effect to handle debounced fetching
  useEffect(() => {
    // Clear the previous timeout if query changes quickly
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set a new timeout
    debounceTimeoutRef.current = setTimeout(() => {
        if (searchTerm) {
             fetchSuggestions(searchTerm);
        } else {
             setSuggestions([]);
             setShowSuggestions(false);
        }
    }, 300); // Debounce time: 300ms

    // Cleanup function to clear timeout if component unmounts or query changes
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchTerm, fetchSuggestions]);

  // Effect to handle clicks outside the search bar to close suggestions
  useEffect(() => {
    function handleClickOutside(event) {
      // Ref is now on the form
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        console.log("[SearchBar] Clicked outside, hiding suggestions.");
        setShowSuggestions(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchContainerRef]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    // Optionally trigger search immediately after clicking suggestion
    // Or let the user press Enter/click Search button
    // navigate(`/search?q=${encodeURIComponent(suggestion)}`); 
  };

  console.log("[SearchBar] Rendering. showSuggestions=", showSuggestions, "suggestions.length=", suggestions.length);

  return (
    <form 
      ref={searchContainerRef} 
      onSubmit={handleSubmit} 
      className="relative w-full max-w-xs search-form"
    >
      <div className="flex items-center">
        <input
          type="search"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-2 py-0.5 text-xs border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
        />
        <button
          type="submit"
          className="px-1.5 py-0.5 text-white bg-indigo-600 rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <svg
            className="h-2.5 w-2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>

      {/* Suggestions Dropdown (already handles dark mode) */}
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 left-0 right-0 top-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-2 py-1 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
};

export default SearchBar; 