import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import { AuthProvider } from './src/context/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';
import { navigate } from './src/navigation/navigationRef';
import { usePushRegistration } from './src/hooks/usePushRegistration';

function PushRegistrar() {
  usePushRegistration();

  // 푸시 알림을 탭했을 때(백그라운드/종료 상태에서 눌러서 앱을 연 경우 포함)
  // 낙상/급정지 알림이면 상세 화면으로 바로 이동시킵니다.
  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data || {};
      if (data.type === 'fall' || data.type === 'suddenStop') {
        navigate('AlertDetail', {
          alert: {
            id: data.alertId || `push-${Date.now()}`,
            type: data.type,
            title: data.title || (data.type === 'fall' ? '낙상 위험 감지' : '급정지 감지'),
            location: data.location,
            date: data.date,
            time: data.time,
            distanceMeters: data.distanceMeters != null ? Number(data.distanceMeters) : undefined,
            calories: data.calories != null ? Number(data.calories) : undefined,
            read: false,
          },
        });
      }
    });
    return () => sub.remove();
  }, []);

  return null;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="dark" />
        <PushRegistrar />
        <RootNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
