import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, shadow } from '../theme/theme';
import { guardianProfile } from '../data/mockData';
import LogoutModal from '../components/LogoutModal';
import { useAuth } from '../context/AuthContext';

// 스펙: 보호자는 실시간 상태 / 오늘의 보행기록 / 낙상알림수신 / 리포트조회 / 위치확인 / 긴급상황기록확인 가능
const menuItems = [
  { key: 'edit', label: '이용자 정보 수정', icon: 'create-outline' },
  { key: 'walking', label: '오늘의 보행 기록', icon: 'walk-outline' },
  { key: 'reports', label: '리포트 조회', icon: 'document-text-outline' },
  { key: 'location', label: '위치 확인', icon: 'location-outline' },
  { key: 'emergency', label: '긴급상황 기록', icon: 'alert-circle-outline' },
  { key: 'contact', label: '문의', icon: 'chatbubble-ellipses-outline' },
];

export default function GuardianMyPageScreen({ navigation }) {
  const [showLogout, setShowLogout] = useState(false);
  const { logout, userName } = useAuth();
  const displayName = userName || guardianProfile.name;
  const linked = guardianProfile.linkedUser;

  const handleLogout = () => {
    setShowLogout(false);
    logout();
    navigation.reset({ index: 0, routes: [{ name: 'Start' }] });
  };

  const handleMenuPress = (key) => {
    if (key === 'edit') {
      navigation.navigate('EditUserInfo');
      return;
    }
    Alert.alert('준비 중', '곧 만나볼 수 있어요.');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            <Ionicons name="shield-checkmark" size={30} color={colors.white} />
          </View>
          <View style={{ marginLeft: spacing.md }}>
            <Text style={styles.name}>{displayName}</Text>
            <Text style={styles.roleTag}>보호자</Text>
          </View>
        </View>

        <View style={[styles.linkedCard, shadow.card]}>
          <View style={styles.linkedHeader}>
            <Ionicons name="person-circle-outline" size={22} color={colors.teal} />
            <Text style={styles.linkedName}>{linked.name} 님의 현재 상태</Text>
            <Text style={styles.lastSeen}>{linked.lastSeen}</Text>
          </View>
          <View style={styles.linkedLocationRow}>
            <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.linkedLocationText}>{linked.lastLocation}</Text>
          </View>
          <View style={styles.linkedStatsRow}>
            <View style={styles.linkedStat}>
              <Ionicons name="heart" size={18} color={colors.alertRed} />
              <Text style={styles.linkedStatValue}>{linked.heartRate} bpm</Text>
              <Text style={styles.linkedStatLabel}>심박수</Text>
            </View>
            <View style={styles.linkedStat}>
              <Ionicons name="flame" size={18} color={colors.fast} />
              <Text style={styles.linkedStatValue}>{linked.caloriesToday} cal</Text>
              <Text style={styles.linkedStatLabel}>오늘 칼로리</Text>
            </View>
            <View style={styles.linkedStat}>
              <Ionicons name="warning" size={18} color={colors.slow} />
              <Text style={styles.linkedStatValue}>{linked.fallsToday}회</Text>
              <Text style={styles.linkedStatLabel}>낙상 감지</Text>
            </View>
          </View>
        </View>

        <View style={[styles.menuCard, shadow.card]}>
          {menuItems.map((item, idx) => (
            <Pressable
              key={item.key}
              onPress={() => handleMenuPress(item.key)}
              style={({ pressed }) => [
                styles.menuRow,
                idx !== menuItems.length - 1 && styles.menuDivider,
                pressed && styles.menuRowPressed,
              ]}
            >
              <View style={styles.menuLeft}>
                <Ionicons name={item.icon} size={19} color={colors.textSecondary} />
                <Text style={styles.menuLabel}>{item.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </Pressable>
          ))}
        </View>

        <View style={[styles.menuCard, shadow.card, { marginTop: spacing.md }]}>
          <Pressable
            onPress={() => setShowLogout(true)}
            style={({ pressed }) => [styles.menuRow, pressed && styles.menuRowPressed]}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="log-out-outline" size={19} color={colors.textSecondary} />
              <Text style={styles.menuLabel}>로그아웃</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </Pressable>
        </View>
      </ScrollView>

      <LogoutModal visible={showLogout} onConfirm={handleLogout} onCancel={() => setShowLogout(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.xxl },
  profileRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.tealDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { fontSize: 20, fontWeight: '800', color: colors.textPrimary },
  roleTag: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  linkedCard: { backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.lg },
  linkedHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  linkedName: { fontSize: 14, fontWeight: '700', color: colors.textPrimary, marginLeft: 6, flex: 1 },
  lastSeen: { fontSize: 11, color: colors.textMuted },
  linkedLocationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  linkedLocationText: { fontSize: 12, color: colors.textSecondary, marginLeft: 4 },
  linkedStatsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  linkedStat: { alignItems: 'center', flex: 1 },
  linkedStatValue: { fontSize: 14, fontWeight: '800', color: colors.textPrimary, marginTop: 4 },
  linkedStatLabel: { fontSize: 10, color: colors.textSecondary, marginTop: 2 },
  menuCard: { backgroundColor: colors.card, borderRadius: radius.lg, paddingHorizontal: spacing.md },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  menuRowPressed: { backgroundColor: colors.pressedTint },
  menuDivider: { borderBottomWidth: 1, borderBottomColor: colors.border },
  menuLeft: { flexDirection: 'row', alignItems: 'center' },
  menuLabel: { fontSize: 14, color: colors.textPrimary, marginLeft: spacing.sm, fontWeight: '500' },
});
