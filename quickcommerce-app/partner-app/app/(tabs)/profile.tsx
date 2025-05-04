import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Alert, Switch } from 'react-native';
import { Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';
import Logger from '@/utils/LogUtil';
import { Platform } from 'react-native';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);
  const [availableForDelivery, setAvailableForDelivery] = React.useState(true);

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            Logger.info('User logged out', { platform: Platform.OS });
            await logout();
            router.replace('/login');
          }
        }
      ]
    );
  };

  const handleChangePassword = () => {
    // Would navigate to change password screen
    Alert.alert("Feature Coming Soon", "Change password functionality will be available soon.");
  };

  const handleEditProfile = () => {
    // Would navigate to edit profile screen
    Alert.alert("Feature Coming Soon", "Edit profile functionality will be available soon.");
  };

  const handleVehicleInfo = () => {
    // Would navigate to vehicle info screen
    Alert.alert("Feature Coming Soon", "Vehicle information management will be available soon.");
  };

  const handlePaymentInfo = () => {
    // Would navigate to payment info screen
    Alert.alert("Feature Coming Soon", "Payment information management will be available soon.");
  };

  const renderProfileHeader = () => (
    <LinearGradient
      colors={['#6a11cb', '#2575fc']}
      style={styles.headerGradient}
    >
      <View style={styles.profileHeaderContent}>
        <View style={styles.profileImagePlaceholder}>
          <Text style={styles.profileImageText}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'P'}
          </Text>
        </View>
        <Text style={styles.profileName}>{user?.name || 'Partner'}</Text>
        <Text style={styles.profileEmail}>{user?.email || 'partner@example.com'}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>Rating: 4.8 ★</Text>
          <Text style={styles.partnerSinceText}>Partner since May 2023</Text>
        </View>
      </View>
    </LinearGradient>
  );

  const ProfileMenuSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.menuSection}>
      <Text style={styles.menuSectionTitle}>{title}</Text>
      <View style={styles.menuContainer}>
        {children}
      </View>
    </View>
  );

  const MenuButton = ({ label, onPress, icon }: { label: string; onPress: () => void; icon?: string }) => (
    <TouchableOpacity style={styles.menuButton} onPress={onPress}>
      <Text style={styles.menuButtonText}>{label}</Text>
      <Text style={styles.menuButtonIcon}>›</Text>
    </TouchableOpacity>
  );

  const ToggleOption = ({ 
    label, 
    value, 
    onValueChange
  }: { 
    label: string; 
    value: boolean; 
    onValueChange: (newValue: boolean) => void;
  }) => (
    <View style={styles.toggleOption}>
      <Text style={styles.toggleOptionText}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#ccc', true: '#2575fc' }}
        thumbColor={value ? '#fff' : '#fff'}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        {renderProfileHeader()}

        <View style={styles.contentContainer}>
          {/* Account Section */}
          <ProfileMenuSection title="Account">
            <MenuButton 
              label="Edit Profile" 
              onPress={handleEditProfile} 
            />
            <MenuButton 
              label="Change Password" 
              onPress={handleChangePassword} 
            />
          </ProfileMenuSection>

          {/* Delivery Settings */}
          <ProfileMenuSection title="Delivery Settings">
            <MenuButton 
              label="Vehicle Information" 
              onPress={handleVehicleInfo} 
            />
            <MenuButton 
              label="Payment Information" 
              onPress={handlePaymentInfo} 
            />
            <ToggleOption
              label="Available for Deliveries"
              value={availableForDelivery}
              onValueChange={setAvailableForDelivery}
            />
          </ProfileMenuSection>

          {/* App Settings */}
          <ProfileMenuSection title="App Settings">
            <ToggleOption
              label="Push Notifications"
              value={notifications}
              onValueChange={setNotifications}
            />
            <ToggleOption
              label="Dark Mode"
              value={darkMode}
              onValueChange={setDarkMode}
            />
          </ProfileMenuSection>

          {/* Logout button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>

          <Text style={styles.versionText}>Version 1.0.0</Text>
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
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 30,
  },
  profileHeaderContent: {
    alignItems: 'center',
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImageText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  ratingText: {
    color: 'white',
    fontWeight: '600',
    marginRight: 12,
  },
  partnerSinceText: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  contentContainer: {
    padding: 16,
  },
  menuSection: {
    marginBottom: 24,
  },
  menuSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  menuContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuButtonText: {
    fontSize: 16,
    color: '#333',
  },
  menuButtonIcon: {
    fontSize: 20,
    color: '#999',
  },
  toggleOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  toggleOptionText: {
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#ff3b30',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginVertical: 16,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  versionText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 8,
    marginBottom: 30,
  },
}); 