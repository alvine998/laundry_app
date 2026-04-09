import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import Toast from 'react-native-toast-message';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import normalize from 'react-native-normalize';
import { RootStackParamList } from '../types/navigation';
import { Button } from '../components/Button';
import { StorageService } from '../services/StorageService';
import { AuthService } from '../services/AuthService';

type Props = NativeStackScreenProps<RootStackParamList, 'OTP'>;

export const OTPScreen: React.FC<Props> = ({ route, navigation }) => {
  const { email, phone, type } = route.params;
  const [code, setCode] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const inputs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTextChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text.slice(-1); // Only keep the last digit
    setCode(newCode);

    if (text && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      // If current box is empty and backspace is hit, move to previous box and clear its content
      const newCode = [...code];
      newCode[index - 1] = '';
      setCode(newCode);
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const fullCode = code.join('');
    if (fullCode.length < 4) {
      Toast.show({
        type: 'error',
        text1: 'Kode belum lengkap!',
        text2: 'Mohon masukkan 4 digit kode OTP Anda.',
        position: 'top',
      });
      return;
    }

    setIsLoading(true);
    try {
      // Call Backend API
      const result = await AuthService.verifyOTP(phone, fullCode);

      // Save session to storage
      await StorageService.setUserSession({
        id: result.user?.id || 'id-' + Date.now(),
        email,
        type,
        name: result.user?.name || (type === 'partner' ? 'Partner Laundry' : 'Pelanggan'),
        loginDate: new Date().toISOString(),
        balance: result.user?.balance || (type === 'partner' ? 0 : 50000),
        loyaltyPoints: result.user?.loyalty_points || 0,
        token: result.token,
      });

      Toast.show({
        type: 'success',
        text1: 'Verifikasi Berhasil!',
        text2: 'Selamat datang di Laundry Now.',
        position: 'top',
      });

      // Reset navigation stack to the correct dashboard based on user type
      navigation.reset({
        index: 0,
        routes: [{ name: type === 'partner' ? 'PartnerHome' : 'CustomerHome' }],
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Verifikasi Gagal',
        text2: error.message || 'Kode OTP yang dimasukkan salah.',
        position: 'top',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer === 0) {
      setIsLoading(true);
      try {
        await AuthService.sendOTP(phone);
        setTimer(30);
        Toast.show({
          type: 'success',
          text1: 'Kode Dikirim Ulang',
          text2: `Kode baru telah dikirimkan ke nomor ${phone}.`,
          position: 'top',
        });
      } catch (error: any) {
        Toast.show({
          type: 'error',
          text1: 'Gagal Mengirim Kode',
          text2: error.message || 'Silakan coba lagi beberapa saat lagi.',
          position: 'top',
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={normalize(24)} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verifikasi Kode</Text>
        <View style={styles.placeholderIcon} />
      </View>

      <View style={styles.container}>
        <Text style={styles.titleText}>Masukkan Kode OTP</Text>
        <Text style={styles.subtitleText}>
          Kode 4 digit telah dikirim ke <Text style={styles.emailHighlight}>{email}</Text>
        </Text>

        <View style={styles.otpContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                inputs.current[index] = ref;
              }}
              style={[styles.otpInput, digit !== '' && styles.otpInputFilled]}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleTextChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              autoFocus={index === 0}
            />
          ))}
        </View>

        <View style={styles.timerContainer}>
          {timer > 0 ? (
            <Text style={styles.timerText}>
              Kirim ulang dalam <Text style={styles.timerHighlight}>{timer} detik</Text>
            </Text>
          ) : (
            <TouchableOpacity onPress={handleResend}>
              <Text style={styles.resendText}>Kirim ulang kode?</Text>
            </TouchableOpacity>
          )}
        </View>

        <Button title="Verifikasi" onPress={handleVerify} variant="primary" />
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
  titleText: {
    fontSize: normalize(24),
    fontWeight: '800',
    color: '#1C1C1E',
    marginBottom: normalize(8),
  },
  subtitleText: {
    fontSize: normalize(14),
    color: '#64748B',
    lineHeight: normalize(22),
    marginBottom: normalize(40),
  },
  emailHighlight: {
    color: '#1C1C1E',
    fontWeight: '700',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: normalize(40),
  },
  otpInput: {
    width: normalize(64),
    height: normalize(68),
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: normalize(16),
    fontSize: normalize(28),
    fontWeight: '800',
    textAlign: 'center',
    color: '#1C1C1E',
    backgroundColor: '#F8FAFC',
  },
  otpInputFilled: {
    borderColor: '#0084F4',
    backgroundColor: '#FFFFFF',
    shadowColor: '#0084F4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: normalize(32),
  },
  timerText: {
    fontSize: normalize(14),
    color: '#64748B',
  },
  timerHighlight: {
    color: '#0084F4',
    fontWeight: '700',
  },
  resendText: {
    fontSize: normalize(14),
    color: '#0084F4',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
