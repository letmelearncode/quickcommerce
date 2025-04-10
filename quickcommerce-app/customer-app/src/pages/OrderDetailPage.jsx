import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getOrderDetails, reorder, cancelOrder } from '../services/orderService';

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [reorderLoading, setReorderLoading] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const data = await getOrderDetails(orderId);
      setOrder(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch order details:', err);
      setError('Failed to load order details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = async () => {
    try {
      setReorderLoading(true);
      await reorder(orderId);
      navigate('/cart');
    } catch (err) {
      console.error('Failed to reorder:', err);
      alert('Failed to add items to cart. Please try again later.');
    } finally {
      setReorderLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      setCancelLoading(true);
      await cancelOrder(orderId);
      // Refresh order details
      fetchOrderDetails();
    } catch (err) {
      console.error('Failed to cancel order:', err);
      alert('Failed to cancel order. Please try again later.');
    } finally {
      setCancelLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'IN_TRANSIT':
        return 'bg-blue-100 text-blue-800';
      case 'PROCESSING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <div className="mt-4">
          <Link to="/orders" className="text-blue-600 hover:underline">
            &larr; Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Order not found.</p>
          <Link
            to="/orders"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
          >
            View All Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/orders" className="text-blue-600 hover:underline">
          &larr; Back to Orders
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden border">
        <div className="bg-gray-50 px-6 py-4 border-b">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Order #{order.orderNumber}</h1>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(order.status)}`}
            >
              {order.status.replace('_', ' ')}
            </span>
          </div>
          <p className="text-gray-500 mt-1">Placed on {formatDate(order.orderDate)}</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <h2 className="font-medium text-gray-900 mb-2">Shipping Address</h2>
              <address className="not-italic text-gray-600">
                {order.shippingAddress.fullName}<br />
                {order.shippingAddress.street}<br />
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                {order.shippingAddress.country}
              </address>
            </div>

            <div>
              <h2 className="font-medium text-gray-900 mb-2">Payment Method</h2>
              <p className="text-gray-600">
                {order.paymentMethod.type === 'CREDIT_CARD' ? (
                  <>
                    {order.paymentMethod.cardBrand} ending in {order.paymentMethod.last4}
                    <br />
                    Expires {order.paymentMethod.expiryMonth}/{order.paymentMethod.expiryYear}
                  </>
                ) : (
                  order.paymentMethod.type
                )}
              </p>
            </div>

            <div>
              <h2 className="font-medium text-gray-900 mb-2">Order Summary</h2>
              <div className="text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>${order.shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-${order.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold mt-2 pt-2 border-t border-gray-200">
                  <span>Total:</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <h2 className="font-medium text-gray-900 mb-4 pb-2 border-b">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex flex-col md:flex-row md:items-center py-4 border-b">
                <div className="flex items-center flex-grow mb-4 md:mb-0">
                  <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden mr-4">
                    {item.product.imageUrl && (
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <Link
                      to={`/products/${item.product.id}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">${item.price.toFixed(2)}</p>
                  <p className="text-gray-500">Total: ${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order actions */}
        {order.status === 'PROCESSING' && (
          <div className="bg-gray-50 px-6 py-4 border-t">
            <button
              onClick={handleCancelOrder}
              disabled={cancelLoading}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow-sm disabled:opacity-50"
            >
              {cancelLoading ? 'Cancelling...' : 'Cancel Order'}
            </button>
          </div>
        )}

        {order.status === 'IN_TRANSIT' && (
          <div className="bg-gray-50 px-6 py-4 border-t">
            <Link
              to={`/orders/${order.id}/tracking`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-sm inline-block"
            >
              Track Order
            </Link>
          </div>
        )}

        {order.status === 'DELIVERED' && (
          <div className="bg-gray-50 px-6 py-4 border-t flex justify-between">
            <button
              onClick={handleReorder}
              disabled={reorderLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-sm disabled:opacity-50"
            >
              {reorderLoading ? 'Adding to Cart...' : 'Reorder'}
            </button>
            <Link
              to={`/review/order/${order.id}`}
              className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded shadow-sm"
            >
              Write a Review
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailPage; 