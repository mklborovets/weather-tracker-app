import React, { useEffect, useState } from 'react';
import { Animated, DimensionValue, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

export interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

export function Skeleton({ width = '100%', height = 20, borderRadius = 8, style }: SkeletonProps) {
  const { colors } = useThemeColors();
  const [opacityAnim] = useState(() => new Animated.Value(0.35));

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0.85,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.35,
          duration: 750,
          useNativeDriver: true,
        }),
      ]),
    );

    pulse.start();

    return () => {
      pulse.stop();
    };
  }, [opacityAnim]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          opacity: opacityAnim,
          backgroundColor: colors.border,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  skeleton: {},
});
