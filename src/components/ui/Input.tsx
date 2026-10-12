import React from 'react';
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useThemeColors } from '@/hooks/useThemeColors';

export interface InputProps extends TextInputProps {
  onClear?: () => void;
  isLoading?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

export function Input({
  value,
  onChangeText,
  placeholder = 'Search...',
  onClear,
  isLoading = false,
  containerStyle,
  style,
  ...props
}: InputProps) {
  const { colors } = useThemeColors();
  const showClear = Boolean(value && value.length > 0 && onClear);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.card, borderColor: colors.border },
        containerStyle,
      ]}
    >
      <Ionicons name="search" size={18} color={colors.textMuted} style={styles.searchIcon} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        style={[styles.input, { color: colors.textPrimary }, style]}
        autoCorrect={false}
        autoCapitalize="none"
        {...props}
      />
      {isLoading && (
        <ActivityIndicator size="small" color={colors.accent} style={styles.indicator} />
      )}
      {showClear && !isLoading && (
        <TouchableOpacity
          onPress={onClear}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={[styles.clearButton, { backgroundColor: colors.cardSecondary }]}
          accessibilityLabel="Clear text"
        >
          <Ionicons name="close" size={14} color={colors.textMuted} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
  indicator: {
    marginLeft: 8,
  },
  clearButton: {
    padding: 3,
    marginLeft: 6,
    borderRadius: 12,
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
