import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/context/AuthContext';
import { Text } from 'react-native';
import Logger from '@/utils/LogUtil';
import { Platform } from 'react-native';

// Define types for our data
interface Delivery {
  id: string;
  status: 'pending' | 'in-progress' | 'completed';
  customer: string;
  address: string;
  items: number;
  totalAmount: number;
  time: string;
}

interface PartnerStats {
  deliveriesCompleted: number;
  totalEarnings: number;
  rating: number;
  thisWeekEarnings: number;
}

// Sample data for deliveries
const MOCK_DELIVERIES: Delivery[] = [
  {
    id: 'del-001',
    status: 'pending',
    customer: 'John Doe',
    address: '123 Main St, City',
    items: 3,
    totalAmount: 45.97,
    time: '10:30 AM',
  },
  {
    id: 'del-002',
    status: 'in-progress',
    customer: 'Sarah Wilson',
    address: '456 Oak St, City',
    items: 2,
    totalAmount: 32.50,
    time: '11:15 AM',
  },
  {
    id: 'del-003',
    status: 'completed',
    customer: 'Mike Johnson',
    address: '789 Pine St, City',
    items: 5,
    totalAmount: 67.25,
    time: '09:45 AM',
  },
  {
    id: 'del-004',
    status: 'completed',
    customer: 'Emily Clark',
    address: '321 Cedar St, City',
    items: 1,
    totalAmount: 18.99,
    time: '08:30 AM',
  },
];

// Sample data for partner stats
const PARTNER_STATS: PartnerStats = {
  deliveriesCompleted: 43,
  totalEarnings: 532.50,
  rating: 4.8,
  thisWeekEarnings: 127.50,
};

export default function PartnerDashboard() {
  const { user, logout } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [deliveries, setDeliveries] = useState<Delivery[]>(MOCK_DELIVERIES);
  const [stats, setStats] = useState<PartnerStats>(PARTNER_STATS);

  useEffect(() => {
    Logger.info('Partner Dashboard loaded', { platform: Platform.OS });
    // In a real app, this would fetch real data from an API
    // fetchPartnerData();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    
    // Simulate API call
    setTimeout(() => {
      // In a real app, this would refresh data from the server
      Logger.info('Dashboard refreshed', { platform: Platform.OS });
      setRefreshing(false);
    }, 1500);
  }, []);

  const handleDeliveryPress = (delivery: Delivery) => {
    Alert.alert(
      `Delivery #${delivery.id}`,
      `Customer: ${delivery.customer}\nAddress: ${delivery.address}\nItems: ${delivery.items}\nAmount: $${delivery.totalAmount.toFixed(2)}`,
      [{ text: 'Close' }]
    );
  };

  const getStatusColor = (status: Delivery['status']) => {
    switch (status) {
      case 'pending': return '#f5a623';
      case 'in-progress': return '#4a90e2';
      case 'completed': return '#7ed321';
      default: return '#999';
    }
  };

  const StatusBadge = ({ status }: { status: Delivery['status'] }) => (
    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(status) }]}>
      <Text style={styles.statusText}>
        {status === 'in-progress' ? 'In Progress' : 
          status.charAt(0).toUpperCase() + status.slice(1)}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header with gradient background */}
      <LinearGradient
        colors={['#6a11cb', '#2575fc']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.welcomeText}>
            Welcome back, {user?.name || 'Partner'}
          </Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>${stats.thisWeekEarnings.toFixed(2)}</Text>
              <Text style={styles.statLabel}>This Week</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.deliveriesCompleted}</Text>
              <Text style={styles.statLabel}>Deliveries</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.rating}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Main content */}
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Deliveries section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Deliveries</Text>
          
          {deliveries.map((delivery) => (
            <TouchableOpacity 
              key={delivery.id} 
              style={styles.deliveryCard}
              onPress={() => handleDeliveryPress(delivery)}
            >
              <View style={styles.deliveryHeader}>
                <Text style={styles.deliveryTitle}>Order #{delivery.id}</Text>
                <StatusBadge status={delivery.status} />
              </View>
              <View style={styles.deliveryDetails}>
                <Text style={styles.deliveryCustomer}>{delivery.customer}</Text>
                <Text style={styles.deliveryAddress}>{delivery.address}</Text>
                <View style={styles.deliveryFooter}>
                  <Text style={styles.deliveryTime}>{delivery.time}</Text>
                  <Text style={styles.deliveryAmount}>${delivery.totalAmount.toFixed(2)}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Total earnings section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Total Earnings</Text>
          <View style={styles.earningsCard}>
            <Text style={styles.earningsValue}>${stats.totalEarnings.toFixed(2)}</Text>
            <Text style={styles.earningsLabel}>Lifetime earnings</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 15,
    width: '100%',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 10,
  },
  statValue: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  deliveryCard: {
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
  deliveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  deliveryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  deliveryDetails: {
    marginLeft: 5,
  },
  deliveryCustomer: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 3,
  },
  deliveryAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  deliveryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deliveryTime: {
    fontSize: 13,
    color: '#888',
  },
  deliveryAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  earningsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  earningsValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2575fc',
    marginBottom: 8,
  },
  earningsLabel: {
    fontSize: 14,
    color: '#666',
  },
});
