import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import normalize from 'react-native-normalize';
import Toast from 'react-native-toast-message';
import { RootStackParamList } from '../../types/navigation';
import { StorageService } from '../../services/StorageService';

type Props = NativeStackScreenProps<RootStackParamList, 'Payment'>;

export const PaymentScreen = ({ navigation, route }: Props) => {
  const { totalAmount, serviceInfo, partnerInfo, estimatedPoints } = route.params;
  const [balance, setBalance] = useState(0);
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

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(val);
  };

  const handleConfirmPayment = async () => {
    if (balance < totalAmount) {
      Toast.show({
        type: 'error',
        text1: 'Saldo Tidak Cukup',
        text2: 'Silakan top up saldo Hub Anda terlebih dahulu.',
        position: 'bottom',
      });
      return;
    }

    setIsProcessing(true);
    try {
      const session = await StorageService.getUserSession();
      if (session) {
        const updatedSession = {
          ...session,
          balance: session.balance - totalAmount,
          loyaltyPoints: (session.loyaltyPoints || 0) + estimatedPoints,
        };
        await StorageService.setUserSession(updatedSession);
        
        // Create and Save Active Order
        const newOrder: any = {
          id: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          partnerId: partnerInfo.id,
          partnerName: partnerInfo.name,
          serviceName: serviceInfo.name,
          totalAmount: totalAmount,
          status: 'Pesanan Diterima',
          date: new Date().toLocaleString('id-ID', { 
            day: '2-digit', month: 'short', year: 'numeric', 
            hour: '2-digit', minute: '2-digit' 
          }),
          estimatedPoints: estimatedPoints,
        };
        await StorageService.addActiveOrder(newOrder);

        // Navigate to Success Screen
        navigation.replace('PaymentSuccess', { order: newOrder });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Terjadi Kesalahan',
        position: 'bottom',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={normalize(24)} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Konfirmasi Pembayaran</Text>
        <View style={{ width: normalize(44) }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Total Amount Card */}
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Total Pembayaran</Text>
          <Text style={styles.amountValue}>{formatCurrency(totalAmount)}</Text>
        </View>

        {/* Order Summary Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ringkasan Pesanan</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <View style={styles.serviceIconContainer}>
                <MaterialCommunityIcons name={serviceInfo.icon} size={normalize(24)} color="#0084F4" />
              </View>
              <View style={styles.serviceTextContainer}>
                <Text style={styles.serviceTitle}>{serviceInfo.name}</Text>
                <Text style={styles.partnerName}>{partnerInfo.name}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Rewards Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Loyalty Rewards</Text>
          <View style={styles.pointsCard}>
            <View style={styles.pointsInfo}>
              <MaterialCommunityIcons name="star-circle" size={normalize(32)} color="#F59E0B" />
              <View style={styles.pointsTextContainer}>
                <Text style={styles.pointsLabel}>Estimasi Poin Didapat</Text>
                <Text style={styles.pointsValue}>+{estimatedPoints} Poin</Text>
              </View>
            </View>
            <Text style={styles.pointsDesc}>Poin akan ditambahkan setelah pembayaran berhasil.</Text>
          </View>
        </View>

        {/* Wallet Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Metode Pembayaran</Text>
          <View style={styles.walletCard}>
            <View style={styles.walletInfo}>
              <MaterialCommunityIcons name="wallet-outline" size={normalize(24)} color="#0084F4" />
              <View style={styles.walletTextContainer}>
                <Text style={styles.walletLabel}>Saldo Hub Saya</Text>
                <Text style={styles.walletBalance}>{formatCurrency(balance)}</Text>
              </View>
            </View>
            {balance < totalAmount && (
              <TouchableOpacity onPress={() => navigation.navigate('Topup')}>
                <Text style={styles.topupLink}>Top Up</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Footer Payment Button */}
      <View style={styles.footer}>
        <View style={styles.footerInfo}>
          <Text style={styles.footerLabel}>Total Tagihan</Text>
          <Text style={styles.footerAmount}>{formatCurrency(totalAmount)}</Text>
        </View>
        <TouchableOpacity 
          style={[styles.payBtn, (balance < totalAmount || isProcessing) && styles.payBtnDisabled]} 
          onPress={handleConfirmPayment}
          disabled={balance < totalAmount || isProcessing}
        >
          <Text style={styles.payBtnText}>
            {isProcessing ? 'Memproses...' : 'Konfirmasi & Bayar'}
          </Text>
        </TouchableOpacity>
      </View>
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
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
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
  amountCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(24),
    padding: normalize(24),
    alignItems: 'center',
    marginBottom: normalize(24),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  amountLabel: {
    fontSize: normalize(14),
    color: '#64748B',
    fontWeight: '600',
    marginBottom: normalize(8),
  },
  amountValue: {
    fontSize: normalize(32),
    fontWeight: '900',
    color: '#1C1C1E',
  },
  section: {
    marginBottom: normalize(24),
  },
  sectionTitle: {
    fontSize: normalize(16),
    fontWeight: '800',
    color: '#1C1C1E',
    marginBottom: normalize(12),
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(20),
    padding: normalize(16),
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceIconContainer: {
    width: normalize(48),
    height: normalize(48),
    borderRadius: normalize(12),
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalize(16),
  },
  serviceTextContainer: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: normalize(15),
    fontWeight: '800',
    color: '#1C1C1E',
  },
  partnerName: {
    fontSize: normalize(13),
    color: '#64748B',
    fontWeight: '500',
    marginTop: normalize(2),
  },
  pointsCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: normalize(20),
    padding: normalize(20),
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  pointsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(12),
  },
  pointsTextContainer: {
    marginLeft: normalize(16),
  },
  pointsLabel: {
    fontSize: normalize(12),
    color: '#D97706',
    fontWeight: '600',
  },
  pointsValue: {
    fontSize: normalize(20),
    fontWeight: '800',
    color: '#F59E0B',
  },
  pointsDesc: {
    fontSize: normalize(12),
    color: '#92400E',
    opacity: 0.8,
    fontWeight: '500',
  },
  walletCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(20),
    padding: normalize(20),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  walletInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletTextContainer: {
    marginLeft: normalize(16),
  },
  walletLabel: {
    fontSize: normalize(12),
    color: '#64748B',
    fontWeight: '600',
  },
  walletBalance: {
    fontSize: normalize(16),
    fontWeight: '800',
    color: '#1C1C1E',
  },
  topupLink: {
    color: '#0084F4',
    fontWeight: '800',
    fontSize: normalize(14),
  },
  footer: {
    backgroundColor: '#FFFFFF',
    padding: normalize(20),
    paddingBottom: Platform.OS === 'ios' ? normalize(40) : normalize(20),
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerInfo: {
    flex: 1,
  },
  footerLabel: {
    fontSize: normalize(12),
    color: '#64748B',
    fontWeight: '600',
  },
  footerAmount: {
    fontSize: normalize(18),
    fontWeight: '900',
    color: '#0084F4',
  },
  payBtn: {
    backgroundColor: '#0084F4',
    paddingHorizontal: normalize(24),
    paddingVertical: normalize(14),
    borderRadius: normalize(16),
  },
  payBtnDisabled: {
    backgroundColor: '#CBD5E1',
  },
  payBtnText: {
    color: '#FFFFFF',
    fontSize: normalize(16),
    fontWeight: '800',
  },
});
