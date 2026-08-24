// 마실지기 디자인 토큰
// 목업 기준: 어두운 청록(브랜드) + 흰 카드 + 낙상알림용 레드 accent

export const colors = {
  // Brand teal (스플래시/헤더 그라데이션)
  tealDark: '#0B3D38',
  teal: '#12564D',
  tealLight: '#1D7A6C',
  tealMint: '#2FA394',

  // Alert / danger (낙상 감지)
  alertRed: '#E14C3A',
  alertRedDark: '#C43A2A',
  alertRedBg: '#FDEDEB',

  // Neutral
  white: '#FFFFFF',
  bg: '#F5F7F7',
  card: '#FFFFFF',
  border: '#E7ECEB',
  textPrimary: '#16221F',
  textSecondary: '#6B7876',
  textMuted: '#9AA5A3',

  // Status accents used in speed chips
  fast: '#E14C3A',
  normal: '#2E8F7D',
  slow: '#C9A227',

  // Pressed-state tints (버튼/터치 요소 공통 pressed state에 사용)
  pressedTint: '#EDF2F1',
  pressedOverlay: 'rgba(11,61,56,0.08)',
};

export const gradients = {
  brand: [colors.tealDark, colors.tealLight],
  // 스플래시/시작 화면용 - 로고 원본 디자인에 맞춘 차분한 세이지 그린 그라데이션
  splash: ['#4A6E66', '#5D7A79'],
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  pill: 999,
};

export const typography = {
  display: { fontSize: 26, fontWeight: '700', color: colors.textPrimary },
  h1: { fontSize: 22, fontWeight: '700', color: colors.textPrimary },
  h2: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  body: { fontSize: 15, fontWeight: '400', color: colors.textPrimary },
  bodyBold: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  caption: { fontSize: 13, fontWeight: '400', color: colors.textSecondary },
  small: { fontSize: 12, fontWeight: '400', color: colors.textMuted },
};

export const shadow = {
  card: {
    shadowColor: '#0B3D38',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
};
