import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../components/ScreenHeader';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { colors, radius, spacing } from '../theme/theme';
import { addReport } from '../services/reportsService';
import { useAuth } from '../context/AuthContext';

export default function UploadReportScreen({ navigation }) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [distanceMeters, setDistanceMeters] = useState('');
  const [calories, setCalories] = useState('');
  const [memo, setMemo] = useState('');
  const [saving, setSaving] = useState(false);
  const { uid } = useAuth();

  const handleUpload = async () => {
    if (!date || !location) {
      Alert.alert('입력 확인', '날짜와 위치는 꼭 입력해주세요.');
      return;
    }
    setSaving(true);
    try {
      await addReport(uid, {
        date,
        time,
        location,
        distanceMeters: distanceMeters ? Number(distanceMeters) : null,
        calories: calories ? Number(calories) : null,
        memo,
      });
      Alert.alert('업로드 완료', '리포트가 저장되었어요.', [
        { text: '확인', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert('업로드 실패', '잠시 후 다시 시도해주세요.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title="리포트 업로드" />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>날짜 *</Text>
        <InputField icon="calendar-outline" placeholder="yyyy-mm-dd" value={date} onChangeText={setDate} />

        <Text style={styles.label}>시간</Text>
        <InputField icon="time-outline" placeholder="hh:mm" value={time} onChangeText={setTime} />

        <Text style={styles.label}>위치 *</Text>
        <InputField icon="location-outline" placeholder="서울 서대문구 이화여대길 52" value={location} onChangeText={setLocation} />

        <Text style={styles.label}>이동 거리 (m)</Text>
        <InputField icon="navigate-outline" placeholder="592" value={distanceMeters} onChangeText={setDistanceMeters} keyboardType="numeric" />

        <Text style={styles.label}>소모 칼로리</Text>
        <InputField icon="flame-outline" placeholder="231" value={calories} onChangeText={setCalories} keyboardType="numeric" />

        <Text style={styles.label}>메모</Text>
        <TextInput
          style={styles.memoBox}
          placeholder="특이사항을 기록해보세요."
          placeholderTextColor={colors.textMuted}
          value={memo}
          onChangeText={setMemo}
          multiline
        />

        <Button label="Upload Report" onPress={handleUpload} loading={saving} style={{ marginTop: spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  label: { fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginBottom: 6, marginTop: spacing.sm },
  memoBox: {
    minHeight: 100,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    fontSize: 14,
    color: colors.textPrimary,
    textAlignVertical: 'top',
  },
});
