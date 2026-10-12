import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { WeatherData } from '@/types/weather';
import { TemperatureUnit } from '@/store/useSettings';
import { getWeatherInfo } from '@/utils/weatherCodes';
import { formatTemperature, formatWindSpeed } from '@/utils/formatters';

export interface CurrentWeatherViewProps {
  weather: WeatherData;
  unit: TemperatureUnit;
}

export function CurrentWeatherView({ weather, unit }: CurrentWeatherViewProps) {
  const { current, cityName } = weather;
  const condition = getWeatherInfo(current.weatherCode);

  return (
    <View style={styles.container}>
      {cityName ? <Text style={styles.cityName}>{cityName}</Text> : null}

      <View style={styles.mainInfoRow}>
        <Ionicons
          name={condition.iconName}
          size={58}
          color={condition.iconColor}
          style={styles.weatherIcon}
        />
        <View style={styles.temperatureWrapper}>
          <Text style={styles.temperature}>{formatTemperature(current.temperature, unit)}</Text>
          <Text style={styles.conditionLabel}>{condition.label}</Text>
        </View>
      </View>

      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <Ionicons
            name="thermometer-outline"
            size={20}
            color="#f59e0b"
            style={styles.metricIcon}
          />
          <Text style={styles.metricTitle}>Feels like</Text>
          <Text style={styles.metricValue}>
            {formatTemperature(current.apparentTemperature, unit)}
          </Text>
        </View>

        <View style={styles.metricCard}>
          <Ionicons name="water-outline" size={20} color="#38bdf8" style={styles.metricIcon} />
          <Text style={styles.metricTitle}>Humidity</Text>
          <Text style={styles.metricValue}>{current.humidity}%</Text>
        </View>

        <View style={styles.metricCard}>
          <Ionicons
            name="speedometer-outline"
            size={20}
            color="#a3e635"
            style={styles.metricIcon}
          />
          <Text style={styles.metricTitle}>Wind</Text>
          <Text style={styles.metricValue}>{formatWindSpeed(current.windSpeed)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
    marginBottom: 20,
  },
  cityName: {
    fontSize: 26,
    fontWeight: '700',
    color: '#f8fafc',
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
    color: '#f8fafc',
    lineHeight: 52,
  },
  conditionLabel: {
    fontSize: 18,
    color: '#94a3b8',
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
    backgroundColor: '#0f172a',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  metricIcon: {
    marginBottom: 4,
  },
  metricTitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#f8fafc',
  },
});
