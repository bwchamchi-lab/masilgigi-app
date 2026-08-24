import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';
import { colors, gradients, radius, spacing } from '../theme/theme';
import { useAuth } from '../context/AuthContext';

const options = [
  { key: 'user', label: '마실지기\n이용자', icon: 'walk-outline' },
  { key: 'guardian', label: '보호자', icon: 'shield-checkmark-outline' },
];

export default function UserTypeScreen({ navigation }) {
  const [selected, setSelected] = useState('user');
  const { selectRole } = useAuth();

  const handleContinue = () => {
    selectRole(selected);
    navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
  };

  return (
    <LinearGradient colors={gradients.brand} style={styles.flex}>
      <SafeAreaView style={styles.flex}>
        <View style={styles.content}>
          <Text style={styles.title}>누가 앱을 이용하나요?</Text>

          <View style={styles.row}>
            {options.map((opt) => {
              const active = selected === opt.key;
              return (
                <Pressable
                  key={opt.key}
                  onPress={() => setSelected(opt.key)}
                  style={({ pressed }) => [
                    styles.card,
                    active && styles.cardActive,
                    pressed && styles.cardPressed,
                  ]}
                >
                  <View style={[styles.avatar, active && { backgroundColor: colors.white }]}>
                    <Ionicons name={opt.icon} size={30} color={active ? colors.teal : colors.white} />
                  </View>
                  <Text style={[styles.cardLabel, active && { color: colors.tealDark, fontWeight: '800' }]}>
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.bottom}>
          <Button label="시작하기" onPress={handleContinue} />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg },
  title: { color: colors.white, fontSize: 18, fontWeight: '700', marginBottom: spacing.xl },
  row: { flexDirection: 'row' },
  card: {
    width: 128,
    paddingVertical: spacing.lg,
    borderRadius: radius.lg,
    alignItems: 'center',
    marginHorizontal: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  cardActive: { backgroundColor: colors.white, borderColor: colors.white },
  cardPressed: { opacity: 0.8 },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginBottom: spacing.sm,
  },
  cardLabel: { color: colors.white, textAlign: 'center', fontSize: 13, lineHeight: 18 },
  bottom: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
});
