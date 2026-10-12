import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Skeleton } from '@/components/ui/Skeleton';
import { useThemeColors } from '@/hooks/useThemeColors';

export function WeatherSkeleton() {
  const { colors } = useThemeColors();

  return (
    <View style={styles.container}>
      {/* Current weather card skeleton */}
      <View
        style={[styles.currentCard, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
        <Skeleton width={160} height={28} borderRadius={8} style={styles.centerItem} />
        <View style={styles.tempRow}>
          <Skeleton width={64} height={64} borderRadius={32} />
          <View style={styles.tempTextCol}>
            <Skeleton width={110} height={46} borderRadius={10} />
            <Skeleton width={90} height={18} borderRadius={6} style={styles.topSpaceSmall} />
          </View>
        </View>

        <View style={styles.metricsRow}>
          <Skeleton width="30%" height={74} borderRadius={14} />
          <Skeleton width="30%" height={74} borderRadius={14} />
          <Skeleton width="30%" height={74} borderRadius={14} />
        </View>
      </View>

      {/* Forecast section skeleton */}
      <Skeleton width={140} height={22} borderRadius={6} style={styles.forecastTitle} />
      <View
        style={[styles.forecastCard, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
        {[1, 2, 3, 4, 5].map((item, index) => (
          <View key={item} style={styles.forecastRow}>
            <Skeleton width={70} height={18} borderRadius={6} />
            <Skeleton width={26} height={26} borderRadius={13} />
            <Skeleton width={80} height={18} borderRadius={6} />
            {index < 4 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  currentCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    marginBottom: 20,
    alignItems: 'center',
  },
  centerItem: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  tempRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 20,
  },
  tempTextCol: {
    gap: 6,
  },
  topSpaceSmall: {
    marginTop: 4,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  forecastTitle: {
    marginBottom: 12,
  },
  forecastCard: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
  },
  forecastRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  divider: {
    height: 1,
  },
});
