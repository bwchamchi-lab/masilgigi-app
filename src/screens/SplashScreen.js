import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Logo from '../components/Logo';
import { gradients } from '../theme/theme';

// 스펙: 로고만 표시 후 2~3초 뒤 자동으로 시작 화면으로 이동
const AUTO_NAVIGATE_MS = 2200;

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
    <LinearGradient colors={gradients.splash} style={styles.flex} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
      <SafeAreaView style={styles.flex}>
        <View style={styles.center}>
          <Animated.View style={{ opacity }}>
            <Logo variant="full" size={220} />
          </Animated.View>
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>봉원참치</Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  footer: { alignItems: 'center', paddingBottom: 40 },
  footerText: { color: '#16221F', fontSize: 15, fontWeight: '800' },
});
