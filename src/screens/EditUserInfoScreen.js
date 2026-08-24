import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Pressable, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import ScreenHeader from '../components/ScreenHeader';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { colors, radius, spacing, shadow } from '../theme/theme';
import { useAuth } from '../context/AuthContext';
import {
  subscribeToWebPush,
  isWebPushSupported,
  getExistingWebPushSubscription,
} from '../services/webPush';
import { saveWebPushSubscription } from '../services/notificationsService';
import { isFirebaseConfigured } from '../services/firebase';

export default function EditUserInfoScreen() {
  const {
    userName,
    setUserName,
    role,
    myConnectionCode,
    linkedCode,
    connectPartner,
    disconnectPartner,
    expoPushToken,
    uid,
    webPushSubscription,
    setWebPushSubscription,
  } = useAuth();

  const [name, setName] = useState(userName);
  const [codeInput, setCodeInput] = useState('');
  const [webPushLoading, setWebPushLoading] = useState(false);

  // 이전에 이미 알림을 켠 적이 있으면(브라우저에 구독이 남아있으면) 다시 물어보지 않고
  // 화면 진입 시 조용히 확인만 해서 "이미 켜져 있음" 상태로 보여줍니다.
  useEffect(() => {
    if (Platform.OS !== 'web' || webPushSubscription) return;
    getExistingWebPushSubscription()
      .then((sub) => {
        if (sub) setWebPushSubscription(sub);
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 이용자 화면이면 상대는 보호자, 보호자 화면이면 상대는 이용자
  const partnerLabel = role === 'guardian' ? '마실지기 이용자' : '보호자';

  const handleSaveName = () => {
    if (!name.trim()) {
      Alert.alert('입력 확인', '이름을 입력해주세요.');
      return;
    }
    setUserName(name.trim());
    Alert.alert('저장 완료', '이름이 변경되었어요.');
  };

  const handleCopyCode = async () => {
    try {
      await Clipboard.setStringAsync(myConnectionCode);
      Alert.alert('복사 완료', '연결 코드를 복사했어요.');
    } catch (err) {
      // 클립보드 접근이 불가한 환경이면 조용히 무시합니다.
    }
  };

  const handleCopyPushToken = async () => {
    if (!expoPushToken) return;
    try {
      await Clipboard.setStringAsync(expoPushToken);
      Alert.alert('복사 완료', '푸시 토큰을 복사했어요.\nexpo.dev/notifications 에 붙여넣어 테스트할 수 있어요.');
    } catch (err) {
      // 무시
    }
  };

  // 웹(PWA)에서 알림 권한을 요청하고 Push 구독을 등록합니다.
  // iOS Safari는 사용자 제스처(이 버튼 클릭) 없이 호출하면 권한 요청이 무시되므로
  // 반드시 onPress 안에서 바로 호출해야 합니다.
  const handleEnableWebPush = async () => {
    setWebPushLoading(true);
    try {
      const subscription = await subscribeToWebPush();
      if (!subscription) {
        Alert.alert(
          '알림 켜기 실패',
          '알림 권한이 거부되었거나 지원하지 않는 환경이에요.\n사파리 설정 > 알림에서 허용했는지 확인해주세요.'
        );
        return;
      }
      setWebPushSubscription(subscription);
      if (isFirebaseConfigured) {
        await saveWebPushSubscription(uid, subscription);
      }
      Alert.alert(
        '알림 켜기 완료',
        'Firebase가 연동되어 있다면 서버에서 이 기기로 바로 알림을 보낼 수 있어요.\n연동 전이라면 아래 "구독 정보 복사"로 복사해 scripts/send-test-push.js로 테스트해보세요.'
      );
    } catch (e) {
      Alert.alert('알림 켜기 실패', e?.message || '알 수 없는 오류가 발생했어요.');
    } finally {
      setWebPushLoading(false);
    }
  };

  const handleCopyWebPushSubscription = async () => {
    if (!webPushSubscription) return;
    try {
      await Clipboard.setStringAsync(JSON.stringify(webPushSubscription));
      Alert.alert('복사 완료', '웹 푸시 구독 정보를 복사했어요.');
    } catch (err) {
      // 무시
    }
  };

  const handleConnect = () => {
    const ok = connectPartner(codeInput);
    if (!ok) {
      Alert.alert('연결 실패', '연결 코드를 다시 확인해주세요. (4자 이상)');
      return;
    }
    setCodeInput('');
    Alert.alert('연결 완료', `${partnerLabel}와 연결되었어요.`);
  };

  const handleDisconnect = () => {
    Alert.alert('연결 해제', `${partnerLabel}와의 연결을 해제할까요?`, [
      { text: '취소', style: 'cancel' },
      { text: '해제', style: 'destructive', onPress: disconnectPartner },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title="이용자 정보 수정" />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.sectionTitle}>이름</Text>
        <InputField
          icon="person-outline"
          placeholder="이름을 입력해주세요"
          value={name}
          onChangeText={setName}
        />
        <Button label="이름 저장" onPress={handleSaveName} style={{ marginBottom: spacing.xl }} />

        <Text style={styles.sectionTitle}>{partnerLabel} 연결</Text>

        <View style={[styles.card, shadow.card]}>
          <Text style={styles.caption}>내 연결 코드</Text>
          <Pressable
            onPress={handleCopyCode}
            style={({ pressed }) => [styles.codeRow, pressed && styles.codeRowPressed]}
          >
            <Text style={styles.codeText}>{myConnectionCode}</Text>
            <Ionicons name="copy-outline" size={18} color={colors.textMuted} />
          </Pressable>
          <Text style={styles.helper}>이 코드를 {partnerLabel}에게 공유하면 서로 연결할 수 있어요.</Text>
        </View>

        <View style={[styles.card, shadow.card, { marginTop: spacing.md }]}>
          {linkedCode ? (
            <>
              <View style={styles.linkedRow}>
                <Ionicons name="checkmark-circle" size={20} color={colors.teal} />
                <Text style={styles.linkedText}>{linkedCode} 코드와 연결되었어요</Text>
              </View>
              <Button
                label="연결 해제"
                variant="outline"
                onPress={handleDisconnect}
                style={{ marginTop: spacing.md }}
              />
            </>
          ) : (
            <>
              <Text style={styles.caption}>{partnerLabel}의 연결 코드 입력</Text>
              <InputField
                icon="link-outline"
                placeholder="연결 코드를 입력해주세요"
                value={codeInput}
                onChangeText={setCodeInput}
                autoCapitalize="characters"
              />
              <Button label="연결하기" onPress={handleConnect} />
            </>
          )}
        </View>

        <Text style={styles.sectionTitle}>알림 (개발자 확인용)</Text>
        {Platform.OS === 'web' ? (
          <View style={[styles.card, shadow.card]}>
            {!isWebPushSupported() ? (
              <Text style={styles.helper}>
                이 브라우저/환경은 웹 푸시를 지원하지 않아요. 아이폰이라면 사파리로 접속해
                공유 버튼 → "홈 화면에 추가"로 설치한 뒤, 홈 화면 아이콘으로 다시 열어서 시도해주세요.
                (iOS 16.4 이상 필요)
              </Text>
            ) : webPushSubscription ? (
              <>
                <View style={styles.linkedRow}>
                  <Ionicons name="checkmark-circle" size={20} color={colors.teal} />
                  <Text style={styles.linkedText}>이 기기에서 알림이 켜져 있어요</Text>
                </View>
                <Pressable
                  onPress={handleCopyWebPushSubscription}
                  style={({ pressed }) => [
                    styles.codeRow,
                    pressed && styles.codeRowPressed,
                    { marginTop: spacing.md },
                  ]}
                >
                  <Text style={styles.tokenText} numberOfLines={2}>
                    {JSON.stringify(webPushSubscription)}
                  </Text>
                  <Ionicons name="copy-outline" size={18} color={colors.textMuted} />
                </Pressable>
                <Text style={styles.helper}>
                  Firebase가 연동되어 있지 않다면, 이 구독 정보를 복사해 scripts/send-test-push.js로
                  테스트 알림을 보내볼 수 있어요.
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.helper}>
                  이 기기(브라우저)로 알림을 받으려면 아래 버튼을 눌러 권한을 허용해주세요.
                  아이폰은 반드시 "홈 화면에 추가"한 아이콘으로 연 상태여야 알림이 동작해요.
                </Text>
                <Button
                  label={webPushLoading ? '처리 중...' : '이 기기에서 알림 받기'}
                  onPress={handleEnableWebPush}
                  disabled={webPushLoading}
                  style={{ marginTop: spacing.md }}
                />
              </>
            )}
          </View>
        ) : (
          <View style={[styles.card, shadow.card]}>
            {expoPushToken ? (
              <>
                <Text style={styles.caption}>내 기기 푸시 토큰</Text>
                <Pressable
                  onPress={handleCopyPushToken}
                  style={({ pressed }) => [styles.codeRow, pressed && styles.codeRowPressed]}
                >
                  <Text style={styles.tokenText} numberOfLines={2}>{expoPushToken}</Text>
                  <Ionicons name="copy-outline" size={18} color={colors.textMuted} />
                </Pressable>
                <Text style={styles.helper}>
                  이 토큰을 expo.dev/notifications 에 붙여넣으면 이 기기로 테스트 알림을 바로 보내볼 수 있어요.
                </Text>
              </>
            ) : (
              <Text style={styles.helper}>
                푸시 토큰이 아직 없어요. 알림 권한을 허용했는지, 실제 기기(시뮬레이터 아님)에서 실행 중인지 확인해주세요.
              </Text>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.lg },
  caption: { fontSize: 12, color: colors.textSecondary, marginBottom: spacing.xs },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  codeRowPressed: { backgroundColor: colors.pressedTint },
  codeText: { fontSize: 18, fontWeight: '800', letterSpacing: 2, color: colors.teal },
  tokenText: { flex: 1, fontSize: 11, color: colors.teal, fontWeight: '600', marginRight: spacing.sm },
  helper: { fontSize: 11, color: colors.textMuted, marginTop: spacing.sm },
  linkedRow: { flexDirection: 'row', alignItems: 'center' },
  linkedText: { fontSize: 14, fontWeight: '700', color: colors.textPrimary, marginLeft: spacing.sm },
});
