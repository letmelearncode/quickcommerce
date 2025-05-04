'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingCartIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useCart } from '@/context/CartContext';
import { useSearchParams, useRouter } from 'next/navigation';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  stock: number;
}

interface ProductsResponse {
  products: Product[];
  total: number;
  filtered: number;
  categories: string[];
}

export default function ProductsPage() {
  const { addToCart } = useCart();
  const [addingToCartMap, setAddingToCartMap] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [productsData, setProductsData] = useState<ProductsResponse>({
    products: [],
    total: 0,
    filtered: 0,
    categories: ['all']
  });
  
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || 'all',
    priceRange: searchParams.get('priceRange') || 'all',
    sortBy: searchParams.get('sortBy') || 'default'
  });

  // Convert price range to min/max values for API
  const getPriceRangeParams = () => {
    switch (filters.priceRange) {
      case 'under-2':
        return { maxPrice: 2 } as const;
      case '2-4':
        return { minPrice: 2, maxPrice: 4 } as const;
      case 'over-4':
        return { minPrice: 4 } as const;
      default:
        return {} as const;
    }
  };

  // Fetch products with current filters
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const priceParams = getPriceRangeParams();
      
      // Construct query string
      const queryParams = new URLSearchParams();
      
      // Add parameters conditionally
      if (filters.category !== 'all') {
        queryParams.set('category', filters.category);
      }
      
      if (filters.sortBy !== 'default') {
        queryParams.set('sortBy', filters.sortBy);
      }
      
      // Add price range parameters
      if ('minPrice' in priceParams && priceParams.minPrice !== undefined) {
        queryParams.set('minPrice', priceParams.minPrice.toString());
      }
      
      if ('maxPrice' in priceParams && priceParams.maxPrice !== undefined) {
        queryParams.set('maxPrice', priceParams.maxPrice.toString());
      }
      
      const response = await fetch(`/api/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data: ProductsResponse = await response.json();
      setProductsData(data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Update URL with current filters
  const updateUrlWithFilters = () => {
    const params = new URLSearchParams();
    
    if (filters.category !== 'all') {
      params.set('category', filters.category);
    }
    
    if (filters.priceRange !== 'all') {
      params.set('priceRange', filters.priceRange);
    }
    
    if (filters.sortBy !== 'default') {
      params.set('sortBy', filters.sortBy);
    }
    
    const queryString = params.toString();
    const url = `/products${queryString ? `?${queryString}` : ''}`;
    
    router.push(url, { scroll: false });
  };

  // Handle filter changes
  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      category: 'all',
      priceRange: 'all',
      sortBy: 'default'
    });
  };

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
    updateUrlWithFilters();
  }, [filters]);

  // Initial fetch on mount
  useEffect(() => {
    fetchProducts();
  }, []);
  
  const handleAddToCart = async (productId: number) => {
    setAddingToCartMap(prev => ({ ...prev, [productId]: true }));
    
    try {
      await addToCart(productId, 1);
      // Success feedback would go here
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setAddingToCartMap(prev => ({ ...prev, [productId]: false }));
    }
  };

  return (
    <main className="bg-white min-h-screen">
      {/* Product Filter Section */}
      <section className="py-6 border-b border-gray-200">
        <div className="mx-auto max-w-[1440px] px-[5%]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="text-2xl font-bold text-[#172B4D]">Our Products</h1>
            
            <div className="flex flex-wrap gap-4 items-center">
              {/* Category Filter */}
              <div className="relative">
                <label htmlFor="category" className="block text-sm font-medium text-[#6B778C] mb-1">Category</label>
                <select
                  id="category"
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-[#172B4D] bg-white ring-1 ring-inset ring-[#DFE1E6] focus:ring-2 focus:ring-[#4C9AFF] sm:text-sm"
                  disabled={loading}
                >
                  {productsData.categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Price Range Filter */}
              <div className="relative">
                <label htmlFor="price-range" className="block text-sm font-medium text-[#6B778C] mb-1">Price Range</label>
                <select
                  id="price-range"
                  value={filters.priceRange}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-[#172B4D] bg-white ring-1 ring-inset ring-[#DFE1E6] focus:ring-2 focus:ring-[#4C9AFF] sm:text-sm"
                  disabled={loading}
                >
                  <option value="all">All Prices</option>
                  <option value="under-2">Under $2</option>
                  <option value="2-4">$2 - $4</option>
                  <option value="over-4">Over $4</option>
                </select>
              </div>
              
              {/* Sort By Filter */}
              <div className="relative">
                <label htmlFor="sort-by" className="block text-sm font-medium text-[#6B778C] mb-1">Sort By</label>
                <select
                  id="sort-by"
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-[#172B4D] bg-white ring-1 ring-inset ring-[#DFE1E6] focus:ring-2 focus:ring-[#4C9AFF] sm:text-sm"
                  disabled={loading}
                >
                  <option value="default">Default</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name</option>
                </select>
              </div>
              
              {/* Clear Filters */}
              {(filters.category !== 'all' || filters.priceRange !== 'all' || filters.sortBy !== 'default') && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-[#FF5630] hover:bg-[#FF5630]/10 rounded-md"
                  disabled={loading}
                >
                  <XMarkIcon className="h-4 w-4 mr-1" />
                  Clear Filters
                </button>
              )}
            </div>
          </div>
          
          {/* Results count */}
          <div className="mt-4 text-sm text-[#6B778C]">
            {loading ? (
              <span>Loading products...</span>
            ) : (
              <span>Showing {productsData.filtered} of {productsData.total} products</span>
            )}
          </div>
        </div>
      </section>

      {/* Product Grid Section */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-[1440px] px-[5%]">
          {error && (
            <div className="text-center py-12">
              <p className="text-[#FF5630] text-lg">{error}</p>
              <button
                onClick={fetchProducts}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#6321CE] hover:bg-[#4C1D9B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4C9AFF]"
              >
                Try Again
              </button>
            </div>
          )}
          
          {!error && loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6321CE]"></div>
              <p className="mt-4 text-[#6B778C]">Loading products...</p>
            </div>
          )}
          
          {!error && !loading && productsData.products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {productsData.products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden border border-[#DFE1E6]">
                  <div className="relative h-48 w-full">
                    <img 
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-[#6321CE] text-white text-xs font-semibold px-2 py-1 rounded-full">
                      {product.category}
                    </div>
                    {product.stock < 10 && (
                      <div className="absolute top-2 left-2 bg-[#FF5630] text-white text-xs font-semibold px-2 py-1 rounded-full">
                        Only {product.stock} left
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h2 className="text-lg font-medium text-[#172B4D] mb-2">{product.name}</h2>
                    <p className="text-[#6B778C] text-sm mb-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold text-[#6321CE]">${product.price.toFixed(2)}</p>
                      <button
                        onClick={() => handleAddToCart(product.id)}
                        disabled={!!addingToCartMap[product.id] || product.stock === 0}
                        className={`flex items-center justify-center p-2 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-[#4C9AFF] focus:ring-offset-2 
                          ${product.stock === 0 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-[#6321CE] hover:bg-[#4C1D9B]'} 
                          ${!!addingToCartMap[product.id] ? 'opacity-50' : ''}`}
                      >
                        {addingToCartMap[product.id] ? (
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <ShoppingCartIcon className="h-5 w-5" aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : !error && !loading ? (
            <div className="text-center py-12">
              <FunnelIcon className="mx-auto h-12 w-12 text-[#6B778C] mb-4" />
              <h3 className="text-lg font-medium text-[#172B4D]">No products match your filters</h3>
              <p className="text-[#6B778C] mt-2">Try changing your filter criteria</p>
              <button
                onClick={clearFilters}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#6321CE] hover:bg-[#4C1D9B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4C9AFF]"
              >
                Clear Filters
              </button>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
} 