import { useState, useEffect } from 'react';

interface ProductFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  priceRange: number[];
  onPriceChange: (range: [number, number]) => void;
}

export default function ProductFilter({
  categories,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceChange
}: ProductFilterProps) {
  const [minPrice, setMinPrice] = useState(priceRange[0]);
  const [maxPrice, setMaxPrice] = useState(priceRange[1]);

  useEffect(() => {
    // Update the local state when props change
    setMinPrice(priceRange[0]);
    setMaxPrice(priceRange[1]);
  }, [priceRange]);

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setMinPrice(value);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setMaxPrice(value);
  };

  const applyPriceFilter = () => {
    onPriceChange([minPrice, maxPrice]);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Filters</h2>
      
      {/* Category Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center">
              <input
                id={`category-${category}`}
                name="category"
                type="radio"
                checked={selectedCategory === category}
                onChange={() => onCategoryChange(category)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label
                htmlFor={`category-${category}`}
                className="ml-3 text-sm text-gray-700"
              >
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Price Range Filter */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-2">Price Range</h3>
        <div className="mt-2 space-y-4">
          <div className="flex items-center">
            <span className="mr-2 text-sm text-gray-500">$</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={minPrice}
              onChange={handleMinPriceChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Min"
            />
            <span className="mx-2 text-gray-500">-</span>
            <span className="mr-2 text-sm text-gray-500">$</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={maxPrice}
              onChange={handleMaxPriceChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Max"
            />
          </div>
          <button
            type="button"
            onClick={applyPriceFilter}
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Apply
          </button>
        </div>
      </div>
      
      {/* Clear All Filters Button */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={() => {
            onCategoryChange('All');
            onPriceChange([0, 10]);
          }}
          className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
} 