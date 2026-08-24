import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { isFirebaseConfigured } from '../services/firebase';
import { subscribeToAuthState, signOutUser } from '../services/authService';
import { setUserRole as setUserRoleRemote } from '../services/reportsService';

const AuthContext = createContext(null);

// uid를 바탕으로 사람이 읽기 쉬운 6자리 연결 코드를 만듭니다. (데모/오프라인용)
function buildConnectionCode(seed) {
  const clean = (seed || 'MASILGIGI').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  const padded = (clean + 'MASILGIGI').slice(0, 6);
  return padded;
}

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null); // 'user' | 'guardian'
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [userName, setUserName] = useState(''); // 회원가입 시 입력한 이름 (마이페이지 상단 이름과 동일하게 사용)
  // 마실지기 이용자 - 보호자 연결 상태 (데모/로컬 상태, 실제 서버 연동 시 firestore로 대체)
  const [linkedCode, setLinkedCode] = useState(null);
  const [expoPushToken, setExpoPushToken] = useState(null);
  // 웹(PWA)에서는 expoPushToken 대신 브라우저 Push API 구독 객체를 사용합니다.
  const [webPushSubscription, setWebPushSubscription] = useState(null);

  // Firebase가 설정되어 있으면 실제 인증 상태를 구독합니다.
  // 설정되어 있지 않으면(EXPO_PUBLIC_FIREBASE_* 미입력) 데모 모드로 동작합니다.
  useEffect(() => {
    if (!isFirebaseConfigured) return;
    const unsubscribe = subscribeToAuthState((user) => {
      setFirebaseUser(user);
      setIsLoggedIn(Boolean(user));
      if (user?.displayName) setUserName(user.displayName);
    });
    return unsubscribe;
  }, []);

  const uid = firebaseUser?.uid ?? 'demo-user';
  const myConnectionCode = useMemo(
    () => buildConnectionCode(userName || uid),
    [userName, uid]
  );

  const value = useMemo(
    () => ({
      isLoggedIn,
      role,
      firebaseUser,
      userName,
      setUserName,
      uid,
      isDemoMode: !isFirebaseConfigured,
      myConnectionCode,
      linkedCode,
      expoPushToken,
      setExpoPushToken,
      webPushSubscription,
      setWebPushSubscription,
      // 상대방(이용자 또는 보호자)의 연결 코드를 입력해 서로 연결합니다.
      connectPartner: (code) => {
        const trimmed = (code || '').trim();
        if (trimmed.length < 4) return false;
        setLinkedCode(trimmed.toUpperCase());
        return true;
      },
      disconnectPartner: () => setLinkedCode(null),
      // Firebase 로그인/회원가입은 authService에서 처리하고, 성공 후 이 함수를 호출해
      // 화면 전환용 로컬 상태만 갱신합니다.
      login: () => setIsLoggedIn(true),
      logout: async () => {
        try {
          await signOutUser();
        } finally {
          setIsLoggedIn(false);
          setRole(null);
          setFirebaseUser(null);
          setUserName('');
          setLinkedCode(null);
        }
      },
      selectRole: async (r) => {
        setRole(r);
        if (isFirebaseConfigured && firebaseUser) {
          await setUserRoleRemote(firebaseUser.uid, r);
        }
      },
    }),
    [
      isLoggedIn,
      role,
      firebaseUser,
      userName,
      uid,
      myConnectionCode,
      linkedCode,
      expoPushToken,
      webPushSubscription,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
