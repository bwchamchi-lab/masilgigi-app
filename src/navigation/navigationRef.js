import { createNavigationContainerRef } from '@react-navigation/native';

// App.js의 알림 탭 리스너처럼 화면(컴포넌트) 밖에서 navigate가 필요한 경우 이 ref를 사용합니다.
export const navigationRef = createNavigationContainerRef();

export function navigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}
