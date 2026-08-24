import React from 'react';
import { Image } from 'react-native';

const sources = {
  // 로고 마크만 (텍스트 없음) - 헤더 등 작은 사이즈에 사용
  mark: require('../assets/images/logo-mark.png'),
  // 마실지기 워드마크 전체 (한글/영문 로고 텍스트 포함) - 스플래시 등 큰 사이즈에 사용
  full: require('../assets/images/logo-full.png'),
  // full의 흰색 버전 - 어두운 배경(스플래시 그라데이션 등) 위에 사용
  fullWhite: require('../assets/images/logo-full-white.png'),
  // 흰색 워커 아이콘 + 초록 배경 타일 - 로그인/회원가입 등 그 외 로고 노출 지점에 사용
  markGreen: require('../assets/images/logo-mark-green.png'),
};

/**
 * 마실지기 공식 로고.
 * variant: 'mark' (아이콘만) | 'full' (아이콘 + 워드마크) | 'fullWhite' (흰색 버전, 어두운 배경용) | 'markGreen' (흰 아이콘 + 초록 배경 타일)
 * size: 로고의 너비 기준 픽셀 값. 높이는 원본 비율에 맞춰 자동 계산됩니다.
 */
export default function Logo({ size = 96, variant = 'mark' }) {
  const source = sources[variant] || sources.mark;
  const aspectRatio = variant === 'markGreen' ? 1 : variant === 'full' || variant === 'fullWhite' ? 451 / 716 : 473 / 504;
  return (
    <Image
      source={source}
      style={{ width: size, height: size / aspectRatio }}
      resizeMode="contain"
    />
  );
}
