import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import normalize from 'react-native-normalize';
import Toast from 'react-native-toast-message';
import { RootStackParamList } from '../../types/navigation';
import { StorageService, UserSession } from '../../services/StorageService';

type Props = NativeStackScreenProps<RootStackParamList, 'Topup'>;

const PRESET_AMOUNTS = [20000, 50000, 100000, 200000, 500000];
const PAYMENT_METHODS = [
  { id: 'ovo', name: 'OVO', icon: 'wallet' },
  { id: 'dana', name: 'DANA', icon: 'credit-card' },
  { id: 'gopay', name: 'GoPay', icon: 'wallet-outline' },
  { id: 'qris', name: 'QRIS', icon: 'qrcode' },
  { id: 'bank', name: 'Transfer Bank', icon: 'bank' },
];

export const TopupScreen = ({ navigation }: Props) => {
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState('ovo');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchBalance = async () => {
      const session = await StorageService.getUserSession();
      if (session) {
        setBalance(session.balance || 0);
      }
    };
    fetchBalance();
  }, []);

  const formatNumber = (val: string) => {
    if (!val) return '';
    return val.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const formatCurrency = (val: string) => {
    if (!val) return '';
    const numericValue = val.replace(/[^0-9]/g, '');
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(parseInt(numericValue, 10));
  };

  const handleTopup = () => {
    const numericAmount = parseInt(amount.replace(/[^0-9]/g, ''), 10);
    if (!numericAmount || numericAmount < 10000) {
      Toast.show({
        type: 'error',
        text1: 'Minimal Top Up Rp 10.000',
        position: 'top',
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate Topup and Perform Persistence
    setTimeout(async () => {
      try {
        const session = await StorageService.getUserSession();
        if (session) {
          const updatedSession = {
            ...session,
            balance: (session.balance || 0) + numericAmount,
          };
          await StorageService.setUserSession(updatedSession);
          
          setIsProcessing(false);
          Toast.show({
            type: 'success',
            text1: 'Top Up Berhasil!',
            text2: `Saldo sebesar ${formatCurrency(amount)} telah ditambahkan ke Hub Anda.`,
            position: 'top',
          });
          navigation.goBack();
        }
      } catch (error) {
        setIsProcessing(false);
        Toast.show({
          type: 'error',
          text1: 'Terjadi Kesalahan',
          text2: 'Silakan coba lagi.',
          position: 'top',
        });
      }
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={normalize(24)} color="#1C1C1E" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Top Up Saldo</Text>
          <View style={{ width: normalize(44) }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Balance Card */}
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Saldo Saat Ini</Text>
            <Text style={styles.balanceValue}>Rp {balance.toLocaleString('id-ID')}</Text>
          </View>

          {/* Amount Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pilih Nominal</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.currencyPrefix}>Rp</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                keyboardType="numeric"
                value={formatNumber(amount.replace(/[^0-9]/g, ''))}
                onChangeText={(val) => setAmount(val.replace(/[^0-9]/g, ''))}
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.chipContainer}>
              {PRESET_AMOUNTS.map((val) => (
                <TouchableOpacity 
                  key={val} 
                  style={[
                    styles.chip,
                    amount.replace(/[^0-9]/g, '') === val.toString() && styles.chipActive
                  ]}
                  onPress={() => setAmount(val.toString())}
                >
                  <Text style={[
                    styles.chipText,
                    amount.replace(/[^0-9]/g, '') === val.toString() && styles.chipTextActive
                  ]}>
                    {val / 1000}k
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Payment Method Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Metode Pembayaran</Text>
            {PAYMENT_METHODS.map((method) => (
              <TouchableOpacity 
                key={method.id} 
                style={[
                  styles.methodItem,
                  selectedMethod === method.id && styles.methodActive
                ]}
                onPress={() => setSelectedMethod(method.id)}
              >
                <View style={styles.methodInfo}>
                  <View style={styles.methodIcon}>
                    <MaterialCommunityIcons name={method.icon as any} size={normalize(24)} color="#0084F4" />
                  </View>
                  <Text style={styles.methodName}>{method.name}</Text>
                </View>
                <Ionicons 
                  name={selectedMethod === method.id ? "radio-button-on" : "radio-button-off"} 
                  size={normalize(22)} 
                  color={selectedMethod === method.id ? "#0084F4" : "#E2E8F0"} 
                />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.confirmBtn, isProcessing && styles.confirmBtnDisabled]} 
            onPress={handleTopup}
            disabled={isProcessing}
          >
            <Text style={styles.confirmBtnText}>
              {isProcessing ? 'Memproses...' : 'Lanjut Pembayaran'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(15),
    backgroundColor: '#FFFFFF',
  },
  backBtn: {
    width: normalize(44),
    height: normalize(44),
    borderRadius: normalize(12),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: normalize(18),
    fontWeight: '800',
    color: '#1C1C1E',
  },
  scrollContent: {
    padding: normalize(20),
  },
  balanceCard: {
    backgroundColor: '#0084F4',
    borderRadius: normalize(24),
    padding: normalize(20),
    marginBottom: normalize(25),
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: normalize(14),
    fontWeight: '600',
    marginBottom: normalize(4),
  },
  balanceValue: {
    color: '#FFFFFF',
    fontSize: normalize(24),
    fontWeight: '800',
  },
  section: {
    marginBottom: normalize(30),
  },
  sectionTitle: {
    fontSize: normalize(16),
    fontWeight: '800',
    color: '#1C1C1E',
    marginBottom: normalize(15),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(16),
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(15),
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  currencyPrefix: {
    fontSize: normalize(20),
    fontWeight: '800',
    color: '#1C1C1E',
    marginRight: normalize(10),
  },
  input: {
    flex: 1,
    fontSize: normalize(24),
    fontWeight: '800',
    color: '#1C1C1E',
    padding: 0,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: normalize(15),
    gap: normalize(10),
  },
  chip: {
    paddingHorizontal: normalize(15),
    paddingVertical: normalize(10),
    borderRadius: normalize(12),
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minWidth: normalize(70),
    alignItems: 'center',
  },
  chipActive: {
    backgroundColor: '#DCFCE7',
    borderColor: '#10B981',
  },
  chipText: {
    fontSize: normalize(14),
    fontWeight: '700',
    color: '#64748B',
  },
  chipTextActive: {
    color: '#10B981',
  },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(16),
    padding: normalize(16),
    marginBottom: normalize(12),
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  methodActive: {
    borderColor: '#0084F4',
    backgroundColor: '#F0F9FF',
  },
  methodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodIcon: {
    width: normalize(44),
    height: normalize(44),
    borderRadius: normalize(12),
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalize(15),
  },
  methodName: {
    fontSize: normalize(15),
    fontWeight: '700',
    color: '#1C1C1E',
  },
  footer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(20),
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  confirmBtn: {
    backgroundColor: '#0084F4',
    paddingVertical: normalize(18),
    borderRadius: normalize(16),
    alignItems: 'center',
  },
  confirmBtnDisabled: {
    backgroundColor: '#94A3B8',
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontSize: normalize(16),
    fontWeight: '800',
  },
});
