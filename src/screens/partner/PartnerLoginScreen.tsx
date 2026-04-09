import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import normalize from 'react-native-normalize';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList } from '../../types/navigation';
import { Button } from '../../components/Button';
import { StorageService } from '../../services/StorageService';
import { AuthService } from '../../services/AuthService';

type Props = NativeStackScreenProps<RootStackParamList, 'PartnerLogin'>;

export const PartnerLoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !email.includes('@')) {
      Toast.show({
        type: 'error',
        text1: 'Email tidak valid!',
        text2: 'Mohon masukkan email Mitra yang terdaftar.',
        position: 'top',
      });
      return;
    }

    if (!password.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Password wajib diisi!',
        position: 'top',
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await AuthService.login({ email, password });
      
      Toast.show({
        type: 'success',
        text1: 'Login Berhasil!',
        text2: 'Mohon masukkan kode verifikasi.',
        position: 'top',
      });

      // Now navigates to OTP with phone from result
      navigation.navigate('OTP', { 
        email, 
        phone: result.phone || '08123456789', // Fallback for testing
        type: 'partner' 
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Gagal Masuk',
        text2: error.message || 'Email atau password mitra salah.',
        position: 'top',
      });
    } finally {
      setIsLoading(false);
    }
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
          type: 'partner',
          loginDate: new Date().toISOString(),
          balance: 0,
          loyaltyPoints: 0,
        });
        navigation.reset({
          index: 0,
          routes: [{ name: 'PartnerHome' }],
        });
      }
    } catch (error) {
      console.error('Partner Google login failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.areaView}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={normalize(24)} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Login Mitra</Text>
        <View style={styles.placeholderIcon} />
      </View>

      <View style={styles.container}>
        <Text style={styles.welcomeText}>Halo, Mitra Hebat!</Text>
        <Text style={styles.subtitleText}>Gunakan email terdaftar Anda untuk mengelola orderan hari ini di Laundry Now.</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Alamat Email Mitra</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="mitra@laundry.com"
              keyboardType="email-address"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Password Mitra</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Masukkan password Anda"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons 
                name={showPassword ? "eye-off-outline" : "eye-outline"} 
                size={normalize(20)} 
                color="#64748B" 
              />
            </TouchableOpacity>
          </View>
        </View>

        <Button 
          title={isLoading ? "Memproses..." : "Lanjut ke Dashboard"} 
          onPress={handleLogin} 
          variant="secondary" 
          disabled={isLoading}
        />

        <View style={styles.divider}>
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
            Belum jadi Mitra? {' '}
            <Text style={styles.linkText} onPress={() => navigation.navigate('PartnerRegister')}>
              Daftar Sekarang
            </Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  areaView: {
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
  formGroup: {
    marginBottom: normalize(32),
  },
  label: {
    fontSize: normalize(14),
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: normalize(8),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: normalize(16),
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(14),
    backgroundColor: '#F8FAFC',
  },
  input: {
    flex: 1,
    fontSize: normalize(16),
    color: '#1C1C1E',
    height: normalize(40),
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: normalize(24),
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
    fontSize: normalize(14),
    color: '#64748B',
    textAlign: 'center',
  },
  linkText: {
    color: '#0084F4', 
    fontWeight: '700',
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
