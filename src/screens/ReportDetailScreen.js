import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../components/ScreenHeader';
import Button from '../components/Button';
import { colors, radius, spacing, shadow } from '../theme/theme';

// 리포트 제목: "0000년 00월 00일 00:00 마실 리포트" 형식
function formatReportTitle(date, time) {
  if (!date) return '마실 리포트';
  const [y, m, d] = date.split('-');
  return `${y}년 ${m}월 ${d}일${time ? ` ${time}` : ''} 마실 리포트`;
}

function Row({ icon, label, value }) {
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

export default function ReportDetailScreen({ route }) {
  const { report } = route.params;
  const title = formatReportTitle(report.date, report.time);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title={title} />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.mapPlaceholder, shadow.card]}>
          <Ionicons name="map-outline" size={36} color={colors.tealMint} />
          <Text style={styles.mapText}>경로 지도 미리보기</Text>
        </View>

        <View style={[styles.infoCard, shadow.card]}>
          <Row icon="calendar-outline" label="날짜" value={report.date} />
          <Row icon="time-outline" label="시간" value={report.time} />
          <Row icon="location-outline" label="위치" value={report.location} />
          <Row
            icon="navigate-outline"
            label="이동 거리"
            value={report.distanceMeters != null ? `${report.distanceMeters} m` : report.distance}
          />
          <Row icon="flame-outline" label="소모 칼로리" value={`${report.calories} kcal`} />
          <Row icon="time-outline" label="소요 시간" value={report.duration != null ? `${report.duration}분` : '-'} />
          {!!report.elevation && (
            <Row
              icon="trending-up-outline"
              label="오르막/평지/내리막 비율"
              value={`${report.elevation.uphill}% / ${report.elevation.flat}% / ${report.elevation.downhill}%`}
            />
          )}
          {!!report.maxSlope && <Row icon="analytics-outline" label="오늘 최대 경사도" value={report.maxSlope} />}
          {report.familiarityRate != null && (
            <Row icon="finger-print-outline" label="익숙한 구간 인식률" value={`${report.familiarityRate}%`} />
          )}
          {!!report.memo && <Row icon="document-text-outline" label="메모" value={report.memo} />}
        </View>

        <Button label="리포트 공유하기" variant="outline" style={{ marginTop: spacing.lg }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  mapPlaceholder: {
    height: 180,
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
