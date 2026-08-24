// 웹 푸시(Web Push API) 구독 처리.
// expo-notifications는 네이티브(iOS/Android 앱) 원격 푸시용이라 웹(PWA)에서는 동작하지 않기 때문에,
// 브라우저 표준 Push API + 서비스워커(public/sw.js)를 이용해 별도로 구현합니다.
//
// 아이폰에서 이 기능이 동작하려면:
//   1) iOS 16.4 이상
//   2) 사파리로 접속 후 공유 > "홈 화면에 추가"로 설치
//   3) 홈 화면 아이콘으로 앱을 연 상태(사파리 탭이 아니라 독립 실행 모드)에서
//      아래 subscribeToWebPush()를 사용자 탭(버튼 클릭) 안에서 호출
//
// EXPO_PUBLIC_VAPID_PUBLIC_KEY는 .env 에 설정하는 VAPID 공개키입니다.
// (개인키는 절대 클라이언트 코드/저장소에 넣지 마세요. scripts/send-test-push.js 참고)

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function isWebPushSupported() {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
}

/**
 * 서비스워커 등록 + 알림 권한 요청 + 푸시 구독을 한번에 처리합니다.
 * iOS Safari는 사용자 제스처(버튼 클릭) 없이 호출하면 권한 요청이 무시될 수 있으므로,
 * 반드시 버튼의 onPress 핸들러 안에서 곧바로 호출해야 합니다.
 *
 * 반환값: 구독 성공 시 JSON 직렬화 가능한 PushSubscription 객체, 실패/거부 시 null
 */
export async function subscribeToWebPush() {
  if (!isWebPushSupported()) return null;

  const vapidPublicKey = process.env.EXPO_PUBLIC_VAPID_PUBLIC_KEY;
  if (!vapidPublicKey) {
    throw new Error(
      'EXPO_PUBLIC_VAPID_PUBLIC_KEY가 설정되어 있지 않아요. .env에 VAPID 공개키를 넣어주세요.'
    );
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return null;

  const registration = await navigator.serviceWorker.register('sw.js');
  await navigator.serviceWorker.ready;

  let subscription = await registration.pushManager.getSubscription();
  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });
  }

  return subscription.toJSON();
}

export async function getExistingWebPushSubscription() {
  if (!isWebPushSupported()) return null;
  const registration = await navigator.serviceWorker.getRegistration('sw.js');
  if (!registration) return null;
  const subscription = await registration.pushManager.getSubscription();
  return subscription ? subscription.toJSON() : null;
}
