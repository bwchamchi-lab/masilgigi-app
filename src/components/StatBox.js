import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing, shadow } from '../theme/theme';

export default function StatBox({ count, label, color, active }) {
  return (
    <View
      style={[
        styles.box,
        shadow.card,
        active && { borderColor: color, borderWidth: 1.5 },
      ]}
    >
      <Text style={[styles.count, { color }]}>{count}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginHorizontal: spacing.xs / 2,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  count: { fontSize: 22, fontWeight: '800' },
  label: { fontSize: 12, color: colors.textSecondary, marginTop: 4 },
});
