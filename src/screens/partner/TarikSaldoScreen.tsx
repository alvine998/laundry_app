import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import normalize from 'react-native-normalize';
import { RootStackParamList } from '../../types/navigation';
import Toast from 'react-native-toast-message';

type Props = NativeStackScreenProps<RootStackParamList, 'TarikSaldo'>;

export const TarikSaldoScreen = ({ navigation }: Props) => {
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const balance = 4250000; // Mock current balance

  const formatNumber = (num: string) => {
    const cleaned = num.replace(/[^0-9]/g, '');
    return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const parseNumber = (formattedNum: string) => {
    return parseInt(formattedNum.replace(/\./g, ''), 10) || 0;
  };

  const handleAmountChange = (text: string) => {
    const formatted = formatNumber(text);
    setAmount(formatted);
  };

  const handleWithdraw = () => {
    const numericAmount = parseNumber(amount);
    
    if (!amount || numericAmount === 0) {
      Toast.show({ type: 'error', text1: 'Masukkan nominal penarikan' });
      return;
    }

    if (numericAmount < 50000) {
      Toast.show({ type: 'error', text1: 'Minimal penarikan Rp 50.000' });
      return;
    }

    if (numericAmount > balance) {
      Toast.show({ type: 'error', text1: 'Saldo tidak mencukupi' });
      return;
    }

    Alert.alert(
      'Konfirmasi Penarikan',
      `Anda akan menarik dana sebesar Rp ${numericAmount.toLocaleString('id-ID')} ke rekening BCA Anda. Lanjutkan?`,
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Tarik Saldo', 
          onPress: async () => {
            setIsProcessing(true);
            // Simulate API call
            setTimeout(() => {
              setIsProcessing(false);
              navigation.replace('WaitingWithdrawal', { amount: numericAmount });
            }, 1500);
          }
        },
      ]
    );
  };

  const setFullBalance = () => {
    setAmount(formatNumber(balance.toString()));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={normalize(22)} color="#1C1C1E" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tarik Saldo</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* balance info */}
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Total Saldo Tersedia</Text>
            <Text style={styles.balanceAmount}>Rp {balance.toLocaleString('id-ID')}</Text>
          </View>

          {/* Amount Input */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Nominal Penarikan</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.currencyPrefix}>Rp</Text>
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={handleAmountChange}
                placeholder="Minimal 50.000"
                keyboardType="numeric"
                placeholderTextColor="#CBD5E1"
                autoFocus
              />
              <TouchableOpacity onPress={setFullBalance}>
                <Text style={styles.maxText}>Tarik Semua</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.helperText}>Batas penarikan harian Rp 10.000.000</Text>
          </View>

          {/* Destination Account */}
          <View style={styles.accountSection}>
            <Text style={styles.inputLabel}>Rekening Tujuan</Text>
            <View style={styles.accountCard}>
              <View style={styles.bankIcon}>
                <MaterialCommunityIcons name="bank" size={normalize(24)} color="#0084F4" />
              </View>
              <View style={styles.accountInfo}>
                <Text style={styles.bankName}>Bank Central Asia (BCA)</Text>
                <Text style={styles.accountNumber}>8830 **** 5678</Text>
                <Text style={styles.accountHolder}>Budi Santoso</Text>
              </View>
            </View>
          </View>

          <View style={styles.termsBox}>
            <Ionicons name="information-circle-outline" size={normalize(18)} color="#64748B" />
            <Text style={styles.termsText}>
              Dana akan masuk ke rekening Anda dalam 1-2 hari kerja sesuai jadwal operasional bank.
            </Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.withdrawBtn, isProcessing && styles.withdrawBtnDisabled]}
            onPress={handleWithdraw}
            disabled={isProcessing}
          >
            <Text style={styles.withdrawBtnText}>
              {isProcessing ? 'Memproses...' : 'Ajukan Penarikan'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: normalize(20), paddingVertical: normalize(15), backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  backBtn: { padding: normalize(8) },
  headerTitle: { fontSize: normalize(17), fontWeight: '800', color: '#1C1C1E' },
  content: { padding: normalize(20) },
  balanceCard: { backgroundColor: '#1E293B', borderRadius: normalize(20), padding: normalize(24), marginBottom: normalize(32) },
  balanceLabel: { color: '#94A3B8', fontSize: normalize(13), fontWeight: '600' },
  balanceAmount: { color: '#FFFFFF', fontSize: normalize(28), fontWeight: '800', marginTop: normalize(8) },
  inputSection: { marginBottom: normalize(24) },
  inputLabel: { fontSize: normalize(13), fontWeight: '700', color: '#475569', marginBottom: normalize(12), textTransform: 'uppercase', letterSpacing: 1 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: normalize(16), paddingHorizontal: normalize(16), borderWidth: 2, borderColor: '#E2E8F0' },
  currencyPrefix: { fontSize: normalize(18), fontWeight: '700', color: '#1C1C1E', marginRight: normalize(8) },
  input: { flex: 1, paddingVertical: normalize(15), fontSize: normalize(20), fontWeight: '800', color: '#1C1C1E' },
  maxText: { fontSize: normalize(14), fontWeight: '700', color: '#0084F4' },
  helperText: { fontSize: normalize(12), color: '#94A3B8', marginTop: normalize(8), marginLeft: normalize(4) },
  accountSection: { marginBottom: normalize(24) },
  accountCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: normalize(16), padding: normalize(16), borderWidth: 1, borderColor: '#F1F5F9' },
  bankIcon: { width: normalize(48), height: normalize(48), backgroundColor: '#F0F9FF', borderRadius: normalize(12), justifyContent: 'center', alignItems: 'center' },
  accountInfo: { marginLeft: normalize(16) },
  bankName: { fontSize: normalize(15), fontWeight: '700', color: '#1C1C1E' },
  accountNumber: { fontSize: normalize(14), color: '#64748B', marginTop: 2 },
  accountHolder: { fontSize: normalize(13), color: '#94A3B8', marginTop: 2 },
  termsBox: { flexDirection: 'row', backgroundColor: '#F1F5F9', borderRadius: normalize(12), padding: normalize(12) },
  termsText: { flex: 1, fontSize: normalize(12), color: '#64748B', marginLeft: normalize(8), lineHeight: normalize(18) },
  footer: { padding: normalize(20), backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  withdrawBtn: { backgroundColor: '#0084F4', paddingVertical: normalize(16), borderRadius: normalize(16), alignItems: 'center' },
  withdrawBtnDisabled: { opacity: 0.6 },
  withdrawBtnText: { color: '#FFFFFF', fontSize: normalize(16), fontWeight: '700' },
});
