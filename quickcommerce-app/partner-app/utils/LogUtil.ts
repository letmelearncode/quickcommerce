import { Platform } from 'react-native';

interface LogEntry {
  timestamp: Date;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  data?: any;
}

// Maximum number of logs to keep in memory
const MAX_LOGS = 100;

// Storage for logs
let logs: LogEntry[] = [];
let listeners: ((logs: LogEntry[]) => void)[] = [];

// Get device info for logging
const deviceInfo = {
  platform: Platform.OS,
  version: Platform.Version,
  // Only include properties that exist on all platforms
  constants: Platform.constants || {},
};

// Utility function to add platform info to log data
const withPlatformInfo = (data?: any) => {
  if (!data) {
    return { platform: Platform.OS, platformVersion: Platform.Version };
  }
  
  // If data is already an object, add platform info
  if (typeof data === 'object' && data !== null) {
    return {
      ...data,
      platform: data.platform || Platform.OS,
      platformVersion: data.platformVersion || Platform.Version
    };
  }
  
  // If data is not an object, wrap it
  return { 
    value: data,
    platform: Platform.OS,
    platformVersion: Platform.Version
  };
};

// Log levels
export const LogLevel = {
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
  DEBUG: 'debug'
} as const;

// The logging functions
export const Logger = {
  info: (message: string, data?: any) => addLog('info', message, withPlatformInfo(data)),
  warn: (message: string, data?: any) => addLog('warn', message, withPlatformInfo(data)),
  error: (message: string, data?: any) => addLog('error', message, withPlatformInfo(data)),
  debug: (message: string, data?: any) => addLog('debug', message, withPlatformInfo(data)),
  
  // Get all logs
  getLogs: () => [...logs],
  
  // Clear logs
  clearLogs: () => {
    logs = [];
    notifyListeners();
  },
  
  // Subscribe to log updates
  subscribe: (callback: (logs: LogEntry[]) => void) => {
    listeners.push(callback);
    return () => {
      listeners = listeners.filter(listener => listener !== callback);
    };
  },
  
  // Get device info
  getDeviceInfo: () => ({...deviceInfo}),
  
  // Log device info
  logDeviceInfo: () => {
    addLog('info', 'Device Info', deviceInfo);
  }
};

// Internal function to add a log
function addLog(level: 'info' | 'warn' | 'error' | 'debug', message: string, data?: any) {
  const entry: LogEntry = {
    timestamp: new Date(),
    level,
    message,
    data
  };
  
  // Add to logs and truncate if needed
  logs = [entry, ...logs].slice(0, MAX_LOGS);
  
  // Also log to console
  switch (level) {
    case 'info':
      console.info(message, data);
      break;
    case 'warn':
      console.warn(message, data);
      break;
    case 'error':
      console.error(message, data);
      break;
    case 'debug':
    default:
      console.debug(message, data);
      break;
  }
  
  // Notify listeners
  notifyListeners();
  
  return entry;
}

// Notify all listeners
function notifyListeners() {
  listeners.forEach(listener => listener([...logs]));
}

// Export default
export default Logger; 