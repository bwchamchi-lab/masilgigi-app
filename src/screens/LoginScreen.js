import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Logo from '../components/Logo';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { colors, spacing } from '../theme/theme';
import { useAuth } from '../context/AuthContext';
import { signInWithEmail, resetPassword } from '../services/authService';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isDemoMode } = useAuth();

  const goNext = () => navigation.reset({ index: 0, routes: [{ name: 'UserType' }] });

  const handleLogin = async () => {
    if (isDemoMode) {
      login();
      goNext();
      return;
    }
    if (!email || !password) {
      Alert.alert('입력 확인', '이메일과 비밀번호를 입력해주세요.');
      return;
    }
    setLoading(true);
    try {
      await signInWithEmail({ email, password });
      login();
      goNext();
    } catch (err) {
      Alert.alert('로그인 실패', '이메일 또는 비밀번호를 다시 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('이메일 입력', '먼저 이메일 주소를 입력해주세요.');
      return;
    }
    if (isDemoMode) {
      Alert.alert('전송 완료', '비밀번호 재설정 링크를 이메일로 보냈어요.');
      return;
    }
    try {
      await resetPassword(email);
      Alert.alert('전송 완료', '비밀번호 재설정 링크를 이메일로 보냈어요.');
    } catch (err) {
      Alert.alert('전송 실패', '이메일 주소를 다시 확인해주세요.');
    }
  };

  // Google 로그인: 실제 연동 시 expo-auth-session의 Google 프로바이더에서
  // idToken을 받아 authService.signInWithGoogleIdToken(idToken)에 전달하세요.
  // (README "Google 로그인 설정" 참고)
  const handleGoogleLogin = () => {
    login();
    goNext();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Pressable
            onPress={() => navigation.goBack()}
            style={({ pressed }) => [styles.backBtn, pressed && styles.pressedIcon]}
            hitSlop={10}
          >
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </Pressable>

          <View style={styles.logoWrap}>
            <Logo variant="markGreen" size={56} />
          </View>
          <Text style={styles.title}>로그인</Text>

          <Text style={styles.label}>이메일 주소</Text>
          <InputField icon="mail-outline" placeholder="you@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" />

          <Text style={styles.label}>비밀번호</Text>
          <InputField icon="lock-closed-outline" placeholder="비밀번호를 입력해주세요." value={password} onChangeText={setPassword} secureTextEntry />

          <Pressable
            style={({ pressed }) => [styles.forgot, pressed && styles.pressedRow]}
            onPress={handleForgotPassword}
          >
            <Text style={styles.forgotText}>비밀번호를 잊어버렸나요?</Text>
          </Pressable>

          <Button label="로그인" onPress={handleLogin} loading={loading} />

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.divider} />
          </View>

          <Button label="Google로 로그인하기" variant="outline" onPress={handleGoogleLogin} />

          <Pressable
            style={({ pressed }) => [styles.signupRow, pressed && styles.pressedRow]}
            onPress={() => navigation.navigate('Signup')}
          >
            <Text style={styles.signupText}>
              계정이 없으신가요? <Text style={{ fontWeight: '700', color: colors.teal }}>회원가입</Text>
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.xxl },
  backBtn: { marginBottom: spacing.md },
  logoWrap: { alignItems: 'center', marginBottom: spacing.md },
  title: { fontSize: 22, fontWeight: '800', color: colors.textPrimary, marginBottom: spacing.sm, textAlign: 'center' },
  label: { fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginBottom: 6 },
  forgot: { alignSelf: 'flex-end', marginBottom: spacing.lg, marginTop: -spacing.sm },
  forgotText: { fontSize: 13, color: colors.teal, fontWeight: '600' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing.lg },
  divider: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { marginHorizontal: spacing.md, color: colors.textMuted, fontSize: 12, fontWeight: '600' },
  signupRow: { alignItems: 'center', marginTop: spacing.xl },
  signupText: { fontSize: 13, color: colors.textSecondary },
  pressedIcon: { opacity: 0.5 },
  pressedRow: { opacity: 0.6 },
});
