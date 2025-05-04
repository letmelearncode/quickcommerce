import { Platform } from 'react-native';
import Logger from '../utils/LogUtil';

// Configure API base URLs for different platforms
// For Android emulator, use 10.0.2.2 instead of localhost
// For iOS simulator, use localhost
// For physical devices or Expo Go, use your computer's local IP address

// Set this to your machine's IP address when testing on Expo Go or physical devices
// For example: '192.168.1.100:8080'
// This IP should be accessible from your mobile device on the same network
const CUSTOM_IP_ADDRESS = '192.168.31.73:8080';

// Using Expo Go requires using your local network IP
const IS_USING_EXPO_GO = true;

// For iOS simulators connecting to Spring Boot on Mac, 
// it's often more reliable to use your Mac's actual local IP
// instead of localhost when you're having connection issues
const USE_LOCAL_IP_FOR_IOS_SIMULATOR = true;

// Get local IP for Mac development
// You can manually replace this with your actual IP if needed
const getLocalIpForMac = () => {
  // Updated with actual IP from ifconfig
  return '192.168.31.73';
};

const getBaseUrl = () => {
  // For Expo Go, always use the custom IP address
  if (IS_USING_EXPO_GO && CUSTOM_IP_ADDRESS) {
    console.log(`Using custom IP for Expo Go: ${CUSTOM_IP_ADDRESS}`);
    return `http://${CUSTOM_IP_ADDRESS}`;
  }

  // If environment variable or custom host is set, use that
  if (CUSTOM_IP_ADDRESS) {
    return `http://${CUSTOM_IP_ADDRESS}`;
  }

  if (Platform.OS === 'android') {
    // Android emulator uses 10.0.2.2 to access host machine's localhost
    return 'http://10.0.2.2:8080';
  } else if (Platform.OS === 'ios') {
    // iOS simulator can use localhost, but sometimes actual local IP works better
    if (USE_LOCAL_IP_FOR_IOS_SIMULATOR) {
      const localIp = getLocalIpForMac();
      return `http://${localIp}:8080`;
    }
    return 'http://localhost:8080';
  } else if (Platform.OS === 'web') {
    // For web, use relative URL to avoid CORS issues (if backend and frontend are served from same origin)
    // Otherwise, use the full URL
    return window.location.hostname === 'localhost' 
      ? 'http://localhost:8080' 
      : '';
  } else {
    // Default fallback
    return 'http://localhost:8080';
  }
};

// API base URL based on platform
export const API_BASE_URL = getBaseUrl();

// Log the base URL for debugging
console.log(`API_BASE_URL: ${API_BASE_URL} (Platform: ${Platform.OS})`);
Logger.info('API Configuration', {
  baseUrl: API_BASE_URL,
  platform: Platform.OS,
  isExpoGo: IS_USING_EXPO_GO
});

// Authentication endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: '/api/partner/auth/login',
  SIGNUP: '/api/partner/auth/signup',
  PROFILE: '/api/partner/profile',
};

// Token key for secure storage
export const AUTH_TOKEN_KEY = 'authToken';
export const USER_DATA_KEY = 'user'; 