import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { WeatherData } from '@/types/weather';
import { TemperatureUnit } from '@/store/useSettings';
import { useThemeColors } from '@/hooks/useThemeColors';
import { getWeatherInfo } from '@/utils/weatherCodes';
import { formatTemperature, formatWindSpeed } from '@/utils/formatters';

export interface CurrentWeatherViewProps {
  weather: WeatherData;
  unit: TemperatureUnit;
}

export function CurrentWeatherView({ weather, unit }: CurrentWeatherViewProps) {
  const { colors } = useThemeColors();
  const { current, cityName } = weather;
  const condition = getWeatherInfo(current.weatherCode);

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {cityName ? (
        <Text style={[styles.cityName, { color: colors.textPrimary }]}>{cityName}</Text>
      ) : null}

      <View style={styles.mainInfoRow}>
        <Ionicons
          name={condition.iconName}
          size={58}
          color={condition.iconColor}
          style={styles.weatherIcon}
        />
        <View style={styles.temperatureWrapper}>
          <Text style={[styles.temperature, { color: colors.textPrimary }]}>
            {formatTemperature(current.temperature, unit)}
          </Text>
          <Text style={[styles.conditionLabel, { color: colors.textSecondary }]}>
            {condition.label}
          </Text>
        </View>
      </View>

      <View style={styles.metricsGrid}>
        <View
          style={[
            styles.metricCard,
            {
              backgroundColor: colors.cardSecondary,
              borderColor: colors.border,
            },
          ]}
        >
          <Ionicons
            name="thermometer-outline"
            size={20}
            color="#f59e0b"
            style={styles.metricIcon}
          />
          <Text style={[styles.metricTitle, { color: colors.textSecondary }]}>Feels like</Text>
          <Text style={[styles.metricValue, { color: colors.textPrimary }]}>
            {formatTemperature(current.apparentTemperature, unit)}
          </Text>
        </View>

        <View
          style={[
            styles.metricCard,
            {
              backgroundColor: colors.cardSecondary,
              borderColor: colors.border,
            },
          ]}
        >
          <Ionicons name="water-outline" size={20} color="#38bdf8" style={styles.metricIcon} />
          <Text style={[styles.metricTitle, { color: colors.textSecondary }]}>Humidity</Text>
          <Text style={[styles.metricValue, { color: colors.textPrimary }]}>
            {current.humidity}%
          </Text>
        </View>

        <View
          style={[
            styles.metricCard,
            {
              backgroundColor: colors.cardSecondary,
              borderColor: colors.border,
            },
          ]}
        >
          <Ionicons
            name="speedometer-outline"
            size={20}
            color="#a3e635"
            style={styles.metricIcon}
          />
          <Text style={[styles.metricTitle, { color: colors.textSecondary }]}>Wind</Text>
          <Text style={[styles.metricValue, { color: colors.textPrimary }]}>
            {formatWindSpeed(current.windSpeed)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 20,
  },
  cityName: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  mainInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  weatherIcon: {
    marginRight: 16,
  },
  temperatureWrapper: {
    alignItems: 'flex-start',
  },
  temperature: {
    fontSize: 48,
    fontWeight: '800',
    lineHeight: 52,
  },
  conditionLabel: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 2,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 16,
    gap: 10,
  },
  metricCard: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  metricIcon: {
    marginBottom: 4,
  },
  metricTitle: {
    fontSize: 12,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 15,
    fontWeight: '700',
  },
});
