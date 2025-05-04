import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  ActivityIndicator,
  Platform 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, router } from 'expo-router';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAuth } from '@/context/AuthContext';
import Logger from '@/utils/LogUtil';

// This would be replaced with actual data from API
const SAMPLE_ORDER = {
  id: 'ORD-1234',
  status: 'Accepted', // Accepted, Arrived at Restaurant, Order Picked Up, In Transit, Arrived at Location, Delivered
  customerName: 'John Doe',
  customerPhone: '+1 (555) 123-4567',
  customerAddress: '123 Main St, Building A, Apt 101, City, 12345',
  restaurantName: 'Burger Palace',
  restaurantPhone: '+1 (555) 987-6543',
  restaurantAddress: '789 Oak Ave, City, 12345',
  items: [
    { name: 'Cheeseburger', quantity: 2, price: 8.99 },
    { name: 'French Fries', quantity: 1, price: 3.99 },
    { name: 'Soda', quantity: 2, price: 1.99 },
  ],
  subtotal: 25.95,
  deliveryFee: 3.99,
  total: 29.94,
  estimatedDistance: 2.5, // miles or km
  estimatedTime: 15, // minutes
  estimatedEarnings: 7.50,
  orderTime: '2023-06-15T14:30:00Z',
};

type OrderStatus = 'Accepted' | 'ArrivedAtRestaurant' | 'OrderPickedUp' | 'InTransit' | 'ArrivedAtLocation' | 'Delivered' | 'DeliveryFailed';

// Status workflow definition
const STATUS_WORKFLOW = [
  { id: 'Accepted' as OrderStatus, label: 'Accepted', icon: 'check-circle' as const, color: '#4CAF50' },
  { id: 'ArrivedAtRestaurant' as OrderStatus, label: 'Arrived at Restaurant', icon: 'store' as const, color: '#2196F3' },
  { id: 'OrderPickedUp' as OrderStatus, label: 'Order Picked Up', icon: 'shopping-bag' as const, color: '#9C27B0' },
  { id: 'InTransit' as OrderStatus, label: 'In Transit', icon: 'local-shipping' as const, color: '#FF9800' },
  { id: 'ArrivedAtLocation' as OrderStatus, label: 'Arrived at Location', icon: 'location-on' as const, color: '#E91E63' },
  { id: 'Delivered' as OrderStatus, label: 'Delivered', icon: 'check-circle' as const, color: '#4CAF50' },
  { id: 'DeliveryFailed' as OrderStatus, label: 'Delivery Failed', icon: 'error' as const, color: '#F44336' },
];

export default function OrderDetailScreen() {
  const { orderId } = useLocalSearchParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(SAMPLE_ORDER);
  const [loading, setLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  
  useEffect(() => {
    // Fetch order details
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        Logger.info(`Fetching details for order ${orderId}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulate getting order with the passed orderId
        setOrder({...SAMPLE_ORDER, id: orderId as string});
        setLoading(false);
      } catch (error) {
        Logger.error('Error fetching order details', error);
        setLoading(false);
        Alert.alert("Error", "Could not fetch order details.");
      }
    };
    
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    setUpdatingStatus(true);
    try {
      // In a real app, this would be an API call
      Logger.info(`Updating order ${order.id} status to ${newStatus}`);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update local state
      setOrder({...order, status: newStatus});
      setUpdatingStatus(false);
      
      Alert.alert("Status Updated", `Order status updated to ${newStatus}`);
    } catch (error) {
      Logger.error('Error updating order status', error);
      setUpdatingStatus(false);
      Alert.alert("Error", "Could not update order status.");
    }
  };

  const getNextStatus = () => {
    const currentStatusIndex = STATUS_WORKFLOW.findIndex(s => s.id === order.status);
    if (currentStatusIndex === -1 || currentStatusIndex === STATUS_WORKFLOW.length - 2) {
      return STATUS_WORKFLOW[STATUS_WORKFLOW.length - 1]; // Delivery Failed is always an option
    }
    return STATUS_WORKFLOW[currentStatusIndex + 1];
  };

  const getStatusDisplay = () => {
    const statusObj = STATUS_WORKFLOW.find(s => s.id === order.status);
    return statusObj || STATUS_WORKFLOW[0];
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2575fc" />
        <Text style={styles.loadingText}>Loading order details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#6a11cb', '#2575fc']}
        style={styles.headerGradient}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <FontAwesome name="arrow-left" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order #{order.id}</Text>
        <View style={styles.statusChip}>
          <MaterialIcons name={getStatusDisplay().icon} size={16} color={getStatusDisplay().color} />
          <Text style={styles.statusText}>{getStatusDisplay().label}</Text>
        </View>
      </LinearGradient>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Order Summary Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Order Summary</Text>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Distance</Text>
                <Text style={styles.infoValue}>{order.estimatedDistance} mi</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Est. Time</Text>
                <Text style={styles.infoValue}>{order.estimatedTime} min</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Earnings</Text>
                <Text style={styles.infoValue}>${order.estimatedEarnings.toFixed(2)}</Text>
              </View>
            </View>
          </View>
          
          {/* Restaurant Details Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Pickup Location</Text>
            <Text style={styles.locationName}>{order.restaurantName}</Text>
            <Text style={styles.locationAddress}>{order.restaurantAddress}</Text>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => Alert.alert("Call Restaurant", `Call ${order.restaurantPhone}?`, [
                { text: "Cancel", style: "cancel" },
                { text: "Call", style: "default" }
              ])}
            >
              <FontAwesome name="phone" size={16} color="#2575fc" />
              <Text style={styles.actionButtonText}>Call Restaurant</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => Alert.alert("Open in Maps", "Open restaurant location in maps?")}
            >
              <FontAwesome name="map-marker" size={16} color="#2575fc" />
              <Text style={styles.actionButtonText}>Navigate to Restaurant</Text>
            </TouchableOpacity>
          </View>
          
          {/* Customer Details Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Delivery Location</Text>
            <Text style={styles.locationName}>{order.customerName}</Text>
            <Text style={styles.locationAddress}>{order.customerAddress}</Text>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => Alert.alert("Call Customer", `Call ${order.customerPhone}?`, [
                { text: "Cancel", style: "cancel" },
                { text: "Call", style: "default" }
              ])}
            >
              <FontAwesome name="phone" size={16} color="#2575fc" />
              <Text style={styles.actionButtonText}>Call Customer</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => Alert.alert("Open in Maps", "Open customer location in maps?")}
            >
              <FontAwesome name="map-marker" size={16} color="#2575fc" />
              <Text style={styles.actionButtonText}>Navigate to Customer</Text>
            </TouchableOpacity>
          </View>
          
          {/* Order Items Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Order Items</Text>
            {order.items.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <Text style={styles.itemQuantity}>{item.quantity}x</Text>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
              </View>
            ))}
            <View style={styles.divider} />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${order.total.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      
      {/* Update Status Footer */}
      <View style={styles.footer}>
        {updatingStatus ? (
          <ActivityIndicator size="small" color="#2575fc" />
        ) : (
          <>
            {order.status !== 'Delivered' && order.status !== 'DeliveryFailed' && (
              <TouchableOpacity 
                style={styles.updateStatusButton}
                onPress={() => handleStatusUpdate(getNextStatus().id)}
              >
                <MaterialIcons name={getNextStatus().icon} size={20} color="white" />
                <Text style={styles.updateStatusText}>
                  Update to {getNextStatus().label}
                </Text>
              </TouchableOpacity>
            )}
            
            {order.status !== 'DeliveryFailed' && order.status !== 'Delivered' && (
              <TouchableOpacity 
                style={[styles.updateStatusButton, styles.failedButton]}
                onPress={() => Alert.alert(
                  "Mark Delivery Failed?", 
                  "Are you sure you want to mark this delivery as failed?",
                  [
                    { text: "Cancel", style: "cancel" },
                    { text: "Yes", onPress: () => handleStatusUpdate('DeliveryFailed') }
                  ]
                )}
              >
                <MaterialIcons name="error" size={20} color="white" />
                <Text style={styles.updateStatusText}>Mark as Failed</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'column',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 5,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 15,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  locationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  locationAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    lineHeight: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 5,
  },
  actionButtonText: {
    color: '#2575fc',
    marginLeft: 8,
    fontWeight: '500',
  },
  itemRow: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  itemQuantity: {
    width: 30,
    fontSize: 14,
    color: '#666',
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2575fc',
  },
  footer: {
    backgroundColor: 'white',
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  updateStatusButton: {
    flex: 1,
    backgroundColor: '#2575fc',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  failedButton: {
    backgroundColor: '#F44336',
  },
  updateStatusText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
}); 