import AsyncStorage from '@react-native-async-storage/async-storage';
import { safeAsyncStorage } from '@/store/storage';

const mockedStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('safeAsyncStorage', () => {
  afterEach(async () => {
    jest.clearAllMocks();
    await AsyncStorage.clear();
  });

  it('writes to and reads from AsyncStorage', async () => {
    await safeAsyncStorage.setItem('key', 'value');
    expect(mockedStorage.setItem).toHaveBeenCalledWith('key', 'value');
    expect(await safeAsyncStorage.getItem('key')).toBe('value');
  });

  it('removes items', async () => {
    await safeAsyncStorage.setItem('key', 'value');
    await safeAsyncStorage.removeItem('key');
    expect(await safeAsyncStorage.getItem('key')).toBeNull();
  });

  it('falls back to memory when native setItem fails', async () => {
    mockedStorage.setItem.mockRejectedValueOnce(new Error('Native module is null'));
    mockedStorage.getItem.mockRejectedValueOnce(new Error('Native module is null'));

    await expect(safeAsyncStorage.setItem('fallback', 'saved')).resolves.toBeUndefined();
    expect(await safeAsyncStorage.getItem('fallback')).toBe('saved');
  });

  it('does not throw when native removeItem fails', async () => {
    mockedStorage.removeItem.mockRejectedValueOnce(new Error('Native module is null'));
    await expect(safeAsyncStorage.removeItem('missing')).resolves.toBeUndefined();
  });

  it('returns null when key is missing in both storages', async () => {
    expect(await safeAsyncStorage.getItem('unknown')).toBeNull();
  });
});
