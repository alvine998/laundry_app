import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  BackHandler,
  RefreshControl,
  Switch,
  Modal,
  TextInput,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import normalize from 'react-native-normalize';
import { RootStackParamList } from '../../types/navigation';
import { PartnerTabParamList } from '../../navigation/PartnerTabNavigator';
import { StorageService } from '../../services/StorageService';

type Props = CompositeScreenProps<
  BottomTabScreenProps<PartnerTabParamList, 'Beranda'>,
  NativeStackScreenProps<RootStackParamList>
>;

const MOCK_ORDERS = [
  { id: 'ORD-001', customer: 'Budi Santoso', service: 'Cuci & Gosok', weight: '5kg', status: 'Baru', price: 'Rp 35.000' },
  { id: 'ORD-002', customer: 'Siti Aminah', service: 'Bedding', weight: '2set', status: 'Proses', price: 'Rp 80.000' },
];

const parsePrice = (priceStr: string) => {
  return parseInt(priceStr.replace(/[^0-9]/g, ''), 10);
};

const parseWeight = (weightStr: string) => {
  return parseFloat(weightStr.replace(/[^0-9.]/g, ''));
};

const formatCurrency = (num: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(Math.abs(num));
};

const ORDER_STATUS_SEQUENCE = ['Baru', 'Pesanan Diterima', 'Penjemputan', 'Proses', 'Pengantaran', 'Selesai'];

const getNextStatus = (currentStatus: string) => {
  const currentIndex = ORDER_STATUS_SEQUENCE.indexOf(currentStatus);
  if (currentIndex === -1 || currentIndex === ORDER_STATUS_SEQUENCE.length - 1) return null;
  return ORDER_STATUS_SEQUENCE[currentIndex + 1];
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Baru': return { bg: '#DBEAFE', text: '#0084F4' };
    case 'Pesanan Diterima': return { bg: '#E0F2FE', text: '#0EA5E9' };
    case 'Penjemputan': return { bg: '#F0F9FF', text: '#0084F4' };
    case 'Proses': return { bg: '#FEF3C7', text: '#F59E0B' };
    case 'Pengantaran': return { bg: '#FDF2F8', text: '#DB2777' };
    case 'Selesai': return { bg: '#DCFCE7', text: '#10B981' };
    default: return { bg: '#F1F5F9', text: '#64748B' };
  }
};

export const PartnerHomeScreen = ({ navigation }: Props) => {
  const [isOnline, setIsOnline] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'accept' | 'reject' | 'update'>('accept');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [actualWeight, setActualWeight] = useState('');
  const backPressCount = useRef(0);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate data fetching
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const openModal = (type: 'accept' | 'reject' | 'update', order: any) => {
    setModalType(type);
    setSelectedOrder(order);
    setActualWeight('');
    setModalVisible(true);
  };

  const handleConfirmAction = () => {
    setModalVisible(false);
    let message = '';
    const weightInfo = actualWeight ? ` dengan berat ${actualWeight} Kg` : '';
    
    if (modalType === 'accept') {
      const isWeightBased = selectedOrder?.weight?.toLowerCase().includes('kg');
      let adjustmentMsg = '';
      
      if (isWeightBased && actualWeight) {
        const estWeight = parseWeight(selectedOrder.weight);
        const estPrice = parsePrice(selectedOrder.price);
        const pricePerKg = estPrice / estWeight;
        const actWeight = parseFloat(actualWeight);
        const diff = actWeight - estWeight;
        const adjustment = diff * pricePerKg;

        if (adjustment > 0) {
          adjustmentMsg = `. Sisa bayar: ${formatCurrency(adjustment)}`;
        } else if (adjustment < 0) {
          adjustmentMsg = `. Kembali saldo: ${formatCurrency(adjustment)}`;
        }
      }
      
      message = `Pesanan ${selectedOrder?.id} berhasil diterima${weightInfo}${adjustmentMsg}!`;
    } else if (modalType === 'reject') {
      message = `Pesanan ${selectedOrder?.id} berhasil ditolak.`;
    } else {
      const nextStatus = getNextStatus(selectedOrder?.status);
      message = `Status pesanan ${selectedOrder?.id} berhasil diperbarui ke ${nextStatus}!`;
    }

    Toast.show({
      type: 'success',
      text1: message,
      position: 'bottom',
    });
  };

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (backPressCount.current === 0) {
          backPressCount.current = 1;
          Toast.show({
            type: 'info',
            text1: 'Tekan sekali lagi untuk keluar',
            position: 'bottom',
            visibilityTime: 2000,
          });
          setTimeout(() => {
            backPressCount.current = 0;
          }, 2000);
          return true;
        } else {
          BackHandler.exitApp();
          return true;
        }
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );

      return () => backHandler.remove();
    }, [])
  );

  const handleLogout = async () => {
    await StorageService.clearSession();
    navigation.getParent()?.reset({
      index: 0,
      routes: [{ name: 'Onboarding' }],
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0084F4']} tintColor="#0084F4" />
        }
      >
        {/* Header - Mitra Info & Status */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.welcomeText}>Halo, Mitra Perkasa!</Text>
              <Text style={styles.dateText}>Selasa, 31 Maret 2026</Text>
            </View>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
              <MaterialCommunityIcons name="logout" size={normalize(24)} color="#1C1C1E" />
            </TouchableOpacity>
          </View>

          <View style={styles.statusCard}>
            <View style={styles.statusInfo}>
              <Text style={styles.statusTitle}>Status Toko</Text>
              <Text style={[styles.statusValue, { color: isOnline ? '#10B981' : '#EF4444' }]}>
                {isOnline ? 'Online - Menerima Pesanan' : 'Offline - Istirahat'}
              </Text>
            </View>
            <Switch
              trackColor={{ false: '#E2E8F0', true: '#DCFCE7' }}
              thumbColor={isOnline ? '#10B981' : '#FFFFFF'}
              onValueChange={setIsOnline}
              value={isOnline}
            />
          </View>
        </View>

        {/* Earnings Section */}
        <View style={styles.earningsSection}>
          <View style={styles.earningsCard}>
            <View style={styles.earningsTop}>
              <View>
                <Text style={styles.earningsLabel}>Pendapatan Hari Ini</Text>
                <Text style={styles.earningsAmount}>Rp 450.000</Text>
              </View>
              <TouchableOpacity style={styles.withdrawBtn} onPress={() => { navigation.navigate("TarikSaldo") }}>
                <Text style={styles.withdrawText}>Tarik Saldo</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Selesai</Text>
                <Text style={styles.statValue}>12</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Rating</Text>
                <View style={styles.ratingRow}>
                  <Text style={styles.statValue}>4.9</Text>
                  <Ionicons name="star" size={normalize(14)} color="#F59E0B" style={{ marginLeft: 4 }} />
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Batalkan</Text>
                <Text style={[styles.statValue, { color: '#EF4444' }]}>0</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Order Management */}
        <View style={styles.orderSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pesanan Terbaru</Text>
            <TouchableOpacity onPress={() => navigation.navigate('PartnerOrderList')}>
              <Text style={styles.seeAllText}>Lihat Pesanan Lainnya</Text>
            </TouchableOpacity>
          </View>

          {MOCK_ORDERS.map((order) => {
            const nextStatus = getNextStatus(order.status);
            const statusColors = getStatusColor(order.status);
            return (
              <TouchableOpacity 
                key={order.id} 
                style={styles.orderCard}
                onPress={() => navigation.navigate('PartnerOrderDetail', { order })}
              >
                <View style={styles.orderHeader}>
                  <Text style={styles.orderId}>{order.id}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
                    <Text style={[styles.statusText, { color: statusColors.text }]}>
                      {order.status}
                    </Text>
                  </View>
                </View>
                <View style={styles.orderBody}>
                  <Ionicons name="person-circle" size={normalize(40)} color="#E2E8F0" />
                  <View style={styles.orderInfo}>
                    <Text style={styles.customerName}>{order.customer}</Text>
                    <Text style={styles.serviceInfo}>{order.service} • {order.weight}</Text>
                  </View>
                  <Text style={styles.orderPrice}>{order.price}</Text>
                </View>
                <View style={styles.orderActions}>
                  {order.status !== 'Selesai' && order.status !== 'Batal' && (
                    <>
                      <TouchableOpacity 
                        style={[styles.actionBtn, styles.declineBtn]}
                        onPress={() => openModal('reject', order)}
                      >
                        <Text style={styles.declineText}>Tolak</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[styles.actionBtn, styles.acceptBtn]}
                        onPress={() => openModal(order.status === 'Baru' ? 'accept' : 'update', order)}
                      >
                        <Text style={styles.acceptText}>
                          {order.status === 'Baru' ? 'Terima' : `Update ke ${nextStatus}`}
                        </Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: normalize(40) }} />
      </ScrollView>

      {/* Action Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={[styles.modalIconContainer, { backgroundColor: modalType === 'reject' ? '#FEE2E2' : '#DBEAFE' }]}>
              <MaterialCommunityIcons 
                name={modalType === 'reject' ? 'close-circle' : (modalType === 'accept' ? 'check-circle' : 'refresh-circle')} 
                size={normalize(48)} 
                color={modalType === 'reject' ? '#EF4444' : '#0084F4'} 
              />
            </View>
            
            <Text style={styles.modalTitle}>
              {modalType === 'accept' ? 'Terima Pesanan?' : (modalType === 'reject' ? 'Tolak Pesanan?' : `Update ke ${getNextStatus(selectedOrder?.status)}?`)}
            </Text>
            
            <Text style={styles.modalSubtitle}>
              {modalType === 'accept' 
                ? `Apakah Anda yakin ingin menerima pesanan ${selectedOrder?.id} dari ${selectedOrder?.customer}?` 
                : (modalType === 'reject' 
                  ? `Pesanan ${selectedOrder?.id} akan dibatalkan. Berikan alasan penolakan kepada pelanggan.` 
                  : `Lanjutkan pesanan ${selectedOrder?.id} ke status ${getNextStatus(selectedOrder?.status)}?`)}
            </Text>

            {modalType === 'accept' && selectedOrder?.weight?.toLowerCase().includes('kg') && (
              <View style={styles.weightInputSection}>
                <View style={styles.weightInputContainer}>
                  <Text style={styles.weightLabel}>Input Berat Aktual (Kg)</Text>
                  <View style={styles.weightInputWrapper}>
                    <TextInput
                      style={styles.weightInput}
                      placeholder="0.0"
                      keyboardType="numeric"
                      value={actualWeight}
                      onChangeText={setActualWeight}
                      placeholderTextColor="#94A3B8"
                    />
                    <Text style={styles.weightUnit}>Kg</Text>
                  </View>
                </View>

                {actualWeight && (
                  <View style={styles.adjustmentPreview}>
                    <View style={styles.adjustmentRow}>
                      <Text style={styles.adjustmentLabel}>Estimasi Pelanggan:</Text>
                      <Text style={styles.adjustmentValue}>{selectedOrder?.weight}</Text>
                    </View>
                    <View style={styles.adjustmentRow}>
                      <Text style={styles.adjustmentLabel}>Selisih:</Text>
                      <Text style={[
                        styles.adjustmentValue, 
                        { color: parseFloat(actualWeight) - parseWeight(selectedOrder.weight) > 0 ? '#F59E0B' : '#10B981' }
                      ]}>
                        {parseFloat(actualWeight) - parseWeight(selectedOrder.weight) > 0 ? '+' : ''}
                        {(parseFloat(actualWeight) - parseWeight(selectedOrder.weight)).toFixed(1)} Kg
                      </Text>
                    </View>
                    <View style={[
                      styles.adjustmentResult, 
                      { backgroundColor: parseFloat(actualWeight) - parseWeight(selectedOrder.weight) > 0 ? '#FFF7ED' : '#F0FDF4' }
                    ]}>
                      <Text style={[
                        styles.adjustmentResultText,
                        { color: parseFloat(actualWeight) - parseWeight(selectedOrder.weight) > 0 ? '#C2410C' : '#15803D' }
                      ]}>
                        {parseFloat(actualWeight) - parseWeight(selectedOrder.weight) > 0 
                          ? `Sisa Bayar: ${formatCurrency((parseFloat(actualWeight) - parseWeight(selectedOrder.weight)) * (parsePrice(selectedOrder.price) / parseWeight(selectedOrder.weight)))}` 
                          : parseFloat(actualWeight) - parseWeight(selectedOrder.weight) < 0
                          ? `Kembali Saldo: ${formatCurrency((parseFloat(actualWeight) - parseWeight(selectedOrder.weight)) * (parsePrice(selectedOrder.price) / parseWeight(selectedOrder.weight)))}`
                          : 'Berat Pas'}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.modalCancelBtn} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.modalConfirmBtn, 
                  { backgroundColor: modalType === 'reject' ? '#EF4444' : '#0084F4' },
                  modalType === 'accept' && selectedOrder?.weight?.toLowerCase().includes('kg') && !actualWeight && styles.modalConfirmBtnDisabled
                ]} 
                onPress={handleConfirmAction}
                disabled={modalType === 'accept' && selectedOrder?.weight?.toLowerCase().includes('kg') && !actualWeight}
              >
                <Text style={styles.modalConfirmText}>Konfirmasi</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: normalize(20),
    paddingTop: normalize(20),
    paddingBottom: normalize(24),
    borderBottomLeftRadius: normalize(32),
    borderBottomRightRadius: normalize(32),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(24),
  },
  welcomeText: {
    fontSize: normalize(22),
    fontWeight: '800',
    color: '#1C1C1E',
  },
  dateText: {
    fontSize: normalize(13),
    color: '#64748B',
    marginTop: normalize(4),
    fontWeight: '600',
  },
  logoutBtn: {
    padding: normalize(8),
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: normalize(16),
    borderRadius: normalize(16),
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    fontSize: normalize(12),
    color: '#64748B',
    fontWeight: '700',
    marginBottom: normalize(2),
  },
  statusValue: {
    fontSize: normalize(14),
    fontWeight: '800',
  },
  earningsSection: {
    marginTop: normalize(-10),
    paddingHorizontal: normalize(20),
  },
  earningsCard: {
    backgroundColor: '#1E293B',
    borderRadius: normalize(24),
    padding: normalize(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  earningsTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(20),
    paddingBottom: normalize(20),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  earningsLabel: {
    fontSize: normalize(12),
    color: '#94A3B8',
    fontWeight: '600',
  },
  earningsAmount: {
    fontSize: normalize(24),
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: normalize(4),
  },
  withdrawBtn: {
    backgroundColor: '#0084F4',
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(10),
    borderRadius: normalize(12),
  },
  withdrawText: {
    color: '#FFFFFF',
    fontSize: normalize(13),
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: normalize(10),
    color: '#94A3B8',
    fontWeight: '600',
    marginBottom: normalize(4),
  },
  statValue: {
    fontSize: normalize(16),
    fontWeight: '800',
    color: '#FFFFFF',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    height: normalize(24),
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  orderSection: {
    marginTop: normalize(32),
    paddingHorizontal: normalize(20),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(16),
  },
  sectionTitle: {
    fontSize: normalize(18),
    fontWeight: '800',
    color: '#1C1C1E',
  },
  seeAllText: {
    fontSize: normalize(14),
    color: '#0084F4',
    fontWeight: '700',
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(20),
    padding: normalize(16),
    marginBottom: normalize(16),
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(12),
  },
  orderId: {
    fontSize: normalize(12),
    fontWeight: '800',
    color: '#64748B',
  },
  statusBadge: {
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(6),
    borderRadius: normalize(10),
  },
  statusText: {
    fontSize: normalize(11),
    fontWeight: '800',
  },
  orderBody: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: normalize(12),
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F8FAFC',
  },
  orderInfo: {
    flex: 1,
    marginLeft: normalize(12),
  },
  customerName: {
    fontSize: normalize(15),
    fontWeight: '700',
    color: '#1C1C1E',
  },
  serviceInfo: {
    fontSize: normalize(13),
    color: '#64748B',
    marginTop: normalize(2),
  },
  orderPrice: {
    fontSize: normalize(15),
    fontWeight: '800',
    color: '#1C1C1E',
  },
  orderActions: {
    flexDirection: 'row',
    marginTop: normalize(16),
  },
  actionBtn: {
    flex: 1,
    paddingVertical: normalize(12),
    borderRadius: normalize(12),
    alignItems: 'center',
  },
  declineBtn: {
    backgroundColor: '#FFF1F2',
    marginRight: normalize(12),
  },
  declineText: {
    color: '#F43F5E',
    fontWeight: '700',
    fontSize: normalize(14),
  },
  acceptBtn: {
    backgroundColor: '#0084F4',
  },
  acceptText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: normalize(14),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: normalize(20),
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(24),
    padding: normalize(24),
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
  },
  modalIconContainer: {
    width: normalize(90),
    height: normalize(90),
    borderRadius: normalize(45),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: normalize(20),
  },
  modalTitle: {
    fontSize: normalize(20),
    fontWeight: '800',
    color: '#1C1C1E',
    marginBottom: normalize(12),
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: normalize(14),
    color: '#64748B',
    textAlign: 'center',
    lineHeight: normalize(20),
    marginBottom: normalize(32),
  },
  modalActions: {
    flexDirection: 'row',
    width: '100%',
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: normalize(14),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: normalize(10),
    borderRadius: normalize(14),
    backgroundColor: '#F1F5F9',
  },
  modalCancelText: {
    fontSize: normalize(15),
    fontWeight: '700',
    color: '#64748B',
  },
  modalConfirmBtn: {
    flex: 2,
    paddingVertical: normalize(14),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: normalize(14),
  },
  modalConfirmBtnDisabled: {
    backgroundColor: '#E2E8F0',
    opacity: 0.8,
  },
  modalConfirmText: {
    fontSize: normalize(15),
    fontWeight: '700',
    color: '#FFFFFF',
  },
  weightInputSection: {
    width: '100%',
    marginBottom: normalize(24),
  },
  weightInputContainer: {
    marginBottom: normalize(16),
  },
  weightLabel: {
    fontSize: normalize(13),
    fontWeight: '700',
    color: '#64748B',
    marginBottom: normalize(8),
  },
  weightInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: normalize(12),
    paddingHorizontal: normalize(16),
    height: normalize(52),
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  weightInput: {
    flex: 1,
    fontSize: normalize(18),
    fontWeight: '800',
    color: '#1C1C1E',
  },
  weightUnit: {
    fontSize: normalize(16),
    fontWeight: '700',
    color: '#64748B',
    marginLeft: normalize(8),
  },
  adjustmentPreview: {
    backgroundColor: '#F8FAFC',
    borderRadius: normalize(16),
    padding: normalize(16),
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  adjustmentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: normalize(8),
  },
  adjustmentLabel: {
    fontSize: normalize(12),
    color: '#64748B',
    fontWeight: '600',
  },
  adjustmentValue: {
    fontSize: normalize(12),
    color: '#1C1C1E',
    fontWeight: '700',
  },
  adjustmentResult: {
    padding: normalize(12),
    borderRadius: normalize(10),
    marginTop: normalize(8),
    alignItems: 'center',
  },
  adjustmentResultText: {
    fontSize: normalize(14),
    fontWeight: '800',
  },
});
