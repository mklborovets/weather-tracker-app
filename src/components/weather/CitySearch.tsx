import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Input } from '@/components/ui/Input';
import { useDebounce } from '@/hooks/useDebounce';
import { useCitySearch } from '@/hooks/useCitySearch';
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
        <View style={styles.feedbackContainer}>
          <Text style={styles.errorText}>Unable to search cities. Please check your network.</Text>
        </View>
      )}

      {showEmptyState && (
        <View style={styles.feedbackContainer}>
          <Text style={styles.emptyText}>No cities found for &quot;{debouncedQuery}&quot;</Text>
        </View>
      )}

      {isSearching && results && results.length > 0 && (
        <View style={styles.resultsWrapper}>
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
                  <Text style={styles.cityName}>{item.name}</Text>
                  <Text style={styles.cityDetails}>
                    {[item.admin1, item.country].filter(Boolean).join(', ')}
                  </Text>
                </View>
                <Text style={styles.arrowIcon}>›</Text>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
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
    backgroundColor: '#1e293b',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  errorText: {
    color: '#f87171',
    fontSize: 14,
    textAlign: 'center',
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 14,
    textAlign: 'center',
  },
  resultsWrapper: {
    marginTop: 8,
    backgroundColor: '#1e293b',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
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
    color: '#f8fafc',
    marginBottom: 2,
  },
  cityDetails: {
    fontSize: 13,
    color: '#94a3b8',
  },
  arrowIcon: {
    fontSize: 20,
    color: '#64748b',
  },
  separator: {
    height: 1,
    backgroundColor: '#334155',
  },
});
