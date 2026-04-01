import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import normalize from 'react-native-normalize';
import { RootStackParamList } from '../../types/navigation';
import { Button } from '../../components/Button';
import { StorageService } from '../../services/StorageService';
import { AuthService } from '../../services/AuthService';

type Props = NativeStackScreenProps<RootStackParamList, 'CustomerLogin'>;

export const CustomerLoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !email.includes('@')) {
      Toast.show({
        type: 'error',
        text1: 'Email tidak valid!',
        text2: 'Silakan masukkan email Anda yang benar.',
        position: 'top',
      });
      return;
    }

    navigation.navigate('OTP', { email, type: 'customer' });
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const user = await AuthService.signInWithGoogle();
      if (user) {
        await StorageService.setUserSession({
          id: user.uid,
          email: user.email || '',
          name: user.displayName || '',
          type: 'customer',
          loginDate: new Date().toISOString(),
          balance: 50000,
          loyaltyPoints: 0,
        });
        navigation.reset({
          index: 0,
          routes: [{ name: 'CustomerHome' }],
        });
      }
    } catch (error) {
      console.error('Google login failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={normalize(24)} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Masuk atau Daftar</Text>
        <View style={styles.placeholderIcon} />
      </View>

      <View style={styles.container}>
        <Text style={styles.welcomeText}>Halo, Pelanggan!</Text>
        <Text style={styles.subtitleText}>Gunakan email Anda untuk masuk atau mendaftar di Laundry Now.</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="nama@email.com"
            keyboardType="email-address"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
        </View>

        <Button title="Lanjut" onPress={handleLogin} variant="primary" />

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Atau masuk dengan</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity 
          style={styles.googleBtn} 
          onPress={handleGoogleLogin}
          disabled={isLoading}
        >
          <MaterialCommunityIcons name="google" size={normalize(24)} color="#1C1C1E" />
          <Text style={styles.googleBtnText}>Google</Text>
        </TouchableOpacity>

        <View style={styles.footerLinkContainer}>
          <Text style={styles.footerText}>
            Dengan masuk atau mendaftar, kamu menyetujui {' '}
            <Text style={styles.linkText}>Ketentuan Layanan</Text> dan {' '}
            <Text style={styles.linkText}>Kebijakan Privasi</Text> kami.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(16),
    paddingTop: normalize(12),
    paddingBottom: normalize(20),
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backButton: {
    padding: normalize(8),
  },
  headerTitle: {
    fontSize: normalize(18),
    fontWeight: '700',
    color: '#1C1C1E',
  },
  placeholderIcon: {
    width: normalize(40),
  },
  container: {
    flex: 1,
    paddingHorizontal: normalize(24),
    paddingTop: normalize(32),
  },
  welcomeText: {
    fontSize: normalize(28),
    fontWeight: '800',
    color: '#1C1C1E',
    marginBottom: normalize(8),
  },
  subtitleText: {
    fontSize: normalize(14),
    color: '#64748B',
    lineHeight: normalize(22),
    marginBottom: normalize(32),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: normalize(16),
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(14),
    marginBottom: normalize(32),
    backgroundColor: '#F8FAFC',
  },
  input: {
    flex: 1,
    fontSize: normalize(16),
    color: '#1C1C1E',
    height: normalize(40),
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: normalize(20),
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    marginHorizontal: normalize(16),
    fontSize: normalize(14),
    color: '#94A3B8',
    fontWeight: '600',
  },
  footerLinkContainer: {
    marginTop: 'auto',
    marginBottom: normalize(32),
  },
  footerText: {
    fontSize: normalize(12),
    color: '#64748B',
    textAlign: 'center',
    lineHeight: normalize(18),
  },
  linkText: {
    color: '#0084F4', 
    fontWeight: '600',
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: normalize(14),
    borderRadius: normalize(16),
  },
  googleBtnText: {
    marginLeft: normalize(10),
    color: '#1C1C1E',
    fontSize: normalize(15),
    fontWeight: '700',
  },
});
