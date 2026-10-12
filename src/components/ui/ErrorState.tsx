import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useThemeColors } from '@/hooks/useThemeColors';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}

export function ErrorState({
  title = 'Unable to Load Weather',
  message = 'Please check your internet connection and try again.',
  onRetry,
  isRetrying = false,
}: ErrorStateProps) {
  const { colors } = useThemeColors();

  return (
    <View style={styles.container}>
      <View
        style={[styles.iconCircle, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
        <Ionicons name="alert-circle-outline" size={44} color={colors.danger} />
      </View>
      <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
      <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>

      {onRetry && (
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: colors.accent }]}
          onPress={onRetry}
          disabled={isRetrying}
          activeOpacity={0.8}
          accessibilityLabel="Retry loading"
        >
          {isRetrying ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <View style={styles.buttonContent}>
              <Ionicons name="refresh" size={16} color="#ffffff" />
              <Text style={styles.buttonText}>Try Again</Text>
            </View>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 60,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
    marginBottom: 24,
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    minWidth: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});
