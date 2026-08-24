import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { gradients } from '../theme/theme';

// 스펙: 로고만 표시 후 2~3초 뒤 자동으로 시작 화면으로 이동
const AUTO_NAVIGATE_MS = 2200;

// 스플래시 전용 로고 타일 (아이콘 + 마실지기 + 태그라인 + 워드마크 + 저작권 표기까지 포함된 통합 이미지)
const splashLockup = require('../assets/images/splash-lockup.png');
const SPLASH_LOCKUP_ASPECT_RATIO = 169 / 446;

export default function SplashScreen({ navigation }) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: true }).start();

    const timer = setTimeout(() => {
      navigation.reset({ index: 0, routes: [{ name: 'Start' }] });
    }, AUTO_NAVIGATE_MS);

    return () => clearTimeout(timer);
  }, [navigation, opacity]);

  return (
    <LinearGradient colors={gradients.splashLight} style={styles.flex} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
      <SafeAreaView style={styles.flex}>
        <View style={styles.center}>
          <Animated.View style={{ opacity }}>
            <Image
              source={splashLockup}
              style={{ width: 180, height: 180 / SPLASH_LOCKUP_ASPECT_RATIO }}
              resizeMode="contain"
            />
          </Animated.View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
