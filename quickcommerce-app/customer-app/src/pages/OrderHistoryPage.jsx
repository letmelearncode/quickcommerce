import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOrderHistory } from '../services/orderService';
import { useAuth } from '../context/AuthContext';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('current');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, activeTab]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const status = activeTab === 'current' ? 'active' : 'completed';
      const data = await getOrderHistory({ status });
      setOrders(data.orders || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError('Failed to load your orders. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'DELIVERED':
        return 'text-green-600';
      case 'IN_TRANSIT':
        return 'text-blue-600';
      case 'PROCESSING':
        return 'text-yellow-600';
      case 'CANCELLED':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      
      {/* Tab navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex -mb-px">
          <button
            className={`py-4 px-6 border-b-2 font-medium text-sm ${
              activeTab === 'current'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('current')}
          >
            Current Orders
          </button>
          <button
            className={`py-4 px-6 border-b-2 font-medium text-sm ${
              activeTab === 'past'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('past')}
          >
            Past Orders
          </button>
        </nav>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">You don't have any {activeTab} orders yet.</p>
          <Link
            to="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg overflow-hidden shadow-sm">
              <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Order placed</p>
                  <p className="font-medium">{formatDate(order.orderDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="font-medium">${order.total.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Order #{order.orderNumber}</p>
                  <p className={`font-medium ${getStatusClass(order.status)}`}>
                    {order.status.replace('_', ' ')}
                  </p>
                </div>
                <div>
                  <Link
                    to={`/orders/${order.id}`}
                    className="inline-block bg-white hover:bg-gray-50 text-blue-600 font-medium py-2 px-4 border border-blue-600 rounded"
                  >
                    View Details
                  </Link>
                </div>
              </div>
              <div className="p-4">
                <div className="flex flex-wrap gap-4">
                  {order.items.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex space-x-3">
                      <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden">
                        {item.product.imageUrl && (
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="flex items-center text-blue-600">
                      <span>+{order.items.length - 3} more items</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 border-t flex justify-between">
                {order.status === 'IN_TRANSIT' && (
                  <Link
                    to={`/orders/${order.id}/tracking`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Track Order
                  </Link>
                )}
                {activeTab === 'past' && (
                  <button
                    onClick={() => {/* Implement reorder functionality */}}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Reorder
                  </button>
                )}
                {activeTab === 'current' && order.status === 'PROCESSING' && (
                  <button
                    onClick={() => {/* Implement cancel functionality */}}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage; 