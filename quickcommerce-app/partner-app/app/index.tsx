import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { View, ActivityIndicator, Text, Platform } from 'react-native';
import { API_BASE_URL } from '../constants/Config';

export default function IndexPage() {
  const { token, isLoading, user } = useAuth();
  
  useEffect(() => {
    // Log authentication status for debugging
    console.log('Authentication status:', {
      isLoading,
      token: token ? 'Token exists' : 'No token',
      user: user ? `Logged in as ${user.email}` : 'Not logged in',
      platform: Platform.OS,
      apiUrl: API_BASE_URL
    });
  }, [token, isLoading, user]);
  
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2575fc" />
        <Text style={{ marginTop: 10, color: '#666' }}>Loading...</Text>
      </View>
    );
  }
  
  return token ? <Redirect href="/(tabs)" /> : <Redirect href="/login" />;
} 