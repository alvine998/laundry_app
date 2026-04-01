import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import normalize from 'react-native-normalize';
import { PartnerHomeScreen } from '../screens/partner/PartnerHomeScreen';
import { PartnerHistoryScreen } from '../screens/partner/PartnerHistoryScreen';
import { PartnerWalletScreen } from '../screens/partner/PartnerWalletScreen';
import { PartnerProfileScreen } from '../screens/partner/PartnerProfileScreen';

export type PartnerTabParamList = {
  Beranda: undefined;
  Riwayat: undefined;
  Dompet: undefined;
  Profil: undefined;
};

const Tab = createBottomTabNavigator<PartnerTabParamList>();

export const PartnerTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'list';

          if (route.name === 'Beranda') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Riwayat') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Dompet') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          } else if (route.name === 'Profil') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={normalize(size)} color={color} />;
        },
        tabBarActiveTintColor: '#0084F4',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          height: normalize(65),
          paddingBottom: normalize(10),
          paddingTop: normalize(10),
          borderTopWidth: 1,
          borderTopColor: '#F1F5F9',
        },
        tabBarLabelStyle: {
          fontSize: normalize(12),
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen name="Beranda" component={PartnerHomeScreen} />
      <Tab.Screen name="Riwayat" component={PartnerHistoryScreen} />
      <Tab.Screen name="Dompet" component={PartnerWalletScreen} />
      <Tab.Screen name="Profil" component={PartnerProfileScreen} />
    </Tab.Navigator>
  );
};
