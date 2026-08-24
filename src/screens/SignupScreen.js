import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Logo from '../components/Logo';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { colors, spacing } from '../theme/theme';
import { useAuth } from '../context/AuthContext';
import { signUpWithEmail } from '../services/authService';

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, isDemoMode, setUserName } = useAuth();

  const goNext = () => navigation.reset({ index: 0, routes: [{ name: 'UserType' }] });

  const handleSignup = async () => {
    if (isDemoMode) {
      if (name.trim()) setUserName(name.trim());
      login();
      goNext();
      return;
    }
    if (!name || !email || !password) {
      Alert.alert('입력 확인', '이름, 이메일, 비밀번호를 모두 입력해주세요.');
      return;
    }
    setLoading(true);
    try {
      await signUpWithEmail({ name, email, password });
      setUserName(name.trim());
      login();
      goNext();
    } catch (err) {
      Alert.alert('회원가입 실패', '이미 사용 중인 이메일이거나 비밀번호가 6자 미만일 수 있어요.');
    } finally {
      setLoading(false);
    }
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
          <Text style={styles.title}>회원가입</Text>

          <Text style={styles.label}>이름</Text>
          <InputField icon="person-outline" placeholder="홍길동" value={name} onChangeText={setName} />

          <Text style={styles.label}>이메일 주소</Text>
          <InputField icon="mail-outline" placeholder="you@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" />

          <Text style={styles.label}>Password</Text>
          <InputField icon="lock-closed-outline" placeholder="Enter Your Password" value={password} onChangeText={setPassword} secureTextEntry />

          <Pressable
            style={({ pressed }) => [styles.agreeRow, pressed && styles.pressedRow]}
            onPress={() => setAgree(!agree)}
          >
            <Ionicons
              name={agree ? 'checkbox' : 'square-outline'}
              size={20}
              color={agree ? colors.teal : colors.textMuted}
            />
            <Text style={styles.agreeText}>의료 서비스 이용약관 및 개인정보처리방침에 동의합니다.</Text>
          </Pressable>

          <Button label="회원가입" onPress={handleSignup} disabled={!agree} loading={loading} style={{ marginTop: spacing.md }} />

          <Pressable
            style={({ pressed }) => [styles.loginRow, pressed && styles.pressedRow]}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginText}>
              이미 계정이 있으신가요? <Text style={{ fontWeight: '700', color: colors.teal }}>로그인</Text>
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
  title: { fontSize: 22, fontWeight: '800', color: colors.textPrimary, marginBottom: spacing.lg, textAlign: 'center' },
  label: { fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginBottom: 6 },
  agreeRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.xs, marginBottom: spacing.md },
  agreeText: { fontSize: 12, color: colors.textSecondary, marginLeft: spacing.sm, flex: 1 },
  loginRow: { alignItems: 'center', marginTop: spacing.xl },
  loginText: { fontSize: 13, color: colors.textSecondary },
  pressedIcon: { opacity: 0.5 },
  pressedRow: { opacity: 0.6 },
});
