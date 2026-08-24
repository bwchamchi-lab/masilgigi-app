import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import NotificationCard from '../components/NotificationCard';
import { colors, spacing } from '../theme/theme';
import { notifications as mockNotifications } from '../data/mockData';
import { getNotifications, markNotificationRead } from '../services/notificationsService';
import { useAuth } from '../context/AuthContext';

export default function AlertListScreen({ navigation }) {
  const [items, setItems] = useState(mockNotifications);
  const [loading, setLoading] = useState(false);
  const { uid } = useAuth();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getNotifications(uid)
      .then((data) => !cancelled && setItems(data))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [uid]);

  const unreadCount = items.filter((a) => !a.read).length;

  const handlePress = async (item) => {
    if (!item.read) {
      setItems((prev) => prev.map((n) => (n.id === item.id ? { ...n, read: true } : n)));
      markNotificationRead(item.id);
    }
    navigation.navigate('AlertDetail', { alert: item });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>긴급 알림</Text>
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        )}
      </View>
      <Text style={styles.headerSub}>낙상·급정지·장시간 미사용을 감지하면 즉시 알려드려요.</Text>

      {loading ? (
        <ActivityIndicator color={colors.teal} style={{ marginTop: spacing.xl }} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item, index }) => (
            <NotificationCard
              item={item}
              featured={index === 0 && !item.read && item.type === 'fall'}
              onPress={() => handlePress(item)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="shield-checkmark-outline" size={40} color={colors.textMuted} />
              <Text style={styles.emptyText}>알림이 없어요. 안심하세요!</Text>
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: colors.textPrimary },
  headerSub: { fontSize: 12, color: colors.textSecondary, paddingHorizontal: spacing.lg, marginTop: 4, marginBottom: spacing.md },
  badge: {
    marginLeft: spacing.sm,
    backgroundColor: colors.alertRed,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: colors.white, fontSize: 11, fontWeight: '700' },
  listContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  empty: { alignItems: 'center', marginTop: spacing.xxl },
  emptyText: { color: colors.textMuted, marginTop: spacing.sm, fontSize: 13 },
});
