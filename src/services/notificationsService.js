import {
  collection,
  doc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  setDoc,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { notifications as mockNotifications } from '../data/mockData';

/**
 * notifications 컬렉션에서 알림 목록 조회 (최신순).
 * type: 'fall' | 'suddenStop' | 'idle' | 'system'
 * 라즈베리파이 → Firebase 이벤트 전송 흐름:
 *   1) Pi가 fall_events(또는 notifications) 컬렉션에 이벤트를 write
 *   2) Cloud Function이 해당 이용자의 보호자 expoPushToken으로 푸시 발송
 *   3) 앱은 이 컬렉션을 구독(getDocs 또는 onSnapshot)해서 목록/배지를 갱신
 */
export async function getNotifications(uid) {
  if (!isFirebaseConfigured) return mockNotifications;
  const q = query(
    collection(db, 'notifications'),
    where('uid', '==', uid),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function markNotificationRead(notificationId) {
  if (!isFirebaseConfigured) return;
  await updateDoc(doc(db, 'notifications', notificationId), { read: true });
}

/** Expo Push 토큰을 users/{uid}.expoPushToken 에 저장 (FCM으로 브릿지됨) */
export async function saveExpoPushToken(uid, token) {
  if (!isFirebaseConfigured) return;
  await setDoc(doc(db, 'users', uid), { expoPushToken: token }, { merge: true });
}

/**
 * 웹 푸시(Web Push API) 구독 정보를 users/{uid}.webPushSubscription 에 저장.
 * PWA(아이폰 홈 화면 추가 등)에서는 expoPushToken 대신 이 구독 객체로 발송해야 합니다.
 * 발송 예시는 scripts/send-test-push.js 참고.
 */
export async function saveWebPushSubscription(uid, subscription) {
  if (!isFirebaseConfigured) return;
  await setDoc(doc(db, 'users', uid), { webPushSubscription: subscription }, { merge: true });
}
