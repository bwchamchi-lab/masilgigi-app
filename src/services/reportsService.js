import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { walkReports as mockReports, userProfile as mockUserProfile } from '../data/mockData';

/** users/{uid} 문서에 role(이용자/보호자) 저장 */
export async function setUserRole(uid, role) {
  if (!isFirebaseConfigured) return; // 데모 모드에서는 AuthContext의 로컬 상태만 사용
  await setDoc(doc(db, 'users', uid), { role }, { merge: true });
}

export async function getUserProfile(uid) {
  if (!isFirebaseConfigured) return mockUserProfile;
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : mockUserProfile;
}

/** reports 컬렉션에 리포트 저장 (스펙: 날짜/시간/위치/이동거리/소모칼로리/메모) */
export async function addReport(uid, report) {
  if (!isFirebaseConfigured) return { id: `local-${Date.now()}`, ...report };
  const ref = await addDoc(collection(db, 'reports'), {
    uid,
    ...report,
    createdAt: serverTimestamp(),
  });
  return { id: ref.id, ...report };
}

/** 특정 이용자의 리포트 목록 (최신순) */
export async function getReports(uid) {
  if (!isFirebaseConfigured) return mockReports;
  const q = query(collection(db, 'reports'), where('uid', '==', uid), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
