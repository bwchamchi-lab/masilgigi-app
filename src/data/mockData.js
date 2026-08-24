// 데모/오프라인 모드에서 사용하는 목업 데이터.
// Firebase가 연결되면 firestoreService가 실제 데이터로 대체합니다.

export const walkReports = [
  {
    id: 'w1',
    speed: 'fast',
    duration: 20,
    location: '서울 서대문구 이화여대길 52',
    date: '2026-08-01',
    time: '17:23',
    distanceMeters: 592,
    calories: 231,
    memo: '',
    // 지형 데이터 (스펙: IMU pitch 기반 오르막/평지/내리막 비율, 최대 경사도, 지형 핑거프린팅 인식률)
    elevation: { uphill: 24, flat: 54, downhill: 22 },
    maxSlope: '18% (약 400m 지점)',
    familiarityRate: 94,
  },
  {
    id: 'w2',
    speed: 'normal',
    duration: 18,
    location: '서울 서대문구 이화여대길 52',
    date: '2026-08-01',
    time: '11:53',
    distanceMeters: 480,
    calories: 190,
    memo: '',
    elevation: { uphill: 18, flat: 62, downhill: 20 },
    maxSlope: '11% (약 250m 지점)',
    familiarityRate: 91,
  },
  {
    id: 'w3',
    speed: 'fast',
    duration: 27,
    location: '서울 서대문구 이화여대길 52',
    date: '2026-07-25',
    time: '13:25',
    distanceMeters: 710,
    calories: 288,
    memo: '평소보다 빠르게 걸었어요.',
    elevation: { uphill: 30, flat: 46, downhill: 24 },
    maxSlope: '22% (약 580m 지점)',
    familiarityRate: 76,
  },
  {
    id: 'w4',
    speed: 'slow',
    duration: 8,
    location: '서울 서대문구 이화여대길 52',
    date: '2026-07-24',
    time: '15:15',
    distanceMeters: 210,
    calories: 64,
    memo: '',
    elevation: { uphill: 12, flat: 70, downhill: 18 },
    maxSlope: '9% (약 120m 지점)',
    familiarityRate: 58,
  },
];

export const walkStats = { fast: 24, normal: 12, slow: 8 };

// 오늘의 통계 카드 (스펙: 총 보행 횟수 / 총 보행 거리 / 낙상 위험 횟수)
export const todaySummary = {
  totalWalks: 3,
  totalDistanceMeters: 1782,
  fallRiskCount: 0,
};

// 알림 종류: fall(낙상위험감지) / suddenStop(급정지감지) / idle(장시간미사용) / system(시스템알림)
export const notifications = [
  {
    id: 'n1',
    type: 'fall',
    title: '낙상 위험 감지',
    location: '서울 서대문구 이화여대길 52',
    date: '2026-08-01',
    time: '17:23',
    distanceMeters: 592,
    calories: 231,
    read: false,
  },
  {
    id: 'n2',
    type: 'suddenStop',
    title: '급정지 감지',
    location: '서울 서대문구 이화여대길 52',
    date: '2026-07-28',
    time: '09:10',
    distanceMeters: 120,
    calories: 40,
    read: false,
  },
  {
    id: 'n3',
    type: 'idle',
    title: '장시간 미사용',
    location: '서울 서대문구 이화여대길 52',
    date: '2026-07-26',
    time: '20:00',
    read: true,
  },
  {
    id: 'n4',
    type: 'fall',
    title: '낙상 위험 감지',
    location: '서울 서대문구 이화여대길 52',
    date: '2026-07-25',
    time: '13:25',
    distanceMeters: 340,
    calories: 120,
    read: true,
  },
  {
    id: 'n5',
    type: 'system',
    title: '시스템 알림',
    body: '보행보조기 배터리가 20% 남았어요.',
    date: '2026-07-24',
    time: '08:00',
    read: true,
  },
];

export const userProfile = {
  name: '김화연',
  role: 'user',
  totalWalks: 128,
  totalDistanceKm: 42.6,
  totalExerciseMinutes: 860,
};

export const guardianProfile = {
  name: '이보호',
  role: 'guardian',
  linkedUser: {
    name: '김화연',
    heartRate: 78,
    caloriesToday: 756,
    fallsToday: 0,
    lastSeen: '방금 전',
    lastLocation: '서울 서대문구 이화여대길 52',
  },
};
