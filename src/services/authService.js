import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithCredential,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from './firebase';

/**
 * 이메일/비밀번호 회원가입.
 * Firestore users/{uid} 문서도 함께 생성합니다.
 */
export async function signUpWithEmail({ name, email, password }) {
  if (!isFirebaseConfigured) {
    throw new Error('DEMO_MODE');
  }
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: name });
  await setDoc(doc(db, 'users', cred.user.uid), {
    name,
    email,
    role: null, // 'user' | 'guardian' — UserTypeScreen에서 선택 후 채워짐
    createdAt: serverTimestamp(),
  });
  return cred.user;
}

export async function signInWithEmail({ email, password }) {
  if (!isFirebaseConfigured) {
    throw new Error('DEMO_MODE');
  }
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function signOutUser() {
  if (!isFirebaseConfigured) return;
  await signOut(auth);
}

export async function resetPassword(email) {
  if (!isFirebaseConfigured) {
    throw new Error('DEMO_MODE');
  }
  await sendPasswordResetEmail(auth, email);
}

/**
 * Google 로그인.
 * expo-auth-session으로 발급받은 idToken을 넘겨 Firebase Credential로 교환합니다.
 * 사용법은 screens/LoginScreen.js와 README의 "Google 로그인 설정" 참고.
 */
export async function signInWithGoogleIdToken(idToken) {
  if (!isFirebaseConfigured) {
    throw new Error('DEMO_MODE');
  }
  const credential = GoogleAuthProvider.credential(idToken);
  const result = await signInWithCredential(auth, credential);
  return result.user;
}

export function subscribeToAuthState(callback) {
  if (!isFirebaseConfigured) {
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}
