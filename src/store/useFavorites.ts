import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FavoriteCity } from '@/types/favorites';

interface FavoritesState {
  favorites: FavoriteCity[];
  addFavorite: (city: FavoriteCity) => void;
  removeFavorite: (id: number | string) => void;
  isFavorite: (id: number | string) => boolean;
}

export const useFavorites = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (city) => {
        const current = get().favorites;
        const exists = current.some((c) => String(c.id) === String(city.id));
        if (!exists) {
          set({ favorites: [city, ...current] });
        }
      },

      removeFavorite: (id) => {
        set({
          favorites: get().favorites.filter((c) => String(c.id) !== String(id)),
        });
      },

      isFavorite: (id) => {
        return get().favorites.some((c) => String(c.id) === String(id));
      },
    }),
    {
      name: 'weather-tracker-favorites',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
