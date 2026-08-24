import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, shadow } from '../theme/theme';
import { userProfile } from '../data/mockData';
import LogoutModal from '../components/LogoutModal';
import { useAuth } from '../context/AuthContext';

const menuItems = [
  { key: 'me', label: '내 정보', icon: 'person-circle-outline' },
  { key: 'edit', label: '이용자 정보 수정', icon: 'create-outline' },
  { key: 'howto', label: '이용방법', icon: 'help-circle-outline' },
  { key: 'contact', label: '문의', icon: 'chatbubble-ellipses-outline' },
  { key: 'logout', label: '로그아웃', icon: 'log-out-outline' },
];

function StatChip({ value, label, color }) {
  return (
    <View style={[styles.chip, shadow.card]}>
      <Text style={[styles.chipValue, { color }]}>{value}</Text>
      <Text style={styles.chipLabel}>{label}</Text>
    </View>
  );
}

export default function MyPageScreen({ navigation }) {
  const [showLogout, setShowLogout] = useState(false);
  const { logout, userName } = useAuth();
  const displayName = userName || userProfile.name;

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
    if (key === 'logout') {
      setShowLogout(true);
      return;
    }
    Alert.alert('준비 중', '곧 만나볼 수 있어요.');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={34} color={colors.white} />
          </View>
          <View style={{ marginLeft: spacing.md }}>
            <Text style={styles.name}>{displayName}</Text>
            <Text style={styles.roleTag}>이용자</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <StatChip value={`${userProfile.totalWalks}회`} label="총 보행 횟수" color={colors.teal} />
          <StatChip value={`${userProfile.totalDistanceKm}km`} label="총 이동 거리" color={colors.fast} />
          <StatChip value={`${userProfile.totalExerciseMinutes}분`} label="총 운동 시간" color={colors.slow} />
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
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { fontSize: 20, fontWeight: '800', color: colors.textPrimary },
  roleTag: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  statsRow: { flexDirection: 'row', marginBottom: spacing.lg },
  chip: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  chipValue: { fontSize: 16, fontWeight: '800' },
  chipLabel: { fontSize: 10, color: colors.textSecondary, marginTop: 4, textAlign: 'center' },
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
