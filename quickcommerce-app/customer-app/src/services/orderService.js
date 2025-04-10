import apiClient from './apiClient';

/**
 * Fetch order history for the current user
 * @param {Object} params - Query parameters for filtering orders
 * @param {string} params.status - Filter by order status (optional)
 * @param {number} params.page - Page number for pagination (optional)
 * @param {number} params.size - Number of orders per page (optional)
 * @returns {Promise<Object>} - Promise with order history data
 */
export const getOrderHistory = async (params = {}) => {
  try {
    const response = await apiClient.get('/api/orders', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch details for a specific order
 * @param {string} orderId - ID of the order to fetch
 * @returns {Promise<Object>} - Promise with order details
 */
export const getOrderDetails = async (orderId) => {
  try {
    const response = await apiClient.get(`/api/orders/${orderId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Track order delivery in real-time
 * @param {string} orderId - ID of the order to track
 * @returns {Promise<Object>} - Promise with tracking information
 */
export const trackOrderDelivery = async (orderId) => {
  try {
    const response = await apiClient.get(`/api/orders/${orderId}/tracking`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Reorder items from a previous order
 * @param {string} orderId - ID of the order to reorder
 * @returns {Promise<Object>} - Promise with new cart data
 */
export const reorder = async (orderId) => {
  try {
    const response = await apiClient.post(`/api/orders/${orderId}/reorder`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Cancel an order
 * @param {string} orderId - ID of the order to cancel
 * @returns {Promise<Object>} - Promise with cancellation confirmation
 */
export const cancelOrder = async (orderId) => {
  try {
    const response = await apiClient.post(`/api/orders/${orderId}/cancel`);
    return response.data;
  } catch (error) {
    throw error;
  }
}; 