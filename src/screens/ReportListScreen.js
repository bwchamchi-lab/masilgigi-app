import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import InputField from '../components/InputField';
import WalkCard from '../components/WalkCard';
import { colors, radius, spacing, shadow } from '../theme/theme';
import { todaySummary, walkReports as mockWalkReports } from '../data/mockData';
import { getReports } from '../services/reportsService';
import { useAuth } from '../context/AuthContext';

export default function ReportListScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [reports, setReports] = useState(mockWalkReports);
  const [loading, setLoading] = useState(false);
  const { uid } = useAuth();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getReports(uid)
      .then((data) => !cancelled && setReports(data))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [uid]);

  const filtered = useMemo(() => {
    return reports.filter((r) => {
      const matchesQuery = query ? r.location?.includes(query) : true;
      return matchesQuery;
    });
  }, [reports, query]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>마실 리포트</Text>
        <Pressable
          onPress={() => navigation.navigate('UploadReport')}
          hitSlop={10}
          style={({ pressed }) => pressed && styles.pressedIcon}
        >
          <Ionicons name="add-circle" size={28} color={colors.teal} />
        </Pressable>
      </View>

      <View style={styles.searchWrap}>
        <InputField icon="search-outline" placeholder="마실 리포트 찾기..." value={query} onChangeText={setQuery} />
      </View>

      {/* 오늘의 통계: 총 보행 횟수 / 총 보행 거리 / 낙상 위험 횟수 */}
      <View style={[styles.summaryCard, shadow.card]}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{todaySummary.totalWalks}회</Text>
          <Text style={styles.summaryLabel}>총 보행 횟수</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{(todaySummary.totalDistanceMeters / 1000).toFixed(1)}km</Text>
          <Text style={styles.summaryLabel}>총 보행 거리</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryValue, todaySummary.fallRiskCount > 0 && { color: colors.alertRed }]}>
            {todaySummary.fallRiskCount}회
          </Text>
          <Text style={styles.summaryLabel}>낙상 위험 횟수</Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.teal} style={{ marginTop: spacing.xl }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <WalkCard item={item} onPress={() => navigation.navigate('ReportDetail', { report: item })} />
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="footsteps-outline" size={40} color={colors.textMuted} />
              <Text style={styles.emptyText}>해당하는 마실 리포트가 없어요.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: colors.textPrimary },
  searchWrap: { paddingHorizontal: spacing.lg, marginTop: spacing.md },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    paddingVertical: spacing.md,
  },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryDivider: { width: 1, backgroundColor: colors.border },
  summaryValue: { fontSize: 15, fontWeight: '800', color: colors.textPrimary },
  summaryLabel: { fontSize: 10, color: colors.textSecondary, marginTop: 4, textAlign: 'center' },
  listContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  empty: { alignItems: 'center', marginTop: spacing.xxl },
  emptyText: { color: colors.textMuted, marginTop: spacing.sm, fontSize: 13 },
});
