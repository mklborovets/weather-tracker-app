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
  const showClear = Boolean(value && value.length > 0 && onClear);

  return (
    <View style={[styles.container, containerStyle]}>
      <Ionicons name="search" size={18} color="#94a3b8" style={styles.searchIcon} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#64748b"
        style={[styles.input, style]}
        autoCorrect={false}
        autoCapitalize="none"
        {...props}
      />
      {isLoading && <ActivityIndicator size="small" color="#38bdf8" style={styles.indicator} />}
      {showClear && !isLoading && (
        <TouchableOpacity
          onPress={onClear}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.clearButton}
          accessibilityLabel="Clear text"
        >
          <Ionicons name="close" size={14} color="#94a3b8" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 14,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#f8fafc',
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
    backgroundColor: '#334155',
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
