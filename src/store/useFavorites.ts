import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { safeAsyncStorage } from './storage';
import { FavoriteCity } from '@/types/favorites';

interface FavoritesState {
  favorites: FavoriteCity[];
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  addFavorite: (city: FavoriteCity) => void;
  removeFavorite: (id: number | string) => void;
  isFavorite: (id: number | string) => boolean;
}

export const useFavorites = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      hasHydrated: false,

      setHasHydrated: (status) => {
        set({ hasHydrated: status });
      },

      addFavorite: (city) => {
        if (!city || city.id === undefined || city.id === null) return;
        const current = get().favorites;
        const exists = current.some((c) => String(c.id) === String(city.id));
        if (!exists) {
          set({ favorites: [city, ...current] });
        }
      },

      removeFavorite: (id) => {
        if (id === undefined || id === null) return;
        set({
          favorites: get().favorites.filter((c) => String(c.id) !== String(id)),
        });
      },

      isFavorite: (id) => {
        if (id === undefined || id === null) return false;
        return get().favorites.some((c) => String(c.id) === String(id));
      },
    }),
    {
      name: 'weather-tracker-favorites',
      storage: createJSONStorage(() => safeAsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      partialize: (state) => ({ favorites: state.favorites }) as unknown as FavoritesState,
    },
  ),
);
