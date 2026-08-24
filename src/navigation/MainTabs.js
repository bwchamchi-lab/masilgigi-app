import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import ReportListScreen from '../screens/ReportListScreen';
import AlertListScreen from '../screens/AlertListScreen';
import MyPageScreen from '../screens/MyPageScreen';
import GuardianMyPageScreen from '../screens/GuardianMyPageScreen';
import { colors } from '../theme/theme';
import { useAuth } from '../context/AuthContext';

const Tab = createBottomTabNavigator();

const icons = {
  Report: { active: 'document-text', inactive: 'document-text-outline' },
  Alert: { active: 'notifications', inactive: 'notifications-outline' },
  Settings: { active: 'person', inactive: 'person-outline' },
};

export default function MainTabs() {
  const { role } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.teal,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { height: 62, paddingTop: 6, paddingBottom: 8 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ focused, color, size }) => {
          const set = icons[route.name];
          return <Ionicons name={focused ? set.active : set.inactive} size={size ?? 22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Report" component={ReportListScreen} options={{ title: '리포트' }} />
      <Tab.Screen name="Alert" component={AlertListScreen} options={{ title: '긴급알림' }} />
      <Tab.Screen
        name="Settings"
        component={role === 'guardian' ? GuardianMyPageScreen : MyPageScreen}
        options={{ title: '설정' }}
      />
    </Tab.Navigator>
  );
}
