import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Input } from '@/components/ui/Input';
import { useDebounce } from '@/hooks/useDebounce';
import { useCitySearch } from '@/hooks/useCitySearch';
import { useThemeColors } from '@/hooks/useThemeColors';
import { GeocodingResult } from '@/types/geocoding';

export interface CitySearchProps {
  onSelectCity?: (city: GeocodingResult) => void;
  placeholder?: string;
}

export function CitySearch({
  onSelectCity,
  placeholder = 'Search for a city...',
}: CitySearchProps) {
  const router = useRouter();
  const { colors } = useThemeColors();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 400);

  const { data: results, isLoading, isError } = useCitySearch(debouncedQuery);

  const handleCityPress = (city: GeocodingResult) => {
    setQuery('');
    if (onSelectCity) {
      onSelectCity(city);
    } else {
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
    }
  };

  const hasSearchText = query.trim().length > 0;
  const isSearching = debouncedQuery.trim().length >= 2;
  const showEmptyState = isSearching && !isLoading && !isError && results && results.length === 0;

  return (
    <View style={styles.container}>
      <Input
        value={query}
        onChangeText={setQuery}
        placeholder={placeholder}
        isLoading={isLoading && isSearching}
        onClear={() => setQuery('')}
      />

      {isError && hasSearchText && (
        <View
          style={[
            styles.feedbackContainer,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.errorText, { color: colors.danger }]}>
            Unable to search cities. Please check your network.
          </Text>
        </View>
      )}

      {showEmptyState && (
        <View
          style={[
            styles.feedbackContainer,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No cities found for &quot;{debouncedQuery}&quot;
          </Text>
        </View>
      )}

      {isSearching && results && results.length > 0 && (
        <View
          style={[
            styles.resultsWrapper,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <FlatList
            data={results}
            keyExtractor={(item) => String(item.id)}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultItem}
                onPress={() => handleCityPress(item)}
                activeOpacity={0.7}
              >
                <View style={styles.resultTextContainer}>
                  <Text style={[styles.cityName, { color: colors.textPrimary }]}>{item.name}</Text>
                  <Text style={[styles.cityDetails, { color: colors.textSecondary }]}>
                    {[item.admin1, item.country].filter(Boolean).join(', ')}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => (
              <View style={[styles.separator, { backgroundColor: colors.border }]} />
            )}
            style={styles.resultsList}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    zIndex: 10,
  },
  feedbackContainer: {
    marginTop: 8,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
  resultsWrapper: {
    marginTop: 8,
    borderRadius: 14,
    borderWidth: 1,
    maxHeight: 280,
    overflow: 'hidden',
  },
  resultsList: {
    width: '100%',
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  resultTextContainer: {
    flex: 1,
    marginRight: 8,
  },
  cityName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  cityDetails: {
    fontSize: 13,
  },
  separator: {
    height: 1,
  },
});
