import React, { useEffect, useState } from 'react';
import { StatusBar, View, StyleSheet, Text, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import normalize from 'react-native-normalize';

import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { CustomerLoginScreen } from './src/screens/customer/CustomerLoginScreen';
import { PartnerLoginScreen } from './src/screens/partner/PartnerLoginScreen';
import { PartnerRegisterScreen } from './src/screens/partner/PartnerRegisterScreen';
import { EditProfilPartnerScreen } from './src/screens/partner/EditProfilPartnerScreen';
import { PengaturanTokoScreen } from './src/screens/partner/PengaturanTokoScreen';
import { KelolaLayananScreen } from './src/screens/partner/KelolaLayananScreen';
import { UlasanPelangganScreen } from './src/screens/partner/UlasanPelangganScreen';
import { TarikSaldoScreen } from './src/screens/partner/TarikSaldoScreen';
import { RiwayatTarikSaldoScreen } from './src/screens/partner/RiwayatTarikSaldoScreen';
import { WaitingWithdrawalScreen } from './src/screens/partner/WaitingWithdrawalScreen';
import { DetailRiwayatTarikSaldoScreen } from './src/screens/partner/DetailRiwayatTarikSaldoScreen';
import { PartnerOrderListScreen } from './src/screens/partner/PartnerOrderListScreen';
import { PartnerOrderDetailScreen } from './src/screens/partner/PartnerOrderDetailScreen';
import { CustomerTabNavigator } from './src/navigation/CustomerTabNavigator';
import { PartnerTabNavigator } from './src/navigation/PartnerTabNavigator';
import { StorageService } from './src/services/StorageService';
import { OTPScreen } from './src/screens/OTPScreen';
import { MapPickerScreen } from './src/screens/MapPickerScreen';
import { TopupScreen } from './src/screens/customer/TopupScreen';
import { RiwayatScreen } from './src/screens/customer/RiwayatScreen';
import { NearbyLaundryScreen } from './src/screens/customer/NearbyLaundryScreen';
import { ServiceOrderScreen } from './src/screens/customer/ServiceOrderScreen';
import { PaymentScreen } from './src/screens/customer/PaymentScreen';
import { PaymentSuccessScreen } from './src/screens/customer/PaymentSuccessScreen';
import { OrderTrackingScreen } from './src/screens/customer/OrderTrackingScreen';
import { PartnerListScreen } from './src/screens/customer/PartnerListScreen';
import { PartnerDetailScreen } from './src/screens/customer/PartnerDetailScreen';
import { InboxDetailScreen } from './src/screens/customer/InboxDetailScreen';
import { EditProfileScreen } from './src/screens/customer/EditProfileScreen';
import { AlamatSayaScreen } from './src/screens/customer/AlamatSayaScreen';
import { ManageAlamatScreen } from './src/screens/customer/ManageAlamatScreen';
import { VoucherSayaScreen } from './src/screens/customer/VoucherSayaScreen';
import { PusatBantuanScreen } from './src/screens/PusatBantuanScreen';
import { SyaratKetentuanScreen } from './src/screens/SyaratKetentuanScreen';
import { KebijakanPrivasiScreen } from './src/screens/KebijakanPrivasiScreen';
import { PromoSpesialScreen } from './src/screens/customer/PromoSpesialScreen';

// Ensure the app remains readable but layout is protected from extreme scaling
if ((Text as any).defaultProps == null) {
  (Text as any).defaultProps = {};
}
(Text as any).defaultProps.maxFontSizeMultiplier = 1.2;

if ((TextInput as any).defaultProps == null) {
  (TextInput as any).defaultProps = {};
}
(TextInput as any).defaultProps.maxFontSizeMultiplier = 1.2;

import { RootStackParamList } from './src/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList>('Onboarding');

  useEffect(() => {
    const checkSession = async () => {
      const session = await StorageService.getUserSession();
      if (session) {
        setInitialRoute(session.type === 'partner' ? 'PartnerHome' : 'CustomerHome');
      }
      setIsLoading(false);
    };

    checkSession();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0084F4" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={styles.globalWrapper}>
        <StatusBar
          barStyle={'dark-content'}
          backgroundColor="#FFFFFF"
        />
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={initialRoute}
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
            }}
          >
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="CustomerLogin" component={CustomerLoginScreen} />
            <Stack.Screen name="PartnerLogin" component={PartnerLoginScreen} />
            <Stack.Screen name="PartnerRegister" component={PartnerRegisterScreen} />
            <Stack.Screen name="OTP" component={OTPScreen} />
            <Stack.Screen name="CustomerHome" component={CustomerTabNavigator} />
            <Stack.Screen name="PartnerHome" component={PartnerTabNavigator} />
            <Stack.Screen name="MapPicker" component={MapPickerScreen} />
            <Stack.Screen name="Topup" component={TopupScreen} />
            <Stack.Screen name="Riwayat" component={RiwayatScreen} />
            <Stack.Screen name="NearbyLaundry" component={NearbyLaundryScreen} />
            <Stack.Screen name="PartnerList" component={PartnerListScreen} />
            <Stack.Screen name="PartnerDetail" component={PartnerDetailScreen} />
            <Stack.Screen name="ServiceOrder" component={ServiceOrderScreen} />
            <Stack.Screen name="Payment" component={PaymentScreen} />
            <Stack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} />
            <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
            <Stack.Screen name="InboxDetail" component={InboxDetailScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="AlamatSaya" component={AlamatSayaScreen} />
            <Stack.Screen name="ManageAlamat" component={ManageAlamatScreen} />
            <Stack.Screen name="VoucherSaya" component={VoucherSayaScreen} />
            <Stack.Screen name="PusatBantuan" component={PusatBantuanScreen} />
            <Stack.Screen name="SyaratKetentuan" component={SyaratKetentuanScreen} />
            <Stack.Screen name="KebijakanPrivasi" component={KebijakanPrivasiScreen} />
            <Stack.Screen name="PromoSpesial" component={PromoSpesialScreen} />
            <Stack.Screen name="EditProfilPartner" component={EditProfilPartnerScreen} />
            <Stack.Screen name="PengaturanToko" component={PengaturanTokoScreen} />
            <Stack.Screen name="KelolaLayanan" component={KelolaLayananScreen} />
            <Stack.Screen name="UlasanPelanggan" component={UlasanPelangganScreen} />
            <Stack.Screen name="TarikSaldo" component={TarikSaldoScreen} />
            <Stack.Screen name="RiwayatTarikSaldo" component={RiwayatTarikSaldoScreen} />
            <Stack.Screen name="WaitingWithdrawal" component={WaitingWithdrawalScreen} />
            <Stack.Screen name="DetailRiwayatTarikSaldo" component={DetailRiwayatTarikSaldoScreen} />
            <Stack.Screen name="PartnerOrderList" component={PartnerOrderListScreen} />
            <Stack.Screen name="PartnerOrderDetail" component={PartnerOrderDetailScreen} />
          </Stack.Navigator>
        </NavigationContainer>
        <Toast />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  globalWrapper: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: normalize(20)
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});
