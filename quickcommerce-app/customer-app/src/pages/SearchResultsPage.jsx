import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchProducts } from '../services/productService'; // Import the search service
import SearchFilters from '../components/SearchFilters'; // Import the filters component

// Basic Product Card component (can be moved to components later)
function ProductCard({ product }) {
  return (
    <Link to={`/product/${product.id}`} className="block border rounded p-4 mb-4 shadow hover:shadow-md transition-shadow duration-200">
      {/* TODO: Add Image, Link to product detail */} 
      <h3 className="text-lg font-semibold mb-2 text-blue-600 hover:text-blue-800">{product.name}</h3>
      <p className="text-gray-700 mb-1">{product.description?.substring(0, 100)}...</p> {/* Optional chaining and substring */} 
      <p className="text-green-600 font-bold">${product.price?.toFixed(2)}</p> {/* Optional chaining and toFixed */} 
    </Link>
  );
}

function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || ''; // Ensure query is always a string

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({}); // State to hold applied filters
  // TODO: Add state for pagination

  // Use useCallback to memoize fetchResults to avoid unnecessary re-renders
  const fetchResults = useCallback(async (currentQuery, currentFilters) => {
    if (!currentQuery) {
      setLoading(false);
      setError('No search query provided.');
      setResults([]);
      return;
    }

    setLoading(true);
    setError('');
    try {
      console.log(`Fetching search results for: "${currentQuery}" with filters:`, currentFilters);
      
      const apiParams = {
        query: currentQuery,
        // Add filters if they exist and are valid
        ...(currentFilters.categoryId && { categoryId: currentFilters.categoryId }),
        ...(currentFilters.minPrice !== undefined && !isNaN(currentFilters.minPrice) && { minPrice: currentFilters.minPrice }),
        ...(currentFilters.maxPrice !== undefined && !isNaN(currentFilters.maxPrice) && { maxPrice: currentFilters.maxPrice }),
        // page: 0, 
        // size: 10
      };

      const data = await searchProducts(apiParams);
      setResults(data?.content || []);

    } catch (err) {
      console.error("Failed to fetch search results:", err);
      setError(err.message || "Failed to fetch search results.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []); // Dependencies: searchProducts function (assumed stable)

  // Effect to fetch results when query or filters change
  useEffect(() => {
    fetchResults(query, filters);
  }, [query, filters, fetchResults]); // Include fetchResults in dependencies

  // Handler for when filters change in the child component
  const handleFilterChange = (newFilters) => {
    console.log("Filters changed:", newFilters);
    // Merge new filter changes with existing filters
    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters
    }));
    // The useEffect above will trigger a refetch
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Search Results for "{query}"</h1>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Filters Sidebar */}
        <div className="w-full md:w-1/4">
          <SearchFilters onFilterChange={handleFilterChange} />
        </div>

        {/* Search Results Area */}
        <div className="w-full md:w-3/4">
          {loading && <div>Loading results...</div>}
          {error && <div className="text-red-500">Error: {error}</div>}
          {!loading && !error && (
            <div>
              {results.length > 0 ? (
                results.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <p>No products found matching your search and filters.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchResultsPage; 