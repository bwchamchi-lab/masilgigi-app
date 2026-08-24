import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../components/ScreenHeader';
import Button from '../components/Button';
import { colors, radius, spacing, shadow } from '../theme/theme';
import { notificationMeta } from '../components/NotificationCard';

function Row({ icon, label, value }) {
  if (value == null) return null;
  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <Ionicons name={icon} size={18} color={colors.textMuted} />
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      <Text style={styles.rowValue} numberOfLines={2}>{value}</Text>
    </View>
  );
}

export default function AlertDetailScreen({ route }) {
  const { alert } = route.params;
  const meta = notificationMeta[alert.type] || notificationMeta.system;
  const isFall = alert.type === 'fall';
  const isSuddenStop = alert.type === 'suddenStop';
  const showMapAndContact = isFall || isSuddenStop;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title={alert.title || meta.label} />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.banner, shadow.card, { backgroundColor: meta.color }]}>
          <Ionicons name={meta.icon} size={28} color={colors.white} />
          <Text style={styles.bannerTitle}>{meta.label}</Text>
          <Text style={styles.bannerSub}>
            {isFall && '보호자에게 위치와 상황이 즉시 전달되었어요.'}
            {isSuddenStop && '보행보조기가 갑작스러운 멈춤을 감지했어요.'}
            {alert.type === 'idle' && '오랫동안 보행보조기 사용 기록이 없어요.'}
            {alert.type === 'system' && (alert.body || '시스템에서 보내온 알림입니다.')}
          </Text>
        </View>

        {showMapAndContact && (
          <View style={[styles.mapPlaceholder, shadow.card]}>
            <Ionicons name="map-outline" size={36} color={colors.tealMint} />
            <Text style={styles.mapText}>감지 위치 지도 미리보기</Text>
          </View>
        )}

        <View style={[styles.infoCard, shadow.card]}>
          <Row icon="calendar-outline" label="날짜" value={alert.date} />
          <Row icon="time-outline" label="시간" value={alert.time} />
          <Row icon="location-outline" label="위치" value={alert.location} />
          <Row icon="navigate-outline" label="이동 거리" value={alert.distanceMeters != null ? `${alert.distanceMeters} m` : null} />
          {!isFall && (
            <Row icon="flame-outline" label="소모 칼로리" value={alert.calories != null ? `${alert.calories} kcal` : null} />
          )}
        </View>

        {showMapAndContact && (
          <>
            <Button label="보호자에게 전화하기" style={{ marginTop: spacing.lg }} />
            <Button label="괜찮아요, 알림 지우기" variant="outline" style={{ marginTop: spacing.sm }} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  banner: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  bannerTitle: { color: colors.white, fontSize: 16, fontWeight: '800', marginTop: spacing.sm },
  bannerSub: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 4, textAlign: 'center' },
  mapPlaceholder: {
    height: 160,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  mapText: { color: colors.textMuted, fontSize: 12, marginTop: spacing.sm },
  infoCard: { backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.lg },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', width: 110 },
  rowLabel: { fontSize: 13, color: colors.textSecondary, marginLeft: spacing.sm },
  rowValue: { flex: 1, fontSize: 13, color: colors.textPrimary, fontWeight: '600', textAlign: 'right' },
});
