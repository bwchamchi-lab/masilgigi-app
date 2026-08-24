// 마실지기 웹 푸시(Web Push) 서비스워커
// iOS Safari(16.4+)에서 "홈 화면에 추가"한 뒤 이 파일이 등록되어야
// 앱이 꺼져있거나 화면이 잠겨있어도 서버가 보낸 알림을 받을 수 있습니다.
//
// 이 파일은 src/services/webPush.js 에서 navigator.serviceWorker.register('sw.js')로
// 등록됩니다. Expo 웹 빌드는 public/ 폴더를 그대로 정적 파일로 서빙하므로 별도 번들링이 필요 없습니다.

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// 서버(웹 푸시 발송 스크립트/함수)가 보낸 푸시 메시지를 받아 알림으로 띄웁니다.
self.addEventListener('push', (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch (e) {
    payload = { title: '마실지기', body: event.data ? event.data.text() : '새 알림이 있어요.' };
  }

  const title = payload.title || '마실지기';
  const options = {
    body: payload.body || '',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: { url: payload.url || '/' },
    // 낙상 등 긴급 알림은 사용자가 직접 닫기 전까지 화면에 남아있도록 합니다. (지원 브라우저에 한함)
    requireInteraction: Boolean(payload.requireInteraction),
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// 알림을 탭하면 이미 열려있는 탭이 있으면 포커스하고, 없으면 새로 엽니다.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if ('focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});
