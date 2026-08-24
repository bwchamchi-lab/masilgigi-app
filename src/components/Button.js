import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, radius, spacing } from '../theme/theme';

/**
 * variant: 'primary' | 'outline' | 'ghost' | 'danger'
 */
export default function Button({ label, onPress, variant = 'primary', loading, disabled, style }) {
  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';
  const isDanger = variant === 'danger';
  const isGhost = variant === 'ghost';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        isPrimary && { backgroundColor: colors.teal },
        isOutline && { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.border },
        isDanger && { backgroundColor: colors.alertRed },
        isGhost && { backgroundColor: 'transparent' },
        // pressed 상태: 버튼 종류별로 살짝 어둡거나 톤이 변하는 배경색 적용
        pressed && isPrimary && { backgroundColor: colors.tealDark },
        pressed && isOutline && { backgroundColor: colors.pressedTint },
        pressed && isDanger && { backgroundColor: colors.alertRedDark },
        pressed && isGhost && { backgroundColor: colors.pressedTint },
        pressed && { opacity: 0.9 },
        (disabled || loading) && { opacity: 0.5 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isOutline || isGhost ? colors.teal : colors.white} />
      ) : (
        <Text
          style={[
            styles.label,
            (isOutline || isGhost) && { color: colors.textPrimary },
            (isPrimary || isDanger) && { color: colors.white },
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
  },
});
