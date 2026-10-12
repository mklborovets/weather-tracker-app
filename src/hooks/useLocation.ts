import { useState } from 'react';
import { Alert } from 'react-native';
import * as Location from 'expo-location';

export interface LocationResult {
  latitude: number;
  longitude: number;
  cityName: string;
  country?: string;
  admin1?: string;
}

export function useLocation() {
  const [isLocating, setIsLocating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const getCurrentLocation = async (): Promise<LocationResult | null> => {
    setIsLocating(true);
    setErrorMsg(null);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        const message =
          'Location permission was denied. Please allow location access in your device settings to get weather for your current location.';
        setErrorMsg(message);
        Alert.alert('Location Permission Required', message, [{ text: 'OK' }]);
        return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = location.coords;

      let cityName = 'Current Location';
      let country: string | undefined;
      let admin1: string | undefined;

      try {
        const reverse = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        if (reverse && reverse.length > 0) {
          const first = reverse[0];
          cityName = first.city || first.subregion || first.region || 'Current Location';
          country = first.country ?? undefined;
          admin1 = first.region || first.subregion || undefined;
        }
      } catch {
        // Fallback to default name if reverse geocoding fails
      }

      return {
        latitude,
        longitude,
        cityName,
        country,
        admin1,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to retrieve current location.';
      setErrorMsg(message);
      Alert.alert('Location Error', message, [{ text: 'OK' }]);
      return null;
    } finally {
      setIsLocating(false);
    }
  };

  return {
    getCurrentLocation,
    isLocating,
    errorMsg,
  };
}
