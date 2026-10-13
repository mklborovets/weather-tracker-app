import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSettings } from '@/store/useSettings';
import { useThemeColors } from '@/hooks/useThemeColors';

export function HeaderControls() {
  const { temperatureUnit, toggleTemperatureUnit } = useSettings();
  const { colors, isDark, toggleTheme } = useThemeColors();

  return (
    <View
      style={[
        styles.capsule,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <TouchableOpacity
        onPress={toggleTheme}
        hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
        style={styles.itemButton}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      >
        <Ionicons
          name={isDark ? 'sunny-outline' : 'moon-outline'}
          size={18}
          color={colors.accent}
        />
      </TouchableOpacity>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <TouchableOpacity
        onPress={toggleTemperatureUnit}
        hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
        style={styles.itemButton}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`Temperature unit: ${temperatureUnit === 'celsius' ? 'Celsius' : 'Fahrenheit'}. Tap to switch.`}
      >
        <Text style={[styles.unitText, { color: colors.textPrimary }]}>
          {temperatureUnit === 'celsius' ? '°C' : '°F'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  capsule: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    paddingHorizontal: 4,
  },
  itemButton: {
    minWidth: 32,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    borderRadius: 15,
  },
  divider: {
    width: 1,
    height: 18,
    marginHorizontal: 2,
  },
  unitText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
