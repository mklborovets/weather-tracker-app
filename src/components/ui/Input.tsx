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
  Text,
} from 'react-native';

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
      <Text style={styles.searchIcon}>🔍</Text>
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
          <Text style={styles.clearText}>✕</Text>
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
    fontSize: 16,
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
    padding: 4,
    marginLeft: 6,
    borderRadius: 12,
    backgroundColor: '#334155',
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 14,
  },
});
