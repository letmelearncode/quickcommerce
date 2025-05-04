import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Define types
interface EarningPeriod {
  id: string;
  startDate: string;
  endDate: string;
  amount: number;
  deliveries: number;
  status: 'pending' | 'paid';
  bonuses?: {
    reason: string;
    amount: number;
  }[];
}

// Sample data
const EARNINGS_DATA: EarningPeriod[] = [
  {
    id: 'week-18',
    startDate: '2023-05-01',
    endDate: '2023-05-07',
    amount: 325.75,
    deliveries: 27,
    status: 'pending',
    bonuses: [
      { reason: 'Delivery streak', amount: 25.00 },
      { reason: 'High customer rating', amount: 15.00 }
    ]
  },
  {
    id: 'week-17',
    startDate: '2023-04-24',
    endDate: '2023-04-30',
    amount: 287.50,
    deliveries: 23,
    status: 'paid',
  },
  {
    id: 'week-16',
    startDate: '2023-04-17',
    endDate: '2023-04-23',
    amount: 310.25,
    deliveries: 25,
    status: 'paid',
    bonuses: [
      { reason: 'Weekend bonus', amount: 20.00 }
    ]
  },
  {
    id: 'week-15',
    startDate: '2023-04-10',
    endDate: '2023-04-16',
    amount: 295.00,
    deliveries: 24,
    status: 'paid',
  },
];

// Stats data
const EARNING_STATS = {
  currentWeek: 127.50,
  lastWeek: 287.50,
  thisMonth: 875.75,
  lastMonth: 950.25,
  totalEarnings: 3250.75,
  avgPerDelivery: 12.45,
  avgPerWeek: 305.25,
};

export default function EarningsScreen() {
  const [activeTab, setActiveTab] = useState('weekly');

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatDateRange = (start: string, end: string) => {
    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  const renderWeeklyEarnings = () => (
    <View style={styles.earningsContainer}>
      {EARNINGS_DATA.map(period => (
        <TouchableOpacity key={period.id} style={styles.earningCard}>
          <View style={styles.earningHeader}>
            <View>
              <Text style={styles.earningTitle}>Week of {formatDate(period.startDate)}</Text>
              <Text style={styles.earningDateRange}>{formatDateRange(period.startDate, period.endDate)}</Text>
            </View>
            <View style={[
              styles.statusBadge, 
              { backgroundColor: period.status === 'paid' ? '#7ed321' : '#f5a623' }
            ]}>
              <Text style={styles.statusText}>{period.status === 'paid' ? 'Paid' : 'Pending'}</Text>
            </View>
          </View>
          
          <View style={styles.earningDetails}>
            <View style={styles.earningRow}>
              <Text style={styles.earningLabel}>Base earnings</Text>
              <Text style={styles.earningValue}>
                ${(period.amount - (period.bonuses?.reduce((sum, bonus) => sum + bonus.amount, 0) || 0)).toFixed(2)}
              </Text>
            </View>
            
            {period.bonuses && period.bonuses.map((bonus, index) => (
              <View key={index} style={styles.earningRow}>
                <Text style={styles.earningLabelBonus}>{bonus.reason}</Text>
                <Text style={styles.earningValueBonus}>+${bonus.amount.toFixed(2)}</Text>
              </View>
            ))}
            
            <View style={styles.divider} />
            
            <View style={styles.earningRow}>
              <Text style={styles.earningLabelTotal}>Total earnings</Text>
              <Text style={styles.earningValueTotal}>${period.amount.toFixed(2)}</Text>
            </View>
            
            <View style={styles.earningFooter}>
              <Text style={styles.deliveriesText}>{period.deliveries} deliveries</Text>
              <Text style={styles.avgPerDeliveryText}>
                ${(period.amount / period.deliveries).toFixed(2)} per delivery
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderStatItem = (label: string, value: string) => (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const renderStats = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statsRow}>
        {renderStatItem('Current Week', `$${EARNING_STATS.currentWeek.toFixed(2)}`)}
        {renderStatItem('Last Week', `$${EARNING_STATS.lastWeek.toFixed(2)}`)}
      </View>
      <View style={styles.statsRow}>
        {renderStatItem('This Month', `$${EARNING_STATS.thisMonth.toFixed(2)}`)}
        {renderStatItem('Last Month', `$${EARNING_STATS.lastMonth.toFixed(2)}`)}
      </View>
      <View style={styles.statsRow}>
        {renderStatItem('Avg. Per Delivery', `$${EARNING_STATS.avgPerDelivery.toFixed(2)}`)}
        {renderStatItem('Avg. Per Week', `$${EARNING_STATS.avgPerWeek.toFixed(2)}`)}
      </View>
      <View style={styles.totalEarningsContainer}>
        <Text style={styles.totalEarningsLabel}>Total Lifetime Earnings</Text>
        <Text style={styles.totalEarningsValue}>${EARNING_STATS.totalEarnings.toFixed(2)}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#6a11cb', '#2575fc']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Earnings</Text>
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'weekly' && styles.activeTab]}
          onPress={() => setActiveTab('weekly')}
        >
          <Text style={[styles.tabText, activeTab === 'weekly' && styles.activeTabText]}>Weekly</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'stats' && styles.activeTab]}
          onPress={() => setActiveTab('stats')}
        >
          <Text style={[styles.tabText, activeTab === 'stats' && styles.activeTabText]}>Stats</Text>
        </TouchableOpacity>
      </View>

      {/* Content based on active tab */}
      <ScrollView style={styles.scrollView}>
        {activeTab === 'weekly' ? renderWeeklyEarnings() : renderStats()}
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
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#2575fc',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#2575fc',
  },
  scrollView: {
    flex: 1,
  },
  earningsContainer: {
    padding: 16,
  },
  earningCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  earningHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  earningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  earningDateRange: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  earningDetails: {
    padding: 16,
  },
  earningRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  earningLabel: {
    fontSize: 15,
    color: '#333',
  },
  earningValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  earningLabelBonus: {
    fontSize: 14,
    color: '#4a90e2',
    fontStyle: 'italic',
  },
  earningValueBonus: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4a90e2',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 8,
  },
  earningLabelTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  earningValueTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2575fc',
  },
  earningFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  deliveriesText: {
    fontSize: 14,
    color: '#666',
  },
  avgPerDeliveryText: {
    fontSize: 14,
    color: '#666',
  },
  statsContainer: {
    padding: 16,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2575fc',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  totalEarningsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    marginTop: 8,
    marginHorizontal: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  totalEarningsLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  totalEarningsValue: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#2575fc',
  },
}); 