import React, { useState, useEffect } from 'react';
import { getCategories } from '../services/productService';

// Props will include functions to apply filters
function SearchFilters({ onFilterChange }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState(''); // Add state for min price
  const [maxPrice, setMaxPrice] = useState(''); // Add state for max price
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch categories for the filter dropdown
  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      try {
        const data = await getCategories();
        setCategories(data || []);
      } catch (err) {
        setError("Failed to load categories for filtering.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  const handleCategoryChange = (event) => {
    const categoryId = event.target.value;
    setSelectedCategory(categoryId);
    onFilterChange({ categoryId: categoryId });
  };

  // Handler for price changes - triggers filter update on blur or Enter
  const handlePriceChange = () => {
    const priceFilters = {};
    if (minPrice !== '') priceFilters.minPrice = parseFloat(minPrice);
    if (maxPrice !== '') priceFilters.maxPrice = parseFloat(maxPrice);
    // Basic validation: if min > max, maybe clear max or show error?
    if (priceFilters.minPrice !== undefined && priceFilters.maxPrice !== undefined && priceFilters.minPrice > priceFilters.maxPrice) {
        // Simple approach: ignore max if min is greater
        delete priceFilters.maxPrice;
        setMaxPrice(''); // Clear the input field too
        console.warn("Min price cannot be greater than max price. Max price filter ignored.");
        // A better UX might involve visual feedback
    }
    onFilterChange(priceFilters);
  };

  const handlePriceKeyDown = (event) => {
      if (event.key === 'Enter') {
          handlePriceChange();
      }
  };

  return (
    <div className="p-4 border rounded shadow mb-4">
      <h3 className="text-lg font-semibold mb-3">Filters</h3>

      {/* Category Filter */}
      <div className="mb-4">
        <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        {loading && <p className="text-sm text-gray-500">Loading categories...</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}
        {!loading && !error && (
          <select
            id="category-filter"
            name="category"
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        )}
      </div>
      
      {/* Price Range Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            placeholder="Min $"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            onBlur={handlePriceChange} // Apply filter on blur
            onKeyDown={handlePriceKeyDown} // Apply filter on Enter
            min="0"
            step="0.01"
            className="mt-1 block w-full pl-3 pr-1 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Max $"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            onBlur={handlePriceChange} // Apply filter on blur
            onKeyDown={handlePriceKeyDown} // Apply filter on Enter
            min="0"
            step="0.01"
            className="mt-1 block w-full pl-3 pr-1 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          />
        </div>
      </div>

      {/* Add more filters as needed */}
    </div>
  );
}

export default SearchFilters; 