import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Logger, { LogLevel } from '../utils/LogUtil';
import { API_BASE_URL, AUTH_ENDPOINTS } from '../constants/Config';

interface LogViewerProps {
  maxHeight?: number;
  showControls?: boolean;
}

const LogViewer = ({ maxHeight = 300, showControls = true }: LogViewerProps) => {
  const [logs, setLogs] = useState(Logger.getLogs());
  const [visible, setVisible] = useState(__DEV__); // Only visible in development by default
  const [levelFilter, setLevelFilter] = useState<string | null>(null);
  const [platformFilter, setPlatformFilter] = useState<string | null>(null);
  
  useEffect(() => {
    // Subscribe to log updates
    const unsubscribe = Logger.subscribe(setLogs);
    
    // Log device and environment info when first mounted
    Logger.info('Log Viewer Initialized');
    Logger.info('Environment Info', {
      platform: Platform.OS,
      platformVersion: Platform.Version,
      apiUrl: API_BASE_URL,
      authEndpoints: AUTH_ENDPOINTS,
      isDev: __DEV__,
      constants: Platform.constants,
    });
    
    return unsubscribe;
  }, []);
  
  if (!visible) {
    return (
      <TouchableOpacity 
        style={styles.toggleButton} 
        onPress={() => setVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.toggleButtonText}>📋</Text>
      </TouchableOpacity>
    );
  }
  
  // Apply both filters
  const filteredLogs = logs.filter(log => {
    // Apply level filter if set
    if (levelFilter && log.level !== levelFilter) {
      return false;
    }
    
    // Apply platform filter if set
    if (platformFilter && (!log.data || log.data.platform !== platformFilter)) {
      return false;
    }
    
    return true;
  });
  
  const renderLogEntry = (log: any, index: number) => {
    let levelStyle;
    switch (log.level) {
      case LogLevel.ERROR:
        levelStyle = styles.errorText;
        break;
      case LogLevel.WARN:
        levelStyle = styles.warnText;
        break;
      case LogLevel.INFO:
        levelStyle = styles.infoText;
        break;
      default:
        levelStyle = styles.debugText;
    }
    
    const time = log.timestamp.toLocaleTimeString();
    const platform = log.data?.platform ? `[${log.data.platform}] ` : '';
    
    return (
      <View key={index} style={styles.logEntry}>
        <Text style={[styles.logTime, levelStyle]}>{time}</Text>
        <Text style={[styles.logText, levelStyle]}>
          {platform}{log.message}
          {log.data ? ' ' + JSON.stringify(log.data, null, 2) : ''}
        </Text>
      </View>
    );
  };
  
  // Get unique platforms from logs
  const platforms = [...new Set(logs
    .filter(log => log.data && log.data.platform)
    .map(log => log.data.platform)
  )];
  
  return (
    <View style={[styles.container, { maxHeight }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Logs</Text>
        {showControls && (
          <View style={styles.controls}>
            {/* Level filters */}
            <TouchableOpacity 
              style={[styles.filterButton, levelFilter === null && styles.activeFilter]} 
              onPress={() => setLevelFilter(null)}
            >
              <Text style={styles.filterButtonText}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterButton, levelFilter === LogLevel.ERROR && styles.activeFilter]} 
              onPress={() => setLevelFilter(LogLevel.ERROR)}
            >
              <Text style={styles.filterButtonText}>Errors</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterButton, levelFilter === LogLevel.INFO && styles.activeFilter]} 
              onPress={() => setLevelFilter(LogLevel.INFO)}
            >
              <Text style={styles.filterButtonText}>Info</Text>
            </TouchableOpacity>
            
            {/* Platform filters */}
            {platforms.length > 0 && (
              <View style={styles.platformFilters}>
                <TouchableOpacity 
                  style={[styles.platformButton, platformFilter === null && styles.activePlatform]} 
                  onPress={() => setPlatformFilter(null)}
                >
                  <Text style={styles.platformButtonText}>All</Text>
                </TouchableOpacity>
                {platforms.map(platform => (
                  <TouchableOpacity 
                    key={platform}
                    style={[styles.platformButton, platformFilter === platform && styles.activePlatform]} 
                    onPress={() => setPlatformFilter(platform)}
                  >
                    <Text style={styles.platformButtonText}>{platform}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            
            <TouchableOpacity style={styles.clearButton} onPress={() => Logger.clearLogs()}>
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => setVisible(false)}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <ScrollView style={styles.scrollView}>
        {filteredLogs.length === 0 ? (
          <Text style={styles.emptyText}>No logs to display</Text>
        ) : (
          filteredLogs.map(renderLogEntry)
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    zIndex: 9999,
    borderTopWidth: 1,
    borderTopColor: '#444',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#222',
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginHorizontal: 4,
    borderRadius: 4,
    backgroundColor: '#444',
  },
  activeFilter: {
    backgroundColor: '#666',
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  platformFilters: {
    flexDirection: 'row',
    marginLeft: 8,
    borderLeftWidth: 1,
    borderLeftColor: '#555',
    paddingLeft: 8,
  },
  platformButton: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginHorizontal: 2,
    borderRadius: 4,
    backgroundColor: '#553',
  },
  activePlatform: {
    backgroundColor: '#775',
  },
  platformButtonText: {
    color: '#fff',
    fontSize: 10,
  },
  clearButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginHorizontal: 4,
    borderRadius: 4,
    backgroundColor: '#555',
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  closeButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
    borderRadius: 4,
    backgroundColor: '#933',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  scrollView: {
    padding: 8,
  },
  logEntry: {
    marginBottom: 8,
    borderLeftWidth: 2,
    borderLeftColor: '#666',
    paddingLeft: 8,
  },
  logTime: {
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: '#aaa',
  },
  logText: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: '#ddd',
  },
  errorText: {
    color: '#ff6b6b',
  },
  warnText: {
    color: '#ffd166',
  },
  infoText: {
    color: '#4ecdc4',
  },
  debugText: {
    color: '#ddd',
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 20,
  },
  toggleButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  toggleButtonText: {
    fontSize: 20,
  }
});

export default LogViewer; 