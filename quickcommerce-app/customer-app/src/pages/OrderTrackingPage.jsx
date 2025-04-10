import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderDetails, trackOrderDelivery } from '../services/orderService';

const OrderTrackingPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  
  // Poll for tracking updates every 30 seconds
  useEffect(() => {
    let interval;
    
    const fetchTrackingData = async () => {
      try {
        const data = await trackOrderDelivery(orderId);
        setTracking(data);
        updateMarkerPosition(data.location);
      } catch (err) {
        console.error('Failed to fetch tracking data:', err);
      }
    };
    
    // Initial fetch
    fetchTrackingData();
    
    // Set up polling interval
    interval = setInterval(fetchTrackingData, 30000);
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [orderId]);
  
  useEffect(() => {
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
    
    fetchOrderDetails();
  }, [orderId]);
  
  // Initialize Google Maps
  useEffect(() => {
    const initializeMap = () => {
      // This is a placeholder for Google Maps initialization
      // In a real implementation, you would use the Google Maps JavaScript API
      
      if (!mapRef.current) return;
      
      // Load Google Maps API (this would typically be in index.html or via a library)
      if (!window.google) {
        console.warn('Google Maps API not loaded');
        return;
      }
      
      // Initialize map
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 37.7749, lng: -122.4194 }, // Default to San Francisco
        zoom: 12,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
      });
      
      mapInstanceRef.current = map;
      
      // Create marker
      const marker = new window.google.maps.Marker({
        map,
        icon: {
          url: '/delivery-marker.png', // You would need to add this image to your assets
          scaledSize: new window.google.maps.Size(40, 40),
        },
        title: 'Delivery Partner',
      });
      
      markerRef.current = marker;
      
      // If we have tracking data, update the marker position
      if (tracking && tracking.location) {
        updateMarkerPosition(tracking.location);
      }
    };
    
    // Call initialize map when the component mounts
    initializeMap();
    
    // Cleanup function
    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
    };
  }, []);
  
  const updateMarkerPosition = (location) => {
    if (!markerRef.current || !mapInstanceRef.current || !location) return;
    
    const { latitude, longitude } = location;
    const position = new window.google.maps.LatLng(latitude, longitude);
    
    markerRef.current.setPosition(position);
    mapInstanceRef.current.panTo(position);
  };
  
  const getDeliverySteps = () => {
    if (!order) return [];
    
    // Define standard delivery steps
    const steps = [
      { id: 'order_placed', label: 'Order Placed', status: 'completed', timestamp: order.orderDate },
      { id: 'order_processing', label: 'Processing', status: 'completed', timestamp: order.processingDate },
      { id: 'out_for_delivery', label: 'Out for Delivery', status: 'active', timestamp: order.shippingDate },
      { id: 'delivered', label: 'Delivered', status: 'pending', timestamp: null },
    ];
    
    // Update statuses based on order status
    if (order.status === 'DELIVERED') {
      steps[2].status = 'completed';
      steps[3].status = 'completed';
      steps[3].timestamp = order.deliveryDate;
    }
    
    return steps;
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
          <Link to={`/orders/${orderId}`} className="text-blue-600 hover:underline">
            &larr; Back to Order
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
        <Link to={`/orders/${orderId}`} className="text-blue-600 hover:underline">
          &larr; Back to Order
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border mb-6">
        <div className="bg-gray-50 px-6 py-4 border-b">
          <h1 className="text-xl font-bold">Tracking Order #{order.orderNumber}</h1>
        </div>
        
        <div className="p-6">
          {/* Delivery Progress */}
          <div className="mb-8">
            <h2 className="font-medium text-gray-900 mb-4">Delivery Status</h2>
            <div className="relative">
              {/* Progress Bar */}
              <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-200"></div>
              
              {/* Steps */}
              <div className="relative flex justify-between">
                {getDeliverySteps().map((step, index) => (
                  <div key={step.id} className="flex flex-col items-center">
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                        step.status === 'completed' 
                          ? 'bg-green-500 text-white' 
                          : step.status === 'active'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {step.status === 'completed' ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>
                    <div className="text-center mt-2">
                      <p className="font-medium">{step.label}</p>
                      {step.timestamp && (
                        <p className="text-xs text-gray-500">
                          {new Date(step.timestamp).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Map */}
          <div className="mb-6">
            <h2 className="font-medium text-gray-900 mb-4">Live Tracking</h2>
            <div 
              ref={mapRef} 
              className="w-full h-64 md:h-96 bg-gray-100 rounded-lg border"
              style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <p className="text-gray-500">
                Google Maps would be displayed here in a production environment
              </p>
            </div>
          </div>
          
          {/* Delivery Info */}
          {tracking && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="font-medium text-gray-900 mb-2">Delivery Partner</h2>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden mr-3">
                    {tracking.partner.imageUrl && (
                      <img
                        src={tracking.partner.imageUrl}
                        alt={tracking.partner.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{tracking.partner.name}</p>
                    <p className="text-sm text-gray-500">{tracking.partner.phone}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="font-medium text-gray-900 mb-2">Estimated Delivery</h2>
                <p className="text-lg font-bold">
                  {tracking.eta ? (
                    new Date(tracking.eta).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  ) : (
                    'Calculating...'
                  )}
                </p>
                
                {tracking.eta && (
                  <>
                    <p className="text-sm text-gray-500 mb-2">
                      {new Date(tracking.eta).toLocaleDateString([], { 
                        weekday: 'long', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                    <p className="font-medium text-blue-600">
                      {tracking.distance ? `${tracking.distance} away` : ''}
                    </p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Delivery Address */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border">
        <div className="bg-gray-50 px-6 py-4 border-b">
          <h2 className="font-medium">Delivery Address</h2>
        </div>
        <div className="p-6">
          <address className="not-italic">
            <p className="font-medium">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.street}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
            <p>{order.shippingAddress.country}</p>
          </address>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage; 