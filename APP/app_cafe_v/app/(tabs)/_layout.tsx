import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthSession } from '@/src/auth/AuthProvider';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { token, isLoading } = useAuthSession();
  const isAuthed = !!token?.current;

  if (isLoading) return null;
  if (!isAuthed) return <Redirect href="/login" />;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Menu',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="restaurant-menu" size={size ?? 24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: 'Reservation',
          tabBarIcon: ({ color , size }) => <AntDesign name="book" size={size ?? 24} color={color} />,
        }}
      /> 
      <Tabs.Screen
        name="logout"
        options={{
          title: 'Logout',
          tabBarIcon: ({ color , size }) => <AntDesign name="logout" size={size ?? 24} color={color} />,
        }}
      />
    </Tabs>
  );
}
