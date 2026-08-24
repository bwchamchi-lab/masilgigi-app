import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, shadow } from '../theme/theme';

const speedMeta = {
  fast: { label: '빠른 걸음', color: colors.fast, icon: 'flash' },
  normal: { label: '보통 걸음', color: colors.normal, icon: 'walk' },
  slow: { label: '느린 걸음', color: colors.slow, icon: 'hourglass-outline' },
};

export default function WalkCard({ item, onPress, onDownload }) {
  const meta = speedMeta[item.speed] || speedMeta.normal;
  return (
    <Pressable
      style={({ pressed }) => [styles.card, shadow.card, pressed && styles.cardPressed]}
      onPress={onPress}
    >
      <View style={[styles.iconWrap, { backgroundColor: meta.color + '1A' }]}>
        <Ionicons name={meta.icon} size={20} color={meta.color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.title} numberOfLines={1}>
          {item.duration != null ? `${meta.label}으로 ${item.duration}분 마실` : `${item.location || '마실'} 리포트`}
        </Text>
        <Text style={styles.sub} numberOfLines={1}>{item.location}</Text>
        <Text style={styles.date}>{item.date}{item.time ? ` ${item.time}` : ''}</Text>
      </View>
      <Pressable
        hitSlop={10}
        onPress={onDownload}
        style={({ pressed }) => [styles.downloadBtn, pressed && { opacity: 0.5 }]}
      >
        <Ionicons name="download-outline" size={18} color={colors.textMuted} />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  cardPressed: { backgroundColor: colors.pressedTint },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  title: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  sub: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  date: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  downloadBtn: { padding: 4, marginLeft: spacing.sm },
});
