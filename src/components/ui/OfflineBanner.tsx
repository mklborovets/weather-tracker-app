import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { formatTimeAgo } from '@/utils/formatters';

export interface OfflineBannerProps {
  lastUpdated?: string;
  onRefresh?: () => void;
}

export function OfflineBanner({ lastUpdated, onRefresh }: OfflineBannerProps) {
  const timeText = lastUpdated ? formatTimeAgo(lastUpdated) : 'recently';

  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        <Ionicons name="cloud-offline-outline" size={18} color="#f59e0b" />
        <Text style={styles.bannerText}>Offline mode • Updated {timeText}</Text>
      </View>

      {onRefresh && (
        <TouchableOpacity
          onPress={onRefresh}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.refreshButton}
          accessibilityLabel="Retry connection"
        >
          <Ionicons name="refresh" size={14} color="#f59e0b" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#d97706',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  bannerText: {
    color: '#fbbf24',
    fontSize: 13,
    fontWeight: '600',
  },
  refreshButton: {
    padding: 4,
    borderRadius: 6,
    backgroundColor: '#292524',
  },
});
