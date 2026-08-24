import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing } from '../theme/theme';

export default function ScreenHeader({ title, rightIcon, onRightPress }) {
  const navigation = useNavigation();
  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={() => navigation.goBack()}
        hitSlop={10}
        style={({ pressed }) => [styles.iconBtn, pressed && styles.iconBtnPressed]}
      >
        <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
      </Pressable>
      <Text style={styles.title}>{title}</Text>
      {rightIcon ? (
        <Pressable
          onPress={onRightPress}
          hitSlop={10}
          style={({ pressed }) => [styles.iconBtn, pressed && styles.iconBtnPressed]}
        >
          <Ionicons name={rightIcon} size={22} color={colors.textPrimary} />
        </Pressable>
      ) : (
        <View style={{ width: 24 }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  title: { fontSize: 17, fontWeight: '700', color: colors.textPrimary },
  iconBtn: { borderRadius: 999, padding: 2 },
  iconBtnPressed: { opacity: 0.5, backgroundColor: colors.pressedTint },
});
