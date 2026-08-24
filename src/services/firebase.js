import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Expo는 EXPO_PUBLIC_ 접두사가 붙은 환경변수를 자동으로 클라이언트에 노출합니다.
// .env 파일(.env.example 참고)에 실제 Firebase 프로젝트 값을 채워주세요.
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// API 키가 채워져 있어야만 실제 Firebase에 연결합니다.
// 채워져 있지 않으면 앱은 로컬 목업 데이터로 동작하는 "데모 모드"로 실행됩니다.
export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

let app;
let auth;
let db;
let storage;

if (isFirebaseConfigured) {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);

  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (e) {
    // Fast Refresh 등으로 이미 초기화된 경우
    auth = getAuth(app);
  }

  db = getFirestore(app);
  storage = getStorage(app);
}

export { app, auth, db, storage };
