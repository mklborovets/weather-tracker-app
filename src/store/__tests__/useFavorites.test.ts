import { useFavorites } from '@/store/useFavorites';
import { FavoriteCity } from '@/types/favorites';

describe('useFavorites store', () => {
  const sampleCity1: FavoriteCity = {
    id: 1,
    name: 'Kyiv',
    latitude: 50.45,
    longitude: 30.52,
    country: 'Ukraine',
  };

  const sampleCity2: FavoriteCity = {
    id: 2,
    name: 'London',
    latitude: 51.5,
    longitude: -0.12,
    country: 'United Kingdom',
  };

  beforeEach(() => {
    useFavorites.setState({ favorites: [] });
  });

  it('starts with an empty favorites list', () => {
    expect(useFavorites.getState().favorites).toEqual([]);
  });

  it('adds a city to favorites', () => {
    useFavorites.getState().addFavorite(sampleCity1);
    expect(useFavorites.getState().favorites).toHaveLength(1);
    expect(useFavorites.getState().favorites[0].name).toBe('Kyiv');
  });

  it('does not add duplicate cities with the same id', () => {
    useFavorites.getState().addFavorite(sampleCity1);
    useFavorites.getState().addFavorite(sampleCity1);
    expect(useFavorites.getState().favorites).toHaveLength(1);
  });

  it('removes a city by id', () => {
    useFavorites.getState().addFavorite(sampleCity1);
    useFavorites.getState().addFavorite(sampleCity2);
    expect(useFavorites.getState().favorites).toHaveLength(2);

    useFavorites.getState().removeFavorite(1);
    expect(useFavorites.getState().favorites).toHaveLength(1);
    expect(useFavorites.getState().favorites[0].name).toBe('London');
  });

  it('correctly checks isFavorite status', () => {
    expect(useFavorites.getState().isFavorite(1)).toBe(false);

    useFavorites.getState().addFavorite(sampleCity1);
    expect(useFavorites.getState().isFavorite(1)).toBe(true);
    expect(useFavorites.getState().isFavorite('1')).toBe(true);
    expect(useFavorites.getState().isFavorite(2)).toBe(false);
  });
});
