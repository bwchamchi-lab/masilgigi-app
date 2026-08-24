// VAPID 키 쌍(공개키/개인키)을 생성합니다. 웹 푸시(Web Push API)를 위해 필요합니다.
// Node 내장 crypto만 사용하므로 npm install 없이 바로 실행할 수 있습니다.
//
// 사용법: node scripts/generate-vapid-keys.js
//
// 출력된 공개키는 .env 의 EXPO_PUBLIC_VAPID_PUBLIC_KEY 에 넣고,
// 개인키는 절대 저장소/클라이언트 코드에 넣지 말고 Replit Secrets(또는 로컬 환경변수)의
// VAPID_PRIVATE_KEY 로만 보관하세요. scripts/send-test-push.js 가 이 값을 사용합니다.

const crypto = require('crypto');

function base64url(buf) {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

const curve = crypto.createECDH('prime256v1');
curve.generateKeys();

let privateKey = curve.getPrivateKey();
if (privateKey.length < 32) {
  privateKey = Buffer.concat([Buffer.alloc(32 - privateKey.length), privateKey]);
}
const publicKey = curve.getPublicKey();

console.log('VAPID 공개키 (EXPO_PUBLIC_VAPID_PUBLIC_KEY 에 사용):');
console.log(base64url(publicKey));
console.log('');
console.log('VAPID 개인키 (VAPID_PRIVATE_KEY 에 사용, 절대 커밋/공유 금지):');
console.log(base64url(privateKey));
