import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Define types for deliveries
interface Delivery {
  id: string;
  status: 'pending' | 'in-progress' | 'completed';
  customer: string;
  address: string;
  items: number;
  totalAmount: number;
  time: string;
  date: string;
}

// Sample data
const DELIVERIES: Delivery[] = [
  {
    id: 'del-001',
    status: 'pending',
    customer: 'John Doe',
    address: '123 Main St, City',
    items: 3,
    totalAmount: 45.97,
    time: '10:30 AM',
    date: '2023-05-01',
  },
  {
    id: 'del-002',
    status: 'in-progress',
    customer: 'Sarah Wilson',
    address: '456 Oak St, City',
    items: 2,
    totalAmount: 32.50,
    time: '11:15 AM',
    date: '2023-05-01',
  },
  {
    id: 'del-003',
    status: 'completed',
    customer: 'Mike Johnson',
    address: '789 Pine St, City',
    items: 5,
    totalAmount: 67.25,
    time: '09:45 AM',
    date: '2023-04-30',
  },
  {
    id: 'del-004',
    status: 'completed',
    customer: 'Emily Clark',
    address: '321 Cedar St, City',
    items: 1,
    totalAmount: 18.99,
    time: '08:30 AM',
    date: '2023-04-30',
  },
  {
    id: 'del-005',
    status: 'pending',
    customer: 'David Brown',
    address: '555 Maple Ave, City',
    items: 4,
    totalAmount: 52.75,
    time: '01:45 PM',
    date: '2023-05-01',
  },
  {
    id: 'del-006',
    status: 'completed',
    customer: 'Jessica White',
    address: '777 Elm St, City',
    items: 2,
    totalAmount: 29.99,
    time: '02:30 PM',
    date: '2023-04-29',
  },
  {
    id: 'del-007',
    status: 'pending',
    customer: 'Brian Miller',
    address: '888 Oak Dr, City',
    items: 6,
    totalAmount: 75.50,
    time: '03:15 PM',
    date: '2023-05-01',
  },
];

export default function DeliveriesScreen() {
  const [deliveries, setDeliveries] = useState<Delivery[]>(DELIVERIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  // Filter deliveries based on search query and selected filter
  const filteredDeliveries = deliveries.filter(delivery => {
    // Apply status filter if selected
    if (selectedFilter && delivery.status !== selectedFilter) {
      return false;
    }
    
    // Apply search query if provided
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        delivery.customer.toLowerCase().includes(query) ||
        delivery.address.toLowerCase().includes(query) ||
        delivery.id.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

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

  const renderItem = ({ item }: { item: Delivery }) => (
    <TouchableOpacity style={styles.deliveryCard}>
      <View style={styles.deliveryHeader}>
        <View>
          <Text style={styles.deliveryTitle}>Order #{item.id}</Text>
          <Text style={styles.deliveryDate}>{item.date}</Text>
        </View>
        <StatusBadge status={item.status} />
      </View>
      <View style={styles.divider} />
      <View style={styles.deliveryContent}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Customer:</Text>
          <Text style={styles.infoValue}>{item.customer}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Address:</Text>
          <Text style={styles.infoValue}>{item.address}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Items:</Text>
          <Text style={styles.infoValue}>{item.items}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Amount:</Text>
          <Text style={styles.infoValue}>${item.totalAmount.toFixed(2)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Time:</Text>
          <Text style={styles.infoValue}>{item.time}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const FilterButton = ({ title, value }: { title: string; value: string | null }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedFilter === value && styles.filterButtonActive,
      ]}
      onPress={() => setSelectedFilter(value === selectedFilter ? null : value)}
    >
      <Text
        style={[
          styles.filterButtonText,
          selectedFilter === value && styles.filterButtonTextActive,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#6a11cb', '#2575fc']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Deliveries</Text>
      </LinearGradient>

      {/* Search and filters */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search orders, customers or addresses..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <View style={styles.filtersRow}>
          <FilterButton title="All" value={null} />
          <FilterButton title="Pending" value="pending" />
          <FilterButton title="In Progress" value="in-progress" />
          <FilterButton title="Completed" value="completed" />
        </View>
      </View>

      {/* Deliveries list */}
      <FlatList
        data={filteredDeliveries}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No deliveries found</Text>
          </View>
        }
      />
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
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  filtersRow: {
    flexDirection: 'row',
    marginTop: 12,
    justifyContent: 'space-between',
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
  },
  filterButtonActive: {
    backgroundColor: '#2575fc',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  filterButtonTextActive: {
    color: 'white',
  },
  listContainer: {
    padding: 16,
  },
  deliveryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  deliveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  deliveryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  deliveryDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  deliveryContent: {
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    width: 80,
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
  },
  infoValue: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
}); 