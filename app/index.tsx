import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { CitySearch } from '@/components/weather/CitySearch';
import { FavoriteCityCard } from '@/components/weather/FavoriteCityCard';
import { HeaderControls } from '@/components/ui/HeaderControls';
import { useFavorites } from '@/store/useFavorites';
import { useLocation } from '@/hooks/useLocation';
import { useThemeColors } from '@/hooks/useThemeColors';
import { queryClient } from '@/api/queryClient';
import { FavoriteCity } from '@/types/favorites';

export default function HomeScreen() {
  const router = useRouter();
  const { favorites, removeFavorite, hasHydrated } = useFavorites();
  const { getCurrentLocation, isLocating, errorMsg } = useLocation();
  const { colors } = useThemeColors();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleCityPress = (city: FavoriteCity) => {
    router.push({
      pathname: '/city/[id]',
      params: {
        id: String(city.id),
        name: city.name,
        latitude: String(city.latitude),
        longitude: String(city.longitude),
        country: city.country ?? '',
        admin1: city.admin1 ?? '',
      },
    });
  };

  const handleLocationPress = async () => {
    const loc = await getCurrentLocation();
    if (loc) {
      router.push({
        pathname: '/city/[id]',
        params: {
          id: `loc_${loc.latitude.toFixed(3)}_${loc.longitude.toFixed(3)}`,
          name: loc.cityName,
          latitude: String(loc.latitude),
          longitude: String(loc.longitude),
          country: loc.country ?? '',
          admin1: loc.admin1 ?? '',
        },
      });
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await queryClient.invalidateQueries({ queryKey: ['weather'] });
    } finally {
      setIsRefreshing(false);
    }
  };

  const content = (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.searchSection}>
        <View style={styles.searchRow}>
          <View style={styles.searchInputContainer}>
            <CitySearch placeholder="Search city (e.g. Kyiv, London)..." />
          </View>
          <TouchableOpacity
            style={[
              styles.locationButton,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
            onPress={handleLocationPress}
            disabled={isLocating}
            activeOpacity={0.7}
            accessibilityLabel="My current location"
          >
            {isLocating ? (
              <ActivityIndicator size="small" color={colors.accent} />
            ) : (
              <Ionicons name="navigate-outline" size={20} color={colors.accent} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {errorMsg ? (
        <View
          style={[styles.errorBanner, { backgroundColor: colors.card, borderColor: colors.danger }]}
        >
          <Ionicons name="warning-outline" size={16} color={colors.danger} />
          <Text style={[styles.errorBannerText, { color: colors.danger }]}>{errorMsg}</Text>
        </View>
      ) : null}

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Saved Cities</Text>
        {favorites.length > 0 && (
          <View style={[styles.badge, { backgroundColor: colors.card }]}>
            <Text style={[styles.badgeText, { color: colors.accent }]}>{favorites.length}</Text>
          </View>
        )}
      </View>

      {!hasHydrated ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.accent} />
        </View>
      ) : favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View
            style={[
              styles.emptyIconCircle,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Ionicons name="heart-outline" size={32} color={colors.textMuted} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
            No saved cities yet
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            Search for a city above or tap the location button to view weather forecasts and save
            your favorite places.
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <FavoriteCityCard city={item} onPress={handleCityPress} onRemove={removeFavorite} />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={colors.accent}
              colors={[colors.accent]}
            />
          }
        />
      )}
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Weather Tracker',
          headerRight: () => <HeaderControls />,
        }}
      />
      {Platform.OS === 'web' ? (
        content
      ) : (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          {content}
        </TouchableWithoutFeedback>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  searchSection: {
    marginBottom: 20,
    zIndex: 20,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  searchInputContainer: {
    flex: 1,
  },
  locationButton: {
    width: 50,
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 60,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  listContent: {
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  errorBannerText: {
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
});
