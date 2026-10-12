import React, { useState } from 'react';
import {
  FlatList,
  Keyboard,
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
import { useFavorites } from '@/store/useFavorites';
import { useSettings } from '@/store/useSettings';
import { queryClient } from '@/api/queryClient';
import { FavoriteCity } from '@/types/favorites';

export default function HomeScreen() {
  const router = useRouter();
  const { favorites, removeFavorite } = useFavorites();
  const { temperatureUnit, toggleTemperatureUnit } = useSettings();
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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await queryClient.invalidateQueries({ queryKey: ['weather'] });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Weather Tracker',
          headerRight: () => (
            <TouchableOpacity
              onPress={toggleTemperatureUnit}
              style={styles.unitButton}
              activeOpacity={0.7}
              accessibilityLabel="Toggle temperature unit"
            >
              <Text style={styles.unitText}>{temperatureUnit === 'celsius' ? '°C' : '°F'}</Text>
            </TouchableOpacity>
          ),
        }}
      />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <View style={styles.searchSection}>
            <CitySearch placeholder="Search city (e.g. Kyiv, London)..." />
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Saved Cities</Text>
            {favorites.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{favorites.length}</Text>
              </View>
            )}
          </View>

          {favorites.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="heart-outline" size={32} color="#64748b" />
              </View>
              <Text style={styles.emptyTitle}>No saved cities yet</Text>
              <Text style={styles.emptySubtitle}>
                Search for a city above and tap the heart icon to add it to your favorites for quick
                access.
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
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={handleRefresh}
                  tintColor="#38bdf8"
                  colors={['#38bdf8']}
                />
              }
            />
          )}
        </View>
      </TouchableWithoutFeedback>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: '#0f172a',
  },
  unitButton: {
    backgroundColor: '#334155',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#475569',
  },
  unitText: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '700',
  },
  searchSection: {
    marginBottom: 20,
    zIndex: 20,
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
    color: '#f8fafc',
  },
  badge: {
    backgroundColor: '#334155',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#38bdf8',
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
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
  },
  listContent: {
    paddingBottom: 24,
  },
});
