import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, shadow } from '../theme/theme';

// 스펙: 낙상위험감지 / 급정지감지 / 장시간미사용 / 시스템알림
export const notificationMeta = {
  fall: { label: '낙상 위험 감지', icon: 'warning', color: colors.alertRed },
  suddenStop: { label: '급정지 감지', icon: 'flash', color: colors.slow },
  idle: { label: '장시간 미사용', icon: 'time-outline', color: colors.textSecondary },
  system: { label: '시스템 알림', icon: 'information-circle', color: colors.teal },
};

export default function NotificationCard({ item, onPress, featured }) {
  const meta = notificationMeta[item.type] || notificationMeta.system;
  const isUnread = !item.read;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        shadow.card,
        featured && { backgroundColor: meta.color },
        pressed && (featured ? { opacity: 0.88 } : styles.cardPressed),
      ]}
      onPress={onPress}
    >
      <View
        style={[
          styles.iconWrap,
          { backgroundColor: featured ? 'rgba(255,255,255,0.2)' : meta.color + '1A' },
        ]}
      >
        <Ionicons name={meta.icon} size={20} color={featured ? colors.white : meta.color} />
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, featured && { color: colors.white }]} numberOfLines={1}>
            {item.title || meta.label}
          </Text>
          {isUnread && !featured && <View style={styles.dot} />}
        </View>
        <Text style={[styles.sub, featured && { color: 'rgba(255,255,255,0.85)' }]} numberOfLines={1}>
          {item.location || item.body || ''}
        </Text>
        <Text style={[styles.date, featured && { color: 'rgba(255,255,255,0.7)' }]}>
          {item.date}{item.time ? ` ${item.time}` : ''}
        </Text>
      </View>
      <View style={styles.viewBtn}>
        <Text style={[styles.viewText, featured && { color: colors.white }]}>화면 보기</Text>
        <Ionicons name="chevron-forward" size={14} color={featured ? colors.white : colors.textMuted} />
      </View>
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
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  title: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.alertRed, marginLeft: 6 },
  sub: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  date: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  viewBtn: { flexDirection: 'row', alignItems: 'center', marginLeft: spacing.sm },
  viewText: { fontSize: 12, color: colors.textMuted, marginRight: 2, fontWeight: '600' },
});
