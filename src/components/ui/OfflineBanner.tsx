import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useThemeColors } from '@/hooks/useThemeColors';
import { formatTimeAgo } from '@/utils/formatters';

export interface OfflineBannerProps {
  lastUpdated?: string;
  onRefresh?: () => void;
}

export function OfflineBanner({ lastUpdated, onRefresh }: OfflineBannerProps) {
  const { colors, isDark } = useThemeColors();
  const timeText = lastUpdated ? formatTimeAgo(lastUpdated) : 'recently';

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? colors.card : '#fef3c7',
          borderColor: colors.warning,
        },
      ]}
    >
      <View style={styles.leftContent}>
        <Ionicons name="cloud-offline-outline" size={18} color={colors.warning} />
        <Text style={[styles.bannerText, { color: isDark ? colors.warning : '#92400e' }]}>
          Offline mode • Updated {timeText}
        </Text>
      </View>

      {onRefresh && (
        <TouchableOpacity
          onPress={onRefresh}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={[
            styles.refreshButton,
            { backgroundColor: isDark ? colors.cardSecondary : '#fde68a' },
          ]}
          accessibilityLabel="Retry connection"
        >
          <Ionicons name="refresh" size={14} color={isDark ? colors.warning : '#92400e'} />
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
    borderWidth: 1,
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
    fontSize: 13,
    fontWeight: '600',
  },
  refreshButton: {
    padding: 6,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
