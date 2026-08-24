import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/SplashScreen';
import StartScreen from '../screens/StartScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import UserTypeScreen from '../screens/UserTypeScreen';
import MainTabs from './MainTabs';
import ReportDetailScreen from '../screens/ReportDetailScreen';
import UploadReportScreen from '../screens/UploadReportScreen';
import AlertDetailScreen from '../screens/AlertDetailScreen';
import EditUserInfoScreen from '../screens/EditUserInfoScreen';
import { navigationRef } from './navigationRef';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Start" component={StartScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="UserType" component={UserTypeScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="ReportDetail" component={ReportDetailScreen} />
        <Stack.Screen name="UploadReport" component={UploadReportScreen} />
        <Stack.Screen name="AlertDetail" component={AlertDetailScreen} />
        <Stack.Screen name="EditUserInfo" component={EditUserInfoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
