import { useState } from 'react';
import { Alert, Platform } from 'react-native';
import * as Location from 'expo-location';
import { cleanCityName } from '@/utils/formatters';

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

  const getWebCoordinates = (): Promise<{ latitude: number; longitude: number }> => {
    return new Promise((resolve, reject) => {
      if (typeof navigator === 'undefined' || !navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: false,
          timeout: 15000,
          maximumAge: 300000,
        },
      );
    });
  };

  const getCurrentLocation = async (): Promise<LocationResult | null> => {
    setIsLocating(true);
    setErrorMsg(null);

    try {
      let coords: { latitude: number; longitude: number } | null = null;

      if (Platform.OS === 'web') {
        try {
          coords = await getWebCoordinates();
        } catch {
          const lastKnown = await Location.getLastKnownPositionAsync();
          if (lastKnown) {
            coords = {
              latitude: lastKnown.coords.latitude,
              longitude: lastKnown.coords.longitude,
            };
          } else {
            throw new Error(
              'Could not determine your location. Please check browser location permissions or search for your city manually.',
            );
          }
        }
      } else {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
          const message =
            'Location permission was denied. Please allow location access in your device settings to get weather for your current location.';
          setErrorMsg(message);
          Alert.alert('Location Permission Required', message, [{ text: 'OK' }]);
          return null;
        }

        try {
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          coords = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };
        } catch {
          const lastKnown = await Location.getLastKnownPositionAsync();
          if (lastKnown) {
            coords = {
              latitude: lastKnown.coords.latitude,
              longitude: lastKnown.coords.longitude,
            };
          } else {
            throw new Error('Unable to acquire GPS fix. Please try again or search manually.');
          }
        }
      }

      const { latitude, longitude } = coords;

      let cityName = 'Current Location';
      let country: string | undefined;
      let admin1: string | undefined;

      try {
        if (Platform.OS === 'web') {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
            { headers: { 'Accept-Language': 'en' } },
          );
          if (res.ok) {
            const data = (await res.json()) as {
              address?: {
                city?: string;
                town?: string;
                village?: string;
                municipality?: string;
                state?: string;
                country?: string;
              };
            };
            const addr = data.address;
            if (addr) {
              cityName = cleanCityName(
                addr.city || addr.town || addr.village || addr.municipality || 'Current Location',
              );
              country = addr.country;
              admin1 = addr.state;
            }
          }
        } else {
          const reverse = await Location.reverseGeocodeAsync({
            latitude,
            longitude,
          });

          if (reverse && reverse.length > 0) {
            const first = reverse[0];
            cityName = cleanCityName(
              first.city || first.subregion || first.region || 'Current Location',
            );
            country = first.country ?? undefined;
            admin1 = first.region || first.subregion || undefined;
          }
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
      let message = 'Failed to retrieve current location.';
      if (error instanceof Error) {
        if (
          error.message.includes('kCLErrorLocationUnknown') ||
          error.message.includes('LocationUnknown')
        ) {
          message =
            'Could not determine your location. Please ensure Location Services are enabled on your system/browser, or search for your city manually.';
        } else {
          message = error.message;
        }
      }
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
