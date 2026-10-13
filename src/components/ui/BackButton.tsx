import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useThemeColors } from '@/hooks/useThemeColors';

interface BackButtonProps {
  onPress?: () => void;
}

export function BackButton({ onPress }: BackButtonProps) {
  const router = useRouter();
  const { colors } = useThemeColors();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        styles.button,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel="Go back"
    >
      <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
