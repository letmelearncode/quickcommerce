import apiClient from './apiClient';

export const getCategories = async () => {
    return apiClient('/categories');
};

export const getCategoryById = async (id) => {
    return apiClient(`/categories/${id}`);
};

/**
 * Fetches products.
 * @param {object} params - Query parameters
 * @param {number} [params.page] - Page number (0-indexed)
 * @param {number} [params.size] - Page size
 * @param {string} [params.sort] - Sorting criteria (e.g., 'name,asc')
 * @param {number} [params.categoryId] - Optional category ID to filter by
 * @returns {Promise<object>} - Page object containing products
 */
export const getProducts = async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return apiClient(`/products?${queryParams}`);
};

export const getProductById = async (id) => {
    return apiClient(`/products/${id}`);
};

/**
 * Searches for products based on a query.
 * @param {object} params - Query parameters
 * @param {string} params.query - The search term
 * @param {number} [params.page] - Page number (0-indexed)
 * @param {number} [params.size] - Page size
 * @param {string} [params.sort] - Sorting criteria (e.g., 'name,asc')
 * @returns {Promise<object>} - Page object containing products
 */
export const searchProducts = async (params = {}) => {
    // Extract query and remove it from params to avoid double encoding
    const query = params.query;
    if (!query) {
        return Promise.resolve({ content: [], totalPages: 0, totalElements: 0 }); // Or throw error
    }
    delete params.query; 
    
    // Build query string for pagination/sort
    const paginationParams = new URLSearchParams(params).toString();
    
    // Construct the final URL with the mandatory 'q' parameter and optional pagination
    const endpoint = `/products/search?q=${encodeURIComponent(query)}&${paginationParams}`;
    
    return apiClient(endpoint);
};

/**
 * Fetches product name suggestions based on a query fragment.
 * @param {string} queryFragment - The fragment to search for.
 * @returns {Promise<string[]>} - A list of suggestion strings.
 */
export const getProductSuggestions = async (queryFragment) => {
    if (!queryFragment || queryFragment.length < 2) {
        return Promise.resolve([]); // Don't call API for short/empty queries
    }
    const endpoint = `/products/suggestions?q=${encodeURIComponent(queryFragment)}`;
    return apiClient(endpoint);
};

/**
 * Fetches reviews for a specific product.
 * @param {string|number} productId - The ID of the product.
 * @returns {Promise<Array<object>>} - An array of review objects.
 */
export const getReviewsForProduct = async (productId) => {
    if (!productId) {
        return Promise.resolve([]);
    }
    const endpoint = `/products/${productId}/reviews`;
    return apiClient(endpoint);
};

// Add search function later if needed 