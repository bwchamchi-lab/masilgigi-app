import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import { colors, gradients, radius, spacing, shadow } from '../theme/theme';

export default function StartScreen({ navigation }) {
  return (
    <LinearGradient colors={gradients.splash} style={styles.flex} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
      <SafeAreaView style={styles.flex}>
        <View style={styles.center}>
          <View style={[styles.card, shadow.card]}>
            <Text style={styles.tagline}>안전한 걸음의 시작,</Text>
            <Text style={styles.appName}>마실지기</Text>

            <Button label="로그인" onPress={() => navigation.navigate('Login')} style={{ marginTop: spacing.lg }} />
            <Button
              label="회원가입"
              variant="outline"
              onPress={() => navigation.navigate('Signup')}
              style={{ marginTop: spacing.sm }}
            />
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  tagline: { fontSize: 17, color: colors.textSecondary, fontWeight: '600' },
  appName: { fontSize: 28, fontWeight: '800', color: colors.textPrimary, marginTop: 4, marginBottom: spacing.lg },
});
