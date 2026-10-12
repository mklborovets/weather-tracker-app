import React from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useWeather } from '@/hooks/useWeather';
import { useFavorites } from '@/store/useFavorites';
import { useSettings } from '@/store/useSettings';
import { CurrentWeatherView } from '@/components/weather/CurrentWeatherView';
import { DailyForecastList } from '@/components/weather/DailyForecastList';

export default function CityDetailsScreen() {
  const params = useLocalSearchParams<{
    id: string;
    name: string;
    latitude: string;
    longitude: string;
    country?: string;
    admin1?: string;
  }>();

  const cityId = params.id;
  const cityName = params.name || 'City Weather';
  const latitude = params.latitude ? parseFloat(params.latitude) : null;
  const longitude = params.longitude ? parseFloat(params.longitude) : null;
  const country = params.country;
  const admin1 = params.admin1;

  const { temperatureUnit, toggleTemperatureUnit } = useSettings();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  const isFav = isFavorite(cityId);

  const {
    data: weather,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useWeather({
    latitude,
    longitude,
    cityName,
    cityId,
  });

  const handleToggleFavorite = () => {
    if (isFav) {
      removeFavorite(cityId);
    } else if (latitude !== null && longitude !== null) {
      addFavorite({
        id: cityId,
        name: cityName,
        latitude,
        longitude,
        country,
        admin1,
      });
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: cityName,
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity
                onPress={toggleTemperatureUnit}
                style={styles.unitButton}
                activeOpacity={0.7}
                accessibilityLabel="Toggle temperature unit"
              >
                <Text style={styles.unitText}>{temperatureUnit === 'celsius' ? '°C' : '°F'}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleToggleFavorite}
                style={styles.favButton}
                activeOpacity={0.7}
                accessibilityLabel={isFav ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Ionicons
                  name={isFav ? 'heart' : 'heart-outline'}
                  size={22}
                  color={isFav ? '#f43f5e' : '#cbd5e1'}
                />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor="#38bdf8"
            colors={['#38bdf8']}
          />
        }
      >
        {isLoading && (
          <View style={styles.stateContainer}>
            <ActivityIndicator size="large" color="#38bdf8" />
            <Text style={styles.loadingText}>Loading weather forecast...</Text>
          </View>
        )}

        {isError && (
          <View style={styles.stateContainer}>
            <Ionicons
              name="alert-circle-outline"
              size={48}
              color="#f87171"
              style={styles.errorIcon}
            />
            <Text style={styles.errorTitle}>Failed to load forecast</Text>
            <Text style={styles.errorSubtitle}>
              {error?.message || 'Please check your connection and try again.'}
            </Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => refetch()}
              activeOpacity={0.8}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {weather && (
          <>
            <CurrentWeatherView weather={weather} unit={temperatureUnit} />
            <DailyForecastList days={weather.daily} unit={temperatureUnit} />
          </>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  unitButton: {
    backgroundColor: '#334155',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#475569',
  },
  unitText: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '700',
  },
  favButton: {
    padding: 4,
  },
  stateContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#94a3b8',
    fontSize: 16,
  },
  errorIcon: {
    marginBottom: 12,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 8,
  },
  errorSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    maxWidth: 280,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#38bdf8',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '700',
  },
});
