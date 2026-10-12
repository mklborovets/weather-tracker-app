import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FavoriteCity } from '@/types/favorites';
import { useWeather } from '@/hooks/useWeather';
import { useSettings } from '@/store/useSettings';
import { useThemeColors } from '@/hooks/useThemeColors';
import { getWeatherInfo } from '@/utils/weatherCodes';
import { formatTemperature } from '@/utils/formatters';

export interface FavoriteCityCardProps {
  city: FavoriteCity;
  onPress: (city: FavoriteCity) => void;
  onRemove: (id: number | string) => void;
}

export function FavoriteCityCard({ city, onPress, onRemove }: FavoriteCityCardProps) {
  const { temperatureUnit } = useSettings();
  const { colors } = useThemeColors();

  const {
    data: weather,
    isLoading,
    isError,
  } = useWeather({
    latitude: city.latitude,
    longitude: city.longitude,
    cityName: city.name,
    cityId: city.id,
  });

  const condition = weather ? getWeatherInfo(weather.current.weatherCode) : null;
  const locationSubtitle = [city.admin1, city.country].filter(Boolean).join(', ');

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={() => onPress(city)}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Weather for ${city.name}`}
    >
      <View style={styles.leftContainer}>
        <Text style={[styles.cityName, { color: colors.textPrimary }]} numberOfLines={1}>
          {city.name}
        </Text>
        {locationSubtitle ? (
          <Text
            style={[styles.locationSubtitle, { color: colors.textSecondary }]}
            numberOfLines={1}
          >
            {locationSubtitle}
          </Text>
        ) : null}
        {condition ? (
          <Text style={[styles.conditionText, { color: colors.accent }]} numberOfLines={1}>
            {condition.label}
          </Text>
        ) : null}
      </View>

      <View style={styles.rightContainer}>
        <View style={styles.weatherInfo}>
          {isLoading && (
            <ActivityIndicator size="small" color={colors.accent} style={styles.loader} />
          )}

          {isError && !weather && (
            <Ionicons name="cloud-offline-outline" size={24} color={colors.textMuted} />
          )}

          {weather && condition && (
            <View style={styles.weatherData}>
              <Ionicons name={condition.iconName} size={26} color={condition.iconColor} />
              <Text style={[styles.temperature, { color: colors.textPrimary }]}>
                {formatTemperature(weather.current.temperature, temperatureUnit)}
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.removeButton,
            {
              backgroundColor: colors.cardSecondary,
              borderColor: colors.border,
            },
          ]}
          onPress={() => onRemove(city.id)}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityLabel={`Remove ${city.name} from favorites`}
        >
          <Ionicons name="trash-outline" size={18} color={colors.textMuted} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftContainer: {
    flex: 1,
    marginRight: 12,
  },
  cityName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  locationSubtitle: {
    fontSize: 13,
    marginBottom: 4,
  },
  conditionText: {
    fontSize: 13,
    fontWeight: '500',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  weatherInfo: {
    alignItems: 'flex-end',
    minWidth: 70,
  },
  weatherData: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  temperature: {
    fontSize: 20,
    fontWeight: '700',
  },
  loader: {
    paddingVertical: 4,
  },
  removeButton: {
    padding: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
});
