// 웹 푸시(PWA) 구독으로 테스트 알림을 한 번 보내봅니다.
// (라즈베리파이 → Firestore → Cloud Function으로 이어지는 실제 발송 흐름을 아직 안 만들었어도,
//  이 스크립트로 "정말 화면 잠금 상태에서도 알림이 오는지"를 지금 바로 확인할 수 있어요.)
//
// 준비물:
//   1) npm install (web-push 패키지가 devDependencies에 있어요)
//   2) node scripts/generate-vapid-keys.js 로 만든 개인키를 환경변수 VAPID_PRIVATE_KEY 로 설정
//      (.env의 EXPO_PUBLIC_VAPID_PUBLIC_KEY와 반드시 같은 키 쌍이어야 합니다)
//   3) 앱의 "설정 > 이용자 정보 수정" 화면에서 "이 기기에서 알림 받기"를 누른 뒤
//      구독 정보를 복사해서 scripts/subscription.json 으로 저장 (이 파일은 git에 커밋되지 않아요)
//
// 실행:
//   VAPID_PRIVATE_KEY=... node scripts/send-test-push.js

const fs = require('fs');
const path = require('path');
const webPush = require('web-push');

const VAPID_PUBLIC_KEY = process.env.EXPO_PUBLIC_VAPID_PUBLIC_KEY || process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:admin@example.com';

if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
  console.error(
    '환경변수 EXPO_PUBLIC_VAPID_PUBLIC_KEY(또는 VAPID_PUBLIC_KEY)와 VAPID_PRIVATE_KEY가 필요해요.\n' +
      'node scripts/generate-vapid-keys.js 로 키를 만들고 설정해주세요.'
  );
  process.exit(1);
}

const subscriptionPath = path.join(__dirname, 'subscription.json');
if (!fs.existsSync(subscriptionPath)) {
  console.error(
    `구독 정보 파일이 없어요: ${subscriptionPath}\n` +
      '앱의 "설정 > 이용자 정보 수정" 화면에서 웹 푸시를 켠 뒤 "구독 정보 복사"로 복사한 내용을\n' +
      '그대로 scripts/subscription.json 파일에 붙여넣어 저장해주세요.'
  );
  process.exit(1);
}

const subscription = JSON.parse(fs.readFileSync(subscriptionPath, 'utf8'));

webPush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

const payload = JSON.stringify({
  title: '낙상 위험 감지 (테스트)',
  body: '테스트 알림이에요. 화면이 잠겨있어도 떴다면 정상이에요!',
  requireInteraction: true,
});

webPush
  .sendNotification(subscription, payload)
  .then(() => console.log('푸시를 보냈어요. 아이폰 화면을 확인해보세요.'))
  .catch((err) => {
    console.error('푸시 발송 실패:', err.message || err);
    if (err.statusCode === 410 || err.statusCode === 404) {
      console.error('구독이 만료됐을 수 있어요. 앱에서 알림을 다시 켜고 구독 정보를 새로 복사해주세요.');
    }
  });
