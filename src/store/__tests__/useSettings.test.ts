import { useSettings } from '@/store/useSettings';

describe('useSettings store', () => {
  beforeEach(() => {
    useSettings.setState({
      temperatureUnit: 'celsius',
      themeMode: 'system',
    });
  });

  it('initializes with default celsius and system theme', () => {
    const state = useSettings.getState();
    expect(state.temperatureUnit).toBe('celsius');
    expect(state.themeMode).toBe('system');
  });

  it('toggles temperature unit between celsius and fahrenheit', () => {
    expect(useSettings.getState().temperatureUnit).toBe('celsius');

    useSettings.getState().toggleTemperatureUnit();
    expect(useSettings.getState().temperatureUnit).toBe('fahrenheit');

    useSettings.getState().toggleTemperatureUnit();
    expect(useSettings.getState().temperatureUnit).toBe('celsius');
  });

  it('sets temperature unit explicitly', () => {
    useSettings.getState().setTemperatureUnit('fahrenheit');
    expect(useSettings.getState().temperatureUnit).toBe('fahrenheit');

    useSettings.getState().setTemperatureUnit('celsius');
    expect(useSettings.getState().temperatureUnit).toBe('celsius');
  });

  it('sets theme mode to light, dark, and system', () => {
    useSettings.getState().setThemeMode('dark');
    expect(useSettings.getState().themeMode).toBe('dark');

    useSettings.getState().setThemeMode('light');
    expect(useSettings.getState().themeMode).toBe('light');

    useSettings.getState().setThemeMode('system');
    expect(useSettings.getState().themeMode).toBe('system');
  });
});
