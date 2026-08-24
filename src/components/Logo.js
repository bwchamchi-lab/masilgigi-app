import React from 'react';
import { Image } from 'react-native';

const sources = {
  // 로고 마크만 (텍스트 없음) - 헤더 등 작은 사이즈에 사용
  mark: require('../assets/images/logo-mark.png'),
  // 마실지기 워드마크 전체 (한글/영문 로고 텍스트 포함) - 스플래시 등 큰 사이즈에 사용
  full: require('../assets/images/logo-full.png'),
};

/**
 * 마실지기 공식 로고.
 * variant: 'mark' (아이콘만) | 'full' (아이콘 + 워드마크)
 * size: 로고의 너비 기준 픽셀 값. 높이는 원본 비율에 맞춰 자동 계산됩니다.
 */
export default function Logo({ size = 96, variant = 'mark' }) {
  const source = sources[variant] || sources.mark;
  const aspectRatio = variant === 'full' ? 451 / 716 : 473 / 504;
  return (
    <Image
      source={source}
      style={{ width: size, height: size / aspectRatio }}
      resizeMode="contain"
    />
  );
}
