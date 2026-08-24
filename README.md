# 마실지기 (Masilgigi) — React Native App

노인/보호자를 위한 걷기 안전·낙상 감지 앱, 업로드된 디자인 목업을 기반으로 만든 Expo React Native 프로젝트입니다.

## 실행 방법

```bash
npm install
npx expo start
```

Expo Go 앱(iOS/Android)으로 QR코드를 스캔하거나, `w` 키로 웹에서 확인할 수 있습니다.

## 화면 구성

- **Splash** — 로고 + "안전한 걸음의 시작, 마실지기" + 로그인/회원가입 버튼
- **Login / Signup** — 이메일·비밀번호, 구글/카카오 로그인 버튼, 이용약관 동의
- **UserType** — "누가 앱을 이용하나요?" 이용자 / 보호자 역할 선택
- **MainTabs**
  - **Report (리포트)** — 검색창, 빠른/보통/느린 마실 통계 박스(필터 겸용), 마실 리포트 리스트 → **ReportDetail**(경로 지도 자리, 날짜/위치/거리/칼로리) / **UploadReport**(리포트 수동 업로드)
  - **Alert (긴급알림)** — 낙상 감지 긴급 알림 리스트(최신/미확인 항목 강조) → **AlertDetail**(낙상 상세 + 보호자에게 전화하기)
  - **Settings (설정)** — 역할에 따라 분기
    - 이용자: 프로필, 오늘의 낙상/칼로리/걸음순위, 이용자 정보 수정/이용방법/로그아웃/탈퇴
    - 보호자: 연결된 이용자의 실시간 상태(심박수·칼로리·낙상), 저장된 이용자/예약/결제/FAQ 메뉴, 로그아웃
- **LogoutModal** — "로그아웃 하시겠습니까?" 확인 모달 (목업 재현)

## 디자인 토큰

`src/theme/theme.js`에 목업의 청록(teal) 브랜드 컬러 + 낙상알림용 레드 accent를 기반으로 컬러/타이포/스페이싱/그림자를 정의했습니다. 아이콘은 `@expo/vector-icons`(Ionicons)를 사용했습니다.

## 웹으로 배포해서 "홈 화면에 추가"로 열기 (GitHub Pages)

네이티브 빌드(APK/IPA) 없이, 웹 버전을 GitHub Pages에 올리고 링크만 공유하면 사파리의 "공유 → 홈 화면에 추가"로 앱처럼 설치해서 쓸 수 있습니다.

### 1. 저장소 이름에 맞게 `app.json` 수정
`experiments.baseUrl` 값을 실제 GitHub 저장소 이름으로 바꿔주세요. (예: 저장소가 `github.com/내계정/masilgigi-app` 이면 `/masilgigi-app` 그대로 사용)

### 2. GitHub Pages 소스 브랜치 설정
GitHub 저장소 → Settings → Pages → Source를 **`gh-pages` 브랜치**로 지정합니다. (처음엔 브랜치가 없어서 안 보일 수 있는데, 아래 3번을 한 번 실행하면 자동으로 생겨서 다시 보입니다.)

### 3. main 브랜치에 push하면 자동 배포
`.github/workflows/deploy-web.yml`이 main 브랜치 push마다 다음을 자동으로 수행합니다:
```bash
npm ci
npm run build:web      # expo export -p web 후 404.html 생성(새로고침 대응)
```
빌드 결과(`dist/`)를 `gh-pages` 브랜치로 자동 배포합니다. 몇 분 뒤 `https://내계정.github.io/masilgigi-app/`에서 접속됩니다.

로컬에서 수동으로 배포하고 싶다면:
```bash
npm install
npm run deploy   # build:web 실행 후 gh-pages 브랜치로 push
```

### 4. 아이폰에서 홈 화면에 추가
1. 사파리로 배포된 링크를 엽니다.
2. 하단 공유 버튼 → **"홈 화면에 추가"**를 누릅니다.
3. 홈 화면에 마실지기 아이콘이 생기고, 탭하면 주소창 없이 앱처럼 전체 화면으로 열립니다.

`public/manifest.json`과 `public/index.html`의 `apple-mobile-web-app-capable`, `apple-touch-icon` 메타 태그 덕분에 가능한 동작입니다. 아이콘은 `public/icon-*.png`, `public/apple-touch-icon.png`, `public/favicon.ico`로 이미 생성해두었습니다.

### 참고: 웹(PWA) 방식의 한계
- 낙상 자동 감지(가속도 센서 백그라운드 감지)나 백그라운드 위치 추적처럼 OS 딥 연동이 필요한 기능은 웹에서는 제한적이거나 불가능합니다. 지금 앱은 UI/흐름 데모이므로 문제 없지만, 실제 센서 연동은 네이티브 빌드(EAS Build)가 필요합니다.
- 푸시 알림(긴급 알림)은 iOS 16.4+ 홈 화면 추가 앱에 한해 지원되며, 구현 방법은 아래 "아이폰에서 푸시 알림 받기" 섹션을 참고하세요.
- 안드로이드는 Chrome에서도 동일하게 "앱 설치" 배너로 홈 화면 추가가 가능합니다.

## 아이폰에서 푸시 알림 받기 (웹 푸시 설정)

이 프로젝트는 웹(PWA)으로 배포되기 때문에, 네이티브 앱에서 쓰는 Expo 푸시(`expo-notifications`)가 아니라
브라우저 표준 **Web Push API**로 아이폰 알림을 구현했습니다. (`public/sw.js`, `src/services/webPush.js`)

### 1. VAPID 키 생성
```bash
node scripts/generate-vapid-keys.js
```
공개키/개인키 한 쌍이 출력됩니다. (npm install 없이 Node 내장 crypto만으로 동작합니다)

### 2. 환경변수 설정
- 공개키 → `.env`(또는 Replit Secrets)의 `EXPO_PUBLIC_VAPID_PUBLIC_KEY`
- 개인키 → `VAPID_PRIVATE_KEY` (절대 `.env`나 저장소에 커밋하지 말고, 테스트 발송 스크립트를 실행할 때만 환경변수로 넘기세요)

### 3. 아이폰에서 설치 + 알림 켜기
1. 아이폰 사파리로 Replit에 배포된 주소를 엽니다.
2. 공유 버튼 → **"홈 화면에 추가"**
3. **반드시 홈 화면 아이콘으로 다시 열어서**(사파리 탭이 아니라 독립 실행 모드) 로그인 후
   설정 → 이용자 정보 수정 화면으로 이동, **"이 기기에서 알림 받기"** 버튼을 누르고 알림 권한을 허용합니다.
4. Firebase가 연동되어 있으면 구독 정보가 `users/{uid}.webPushSubscription`에 자동 저장됩니다.
   아직 Firebase 연동 전이라면 같은 화면의 "구독 정보 복사"로 복사해두세요.

### 4. 테스트 알림 보내보기
```bash
npm install
# Firebase 미연동 시: 3번에서 복사한 구독 정보를 scripts/subscription.json 으로 저장한 뒤
VAPID_PRIVATE_KEY=발급받은개인키 node scripts/send-test-push.js
```
화면이 잠겨있어도 문자/카카오톡처럼 화면이 켜지면서 알림이 뜨면 정상입니다.

### 5. 실제 낙상 감지 → 알림 자동 발송 연결
지금은 "구독 정보를 저장"하는 것과 "테스트 알림을 수동으로 보내는 스크립트"까지만 구현되어 있습니다.
라즈베리파이가 감지한 낙상 이벤트가 Firestore에 쓰였을 때 자동으로 위 구독 정보로 푸시를 보내려면,
`scripts/send-test-push.js`의 발송 로직(`web-push` 라이브러리 사용)을 Firebase Cloud Function(또는 별도 서버)에서
Firestore `notifications`/`fall_events` 컬렉션 변경을 감지해 호출하도록 연결해주면 됩니다.

## Firebase 연동 방법 (실제 서비스로 동작시키기)

지금 이 프로젝트는 **Firebase 키를 넣지 않아도 "데모 모드"로 정상 실행**됩니다(로그인 흐름은 그대로 통과, 리포트/알림은 목업 데이터). 실제 데이터로 동작시키려면:

1. [Firebase 콘솔](https://console.firebase.google.com)에서 프로젝트 생성
2. **Authentication** → 로그인 방법에서 "이메일/비밀번호", "Google" 활성화
3. **Firestore Database** 생성 (테스트 모드로 시작해도 됩니다)
4. **Storage** 활성화 (프로필 사진/리포트 파일용)
5. 프로젝트 설정 → 웹 앱 추가 → 발급된 설정값을 `.env.example`을 복사한 `.env` 파일에 채우기
6. `npm install` 후 다시 실행하면 자동으로 실제 Firebase에 연결됩니다.

Firestore 컬렉션 구조: `users`, `reports`, `notifications`, `fall_events`, `walking_data`, `settings` (스펙 문서 기준)

### Google 로그인 설정
`expo-auth-session`의 Google 프로바이더로 idToken을 받아 `src/services/authService.js`의 `signInWithGoogleIdToken(idToken)`에 넘겨주면 됩니다. Google Cloud Console에서 OAuth 클라이언트 ID(iOS/Android/Web)를 발급받아 `LoginScreen.js`의 `handleGoogleLogin`에 연결해주세요.

### 낙상 감지 → 푸시 알림 흐름
1. 라즈베리파이가 낙상을 감지하면 Firestore `fall_events`(또는 `notifications`) 컬렉션에 이벤트를 write
2. Cloud Function(또는 서버)이 해당 이용자의 보호자 토큰/구독 정보로 푸시 발송
   - 네이티브 앱(EAS Build 등): `users/{uid}.expoPushToken`으로 Expo Push API 발송
   - 웹(PWA, 아이폰 홈 화면 추가 포함): `users/{uid}.webPushSubscription`으로 `web-push` 라이브러리 발송 (자세한 설정은 위 "아이폰에서 푸시 알림 받기" 참고)
3. 앱은 로그인 시 `usePushRegistration` 훅으로 Expo 푸시 토큰을 자동 등록하고(네이티브 전용),
   웹에서는 설정 > 이용자 정보 수정 화면의 "이 기기에서 알림 받기" 버튼으로 웹 푸시 구독을 등록합니다.

## 텍스트 스펙과 비교해 이번에 수정한 부분

- **스플래시/시작 화면 분리**: 로고만 나오는 스플래시(2.2초 후 자동 전환) → 앱이름/태그라인/로그인·회원가입 버튼이 있는 시작 화면
- **Firebase 연동 골격 추가**: `src/services/firebase.js`, `authService.js`, `reportsService.js`, `notificationsService.js` — 키가 없으면 데모 모드로 자동 폴백
- **로그인/회원가입**: 실제 Firebase Authentication 호출 + 에러 처리 + 비밀번호 찾기 기능 연결
- **리포트 화면**: "오늘의 통계" 카드(총 보행 횟수 / 총 보행 거리 / 낙상 위험 횟수) 추가, Firestore에서 리포트 목록 조회
- **리포트 상세/업로드**: 스펙에 맞춰 날짜·시간·위치·이동거리·소모칼로리·메모 필드로 재구성, Firestore에 저장
- **알림 화면**: 낙상위험감지/급정지감지/장시간미사용/시스템알림 4종 지원, 읽음/안읽음 표시 및 탭 시 읽음 처리, 최신순 정렬
- **마이페이지(이용자)**: 통계를 총 보행횟수/총 이동거리/총 운동시간으로 변경, 메뉴를 내정보/이용자정보수정/이용방법/로그아웃/문의로 정리
- **마이페이지(보호자)**: 메뉴를 오늘의 보행기록/리포트조회/위치확인/긴급상황기록/문의로 정리, 이용자 위치 표시 추가
- **푸시 알림 등록**: 네이티브에서는 로그인 시 Expo 푸시 토큰을 자동 발급받아 Firestore에 저장. 웹(PWA)에서는 `public/sw.js` 서비스워커 + Web Push API로 별도 구현(설정 화면의 "이 기기에서 알림 받기" 버튼), `scripts/generate-vapid-keys.js` / `scripts/send-test-push.js`로 키 생성과 테스트 발송 가능

## 목업에 없어서 새로 디자인한 부분

- 마실 리포트 상세/업로드 화면의 지도 플레이스홀더 및 정보 리스트 레이아웃
- 낙상 알림 상세 화면 전체(배너, 지도, 액션 버튼)
- 보호자 전용 마이페이지(연결된 이용자 실시간 카드 + 메뉴 구성)
- 로그아웃 확인 모달 텍스트/버튼 배치
- 역할 선택 화면의 카드 스타일(선택 상태 표시)
