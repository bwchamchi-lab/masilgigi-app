import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { useAuth } from '../context/AuthContext';
import { saveExpoPushToken } from '../services/notificationsService';
import { isFirebaseConfigured } from '../services/firebase';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * 로그인 상태가 되면 Expo 푸시 토큰을 발급받습니다.
 *
 * - Firebase가 아직 연동되지 않았어도(팀원 작업 대기 중이어도) 토큰 자체는 항상 발급받아
 *   AuthContext.expoPushToken 에 저장합니다. 설정 > 이용자 정보 수정 화면에서 이 토큰을
 *   확인해 https://expo.dev/notifications 로 수동 테스트를 바로 해볼 수 있어요.
 * - Firebase가 연동되어 있으면 추가로 users/{uid}.expoPushToken 에도 저장해서,
 *   라즈베리파이 → Firestore → Cloud Function → Expo Push 흐름에 그대로 쓸 수 있습니다.
 *
 * 주의: iOS 실기기 + Expo Go(또는 개발 빌드)에서만 토큰이 발급됩니다.
 * (Android는 SDK 53부터 Expo Go에서 원격 푸시가 막혀서 개발 빌드가 필요해요.)
 *
 * 웹(PWA)에서는 expo-notifications가 원격 푸시를 지원하지 않아 이 훅은 아무 것도 하지 않습니다.
 * 웹 푸시는 대신 설정 > 이용자 정보 수정 화면의 "이 기기에서 알림 받기" 버튼(src/services/webPush.js)
 * 에서 사용자가 직접 누를 때 등록합니다. (iOS Safari는 버튼 클릭 등 사용자 제스처 없이 호출하면
 * 알림 권한 요청이 무시되기 때문에, 로그인 시 자동 실행되는 이 훅에 넣을 수 없어요.)
 */
export function usePushRegistration() {
  const { isLoggedIn, uid, setExpoPushToken } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) return;
    if (Platform.OS === 'web') return; // 웹 푸시는 EditUserInfoScreen의 수동 버튼으로 등록합니다.

    (async () => {
      try {
        if (!Device.isDevice) return; // 시뮬레이터/에뮬레이터는 원격 푸시 토큰 발급 불가

        const { status: existing } = await Notifications.getPermissionsAsync();
        let finalStatus = existing;
        if (existing !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== 'granted') return;

        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.HIGH,
          });
        }

        const projectId = Constants.expoConfig?.extra?.eas?.projectId;
        const tokenData = await Notifications.getExpoPushTokenAsync(
          projectId ? { projectId } : undefined
        );

        setExpoPushToken(tokenData.data);

        if (isFirebaseConfigured) {
          await saveExpoPushToken(uid, tokenData.data);
        }
      } catch (e) {
        // 권한 거부, 실기기 아님, projectId 미설정 등 - 조용히 무시하고 다음 로그인 때 재시도
      }
    })();
  }, [isLoggedIn, uid]);
}
