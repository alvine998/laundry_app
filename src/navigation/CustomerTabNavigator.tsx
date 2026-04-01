import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import normalize from 'react-native-normalize';
import { CustomerHomeScreen } from '../screens/customer/CustomerHomeScreen';
import { CustomerOrdersScreen } from '../screens/customer/CustomerOrdersScreen';
import { CustomerInboxScreen } from '../screens/customer/CustomerInboxScreen';
import { CustomerProfileScreen } from '../screens/customer/CustomerProfileScreen';

export type CustomerTabParamList = {
  Dashboard: undefined;
  Pesanan: undefined;
  Inbox: undefined;
  Profil: undefined;
};

const Tab = createBottomTabNavigator<CustomerTabParamList>();

export const CustomerTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'home';

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Pesanan') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'Inbox') {
            iconName = focused ? 'chatbubble' : 'chatbubble-outline';
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
      <Tab.Screen name="Dashboard" component={CustomerHomeScreen} />
      <Tab.Screen name="Pesanan" component={CustomerOrdersScreen} />
      <Tab.Screen name="Inbox" component={CustomerInboxScreen} />
      <Tab.Screen name="Profil" component={CustomerProfileScreen} />
    </Tab.Navigator>
  );
};
