import React from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme/theme';
import Button from './Button';

export default function LogoutModal({ visible, onConfirm, onCancel }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.iconCircle}>
            <Ionicons name="log-out-outline" size={30} color={colors.white} />
          </View>
          <Text style={styles.title}>로그아웃 하시겠습니까?</Text>
          <Text style={styles.caption}>다시 로그인하시려면 이메일과 비밀번호가 필요해요.</Text>
          <Button label="로그아웃" onPress={onConfirm} style={{ marginTop: spacing.lg, width: '100%' }} />
          <Button label="취소" variant="ghost" onPress={onCancel} style={{ marginTop: spacing.sm, width: '100%' }} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(11,61,56,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  sheet: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.tealDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: { fontSize: 17, fontWeight: '700', color: colors.textPrimary },
  caption: { fontSize: 13, color: colors.textSecondary, marginTop: 6, textAlign: 'center' },
});
