import React from 'react';
import { RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useWeather } from '@/hooks/useWeather';
import { useFavorites } from '@/store/useFavorites';
import { useSettings } from '@/store/useSettings';
import { useThemeColors } from '@/hooks/useThemeColors';
import { CurrentWeatherView } from '@/components/weather/CurrentWeatherView';
import { DailyForecastList } from '@/components/weather/DailyForecastList';
import { WeatherSkeleton } from '@/components/weather/WeatherSkeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { OfflineBanner } from '@/components/ui/OfflineBanner';
import { BackButton } from '@/components/ui/BackButton';
import { HeaderControls } from '@/components/ui/HeaderControls';

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

  const { temperatureUnit } = useSettings();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { colors } = useThemeColors();

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

  const isOfflineData = isError && Boolean(weather);

  return (
    <>
      <Stack.Screen
        options={{
          title: cityName,
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.textPrimary,
          headerLeft: () => <BackButton />,
          headerRight: () => (
            <View style={styles.headerRightContainer}>
              <HeaderControls />
              <TouchableOpacity
                onPress={handleToggleFavorite}
                style={[
                  styles.favButton,
                  {
                    backgroundColor: colors.card,
                    borderColor: isFav ? colors.danger : colors.border,
                  },
                ]}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={isFav ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Ionicons
                  name={isFav ? 'heart' : 'heart-outline'}
                  size={19}
                  color={isFav ? colors.danger : colors.textMuted}
                />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.accent}
            colors={[colors.accent]}
          />
        }
      >
        {isLoading && !weather && <WeatherSkeleton />}

        {isError && !weather && (
          <ErrorState
            title="Failed to Load Forecast"
            message={
              error?.message ||
              'Unable to fetch weather data. Please check your internet connection and try again.'
            }
            onRetry={() => refetch()}
            isRetrying={isRefetching}
          />
        )}

        {weather && (
          <>
            {isOfflineData && (
              <OfflineBanner lastUpdated={weather.lastUpdated} onRefresh={() => refetch()} />
            )}
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
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  favButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
