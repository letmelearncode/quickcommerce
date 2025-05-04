import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  Image, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import Logger from '@/utils/LogUtil';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

// This would be replaced with actual data from API/WebSocket
const SAMPLE_ORDER_REQUEST = {
  id: 'ORD-1234',
  customerName: 'John Doe',
  customerAddress: '123 Main St, City',
  restaurantName: 'Burger Palace',
  restaurantAddress: '789 Oak Ave, City',
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
  expiresIn: 45, // seconds to accept/reject
};

export default function OrderRequestScreen() {
  const { user } = useAuth();
  const [orderRequest, setOrderRequest] = useState(SAMPLE_ORDER_REQUEST);
  const [timeLeft, setTimeLeft] = useState(orderRequest.expiresIn);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Timer countdown effect
  useEffect(() => {
    if (timeLeft <= 0) {
      // Auto-reject if time expires
      handleReject('Timeout');
      return;
    }

    const timerId = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timerId);
  }, [timeLeft]);

  // Simulate incoming order requests
  useEffect(() => {
    // In a real app, this would be replaced with WebSocket/FCM listeners
    Logger.info('Listening for delivery requests', { platform: Platform.OS });

    // Cleanup function
    return () => {
      Logger.info('Stopped listening for delivery requests');
    };
  }, []);

  const handleAccept = async () => {
    try {
      // Provide haptic feedback
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      setLoading(true);
      
      // Simulate API call to accept order
      Logger.info(`Accepting order ${orderRequest.id}`);
      
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsVisible(false);
      
      // Show confirmation
      Alert.alert(
        "Order Accepted",
        `You've accepted order #${orderRequest.id}. Head to the restaurant to pick up the order.`,
        [
          { 
            text: "View Order", 
            onPress: () => router.push({
              pathname: '/(tabs)/deliveries',
              params: { orderId: orderRequest.id }
            })
          }
        ]
      );
      
      setLoading(false);
    } catch (error) {
      Logger.error('Error accepting order', error);
      setLoading(false);
      Alert.alert("Error", "There was a problem accepting this order. Please try again.");
    }
  };

  const handleReject = async (reason = 'Manually Rejected') => {
    try {
      // Provide haptic feedback
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
      
      setLoading(true);
      
      // Simulate API call to reject order
      Logger.info(`Rejecting order ${orderRequest.id}`, { reason });
      
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsVisible(false);
      setLoading(false);
    } catch (error) {
      Logger.error('Error rejecting order', error);
      setLoading(false);
      Alert.alert("Error", "There was a problem rejecting this order. Please try again.");
    }
  };

  // Calculate time left in MM:SS format
  const formatTimeLeft = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={() => handleReject('Modal Closed')}
    >
      <View style={styles.centeredView}>
        <LinearGradient
          colors={['#6a11cb', '#2575fc']}
          style={styles.headerGradient}
        >
          <Text style={styles.headerTitle}>New Delivery Request</Text>
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>
              Expires in: {formatTimeLeft()}
            </Text>
          </View>
        </LinearGradient>
        
        <View style={styles.contentContainer}>
          {/* Order Details */}
          <View style={styles.orderInfoContainer}>
            <Text style={styles.sectionTitle}>Order #{orderRequest.id}</Text>
            
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Distance</Text>
                <Text style={styles.infoValue}>{orderRequest.estimatedDistance} mi</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Est. Time</Text>
                <Text style={styles.infoValue}>{orderRequest.estimatedTime} min</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Earnings</Text>
                <Text style={styles.infoValue}>${orderRequest.estimatedEarnings.toFixed(2)}</Text>
              </View>
            </View>
          </View>
          
          {/* Restaurant Details */}
          <View style={styles.detailCard}>
            <Text style={styles.detailTitle}>Pickup from</Text>
            <Text style={styles.detailName}>{orderRequest.restaurantName}</Text>
            <Text style={styles.detailAddress}>{orderRequest.restaurantAddress}</Text>
          </View>
          
          {/* Customer Details */}
          <View style={styles.detailCard}>
            <Text style={styles.detailTitle}>Deliver to</Text>
            <Text style={styles.detailName}>{orderRequest.customerName}</Text>
            <Text style={styles.detailAddress}>{orderRequest.customerAddress}</Text>
          </View>
          
          {/* Order Summary */}
          <View style={styles.detailCard}>
            <Text style={styles.detailTitle}>Order Summary</Text>
            {orderRequest.items.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <Text style={styles.itemQuantity}>{item.quantity}x</Text>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
              </View>
            ))}
            <View style={styles.divider} />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${orderRequest.total.toFixed(2)}</Text>
            </View>
          </View>
          
          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#2575fc" />
            ) : (
              <>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.rejectButton]} 
                  onPress={() => handleReject()}
                >
                  <Text style={styles.rejectButtonText}>Decline</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.acceptButton]} 
                  onPress={handleAccept}
                >
                  <Text style={styles.acceptButtonText}>Accept</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  timerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 20,
  },
  timerText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    padding: 20,
  },
  orderInfoContainer: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
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
  detailCard: {
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
  detailTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  detailName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  detailAddress: {
    fontSize: 14,
    color: '#444',
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  rejectButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  acceptButton: {
    backgroundColor: '#2575fc',
  },
  rejectButtonText: {
    color: '#666',
    fontWeight: 'bold',
    fontSize: 16,
  },
  acceptButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 