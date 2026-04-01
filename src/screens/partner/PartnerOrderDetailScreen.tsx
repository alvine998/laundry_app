import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Linking,
  Modal,
  TextInput,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import normalize from 'react-native-normalize';
import { RootStackParamList } from '../../types/navigation';
import Toast from 'react-native-toast-message';

type Props = NativeStackScreenProps<RootStackParamList, 'PartnerOrderDetail'>;

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
    case 'Batal': return { bg: '#FEE2E2', text: '#EF4444' };
    default: return { bg: '#F1F5F9', text: '#64748B' };
  }
};

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

export const PartnerOrderDetailScreen = ({ navigation, route }: Props) => {
  const { order } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'accept' | 'reject' | 'update'>('accept');
  const [actualWeight, setActualWeight] = useState('');

  const nextStatus = getNextStatus(order.status);
  const statusColors = getStatusColor(order.status);

  const handleCall = () => {
    Linking.openURL('tel:081234567890');
  };

  const handleWhatsApp = () => {
    Linking.openURL('whatsapp://send?phone=6281234567890');
  };

  const openModal = (type: 'accept' | 'reject' | 'update') => {
    setModalType(type);
    setActualWeight('');
    setModalVisible(true);
  };

  const handleConfirmAction = () => {
    setModalVisible(false);
    let message = '';
    const weightInfo = actualWeight ? ` dengan berat ${actualWeight} Kg` : '';
    
    if (modalType === 'accept') {
      message = `Pesanan ${order.id} berhasil diterima${weightInfo}!`;
    } else if (modalType === 'reject') {
      message = `Pesanan ${order.id} berhasil ditolak.`;
    } else {
      message = `Status pesanan ${order.id} berhasil diperbarui ke ${nextStatus}!`;
    }

    Toast.show({
      type: 'success',
      text1: message,
      position: 'bottom',
    });
    setTimeout(() => navigation.goBack(), 1000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={normalize(24)} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail Pesanan</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Status Card */}
        <View style={styles.statusSection}>
          <View style={styles.orderIdRow}>
            <Text style={styles.orderLabel}>ID Pesanan</Text>
            <Text style={styles.orderIdText}>{order.id}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
            <Text style={[styles.statusText, { color: statusColors.text }]}>{order.status}</Text>
          </View>
        </View>

        {/* Customer Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pelanggan</Text>
          <View style={styles.card}>
            <View style={styles.customerHeader}>
              <Ionicons name="person-circle" size={normalize(50)} color="#E2E8F0" />
              <View style={styles.customerInfo}>
                <Text style={styles.customerName}>{order.customer}</Text>
                <Text style={styles.customerPhone}>+62 812-3456-7890</Text>
              </View>
              <View style={styles.contactActions}>
                <TouchableOpacity style={styles.contactBtn} onPress={handleCall}>
                  <Ionicons name="call" size={normalize(20)} color="#0084F4" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.contactBtn, { marginLeft: 10 }]} onPress={handleWhatsApp}>
                  <MaterialCommunityIcons name="whatsapp" size={normalize(22)} color="#10B981" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.addressRow}>
              <Ionicons name="location" size={normalize(20)} color="#EF4444" />
              <Text style={styles.addressText}>Jl. Sudirman No. 45, Jakarta Selatan (Rumah Pagar Hitam)</Text>
            </View>
          </View>
        </View>

        {/* Service Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Layanan & Item</Text>
          <View style={styles.card}>
            <View style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{order.service}</Text>
                <Text style={styles.itemSub}>{order.weight} • Reguler (2 Hari)</Text>
              </View>
              <Text style={styles.itemPrice}>{order.price}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Pembayaran</Text>
              <Text style={styles.totalValue}>{order.price}</Text>
            </View>
            <View style={styles.paymentBadge}>
              <MaterialCommunityIcons name="wallet-outline" size={normalize(16)} color="#10B981" />
              <Text style={styles.paymentText}>Dibayar dengan Saldo</Text>
            </View>
          </View>
        </View>

        {/* Timeline Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Riwayat Status</Text>
          <View style={styles.card}>
            {[
              { time: '01 Apr, 10:30', status: 'Baru', desc: 'Pesanan dibuat oleh pelanggan' },
              order.status !== 'Baru' && { time: '01 Apr, 11:00', status: 'Pesanan Diterima', desc: 'Partner menyetujui pesanan' },
            ].filter(Boolean).map((step: any, index: number) => (
              <View key={index} style={styles.timelineItem}>
                <View style={styles.timelineLeading}>
                  <View style={[styles.timelineDot, { backgroundColor: index === 0 ? '#0084F4' : '#E2E8F0' }]} />
                  {index === 0 && <View style={styles.timelineLine} />}
                </View>
                <View style={styles.timelineBody}>
                  <Text style={styles.timelineStatus}>{step.status}</Text>
                  <Text style={styles.timelineDesc}>{step.desc}</Text>
                  <Text style={styles.timelineTime}>{step.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: normalize(100) }} />
      </ScrollView>

      {/* Action Footer */}
      {order.status !== 'Selesai' && order.status !== 'Batal' && (
        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.footerBtn, styles.declineBtn]}
            onPress={() => openModal('reject')}
          >
            <Text style={styles.declineText}>Tolak</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.footerBtn, styles.acceptBtn]}
            onPress={() => openModal(order.status === 'Baru' ? 'accept' : 'update')}
          >
            <Text style={styles.acceptText}>
              {order.status === 'Baru' ? 'Terima Pesanan' : `Update ke ${nextStatus}`}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Reusable Modal from List/Home */}
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
              {modalType === 'accept' ? 'Terima Pesanan?' : (modalType === 'reject' ? 'Tolak Pesanan?' : `Update ke ${nextStatus}?`)}
            </Text>
            
            <Text style={styles.modalSubtitle}>
              {modalType === 'accept' 
                ? `Apakah Anda yakin ingin menerima pesanan ${order.id} dari ${order.customer}?` 
                : (modalType === 'reject' 
                  ? `Pesanan ${order.id} akan dibatalkan. Berikan alasan penolakan kepada pelanggan.` 
                  : `Lanjutkan pesanan ${order.id} ke status ${nextStatus}?`)}
            </Text>

            {modalType === 'accept' && order.weight?.toLowerCase().includes('kg') && (
              <View style={styles.weightInputSection}>
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
                  {actualWeight && (
                    <Text style={styles.adjustmentHint}>
                      Selisih: {(parseFloat(actualWeight) - parseWeight(order.weight)).toFixed(1)} Kg
                    </Text>
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
                  modalType === 'accept' && order.weight?.toLowerCase().includes('kg') && !actualWeight && styles.modalConfirmBtnDisabled
                ]} 
                onPress={handleConfirmAction}
                disabled={modalType === 'accept' && order.weight?.toLowerCase().includes('kg') && !actualWeight}
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
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: normalize(20), paddingVertical: normalize(15), backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  backBtn: { padding: normalize(8) },
  headerTitle: { fontSize: normalize(17), fontWeight: '800', color: '#1C1C1E' },
  content: { padding: normalize(20) },
  statusSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', padding: normalize(20), borderRadius: normalize(24), marginBottom: normalize(25), shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  orderIdRow: { flex: 1 },
  orderLabel: { fontSize: normalize(12), color: '#94A3B8', fontWeight: '600' },
  orderIdText: { fontSize: normalize(16), fontWeight: '800', color: '#1C1C1E', marginTop: 2 },
  statusBadge: { paddingHorizontal: normalize(12), paddingVertical: normalize(6), borderRadius: normalize(10) },
  statusText: { fontSize: normalize(12), fontWeight: '800' },
  section: { marginBottom: normalize(25) },
  sectionTitle: { fontSize: normalize(14), fontWeight: '800', color: '#64748B', marginBottom: normalize(12), marginLeft: normalize(4) },
  card: { backgroundColor: '#FFFFFF', borderRadius: normalize(20), padding: normalize(20), shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  customerHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: normalize(15) },
  customerInfo: { flex: 1, marginLeft: normalize(15) },
  customerName: { fontSize: normalize(16), fontWeight: '800', color: '#1C1C1E' },
  customerPhone: { fontSize: normalize(13), color: '#64748B', marginTop: 2 },
  contactActions: { flexDirection: 'row' },
  contactBtn: { width: normalize(40), height: normalize(40), borderRadius: normalize(20), backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9' },
  addressRow: { flexDirection: 'row', alignItems: 'flex-start', paddingTop: normalize(15), borderTopWidth: 1, borderTopColor: '#F8FAFC' },
  addressText: { flex: 1, fontSize: normalize(13), color: '#475569', marginLeft: normalize(10), lineHeight: normalize(20), fontWeight: '500' },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: normalize(15) },
  itemInfo: { flex: 1 },
  itemName: { fontSize: normalize(15), fontWeight: '800', color: '#1C1C1E' },
  itemSub: { fontSize: normalize(12), color: '#94A3B8', marginTop: 2 },
  itemPrice: { fontSize: normalize(15), fontWeight: '800', color: '#1C1C1E' },
  divider: { height: 1, backgroundColor: '#F8FAFC', marginBottom: normalize(15) },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: normalize(12) },
  totalLabel: { fontSize: normalize(14), color: '#64748B', fontWeight: '700' },
  totalValue: { fontSize: normalize(18), fontWeight: '800', color: '#0084F4' },
  paymentBadge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', backgroundColor: '#F0FDF4', paddingHorizontal: normalize(10), paddingVertical: normalize(4), borderRadius: normalize(8) },
  paymentText: { fontSize: normalize(11), fontWeight: '700', color: '#10B981', marginLeft: normalize(6) },
  timelineItem: { flexDirection: 'row', minHeight: normalize(70) },
  timelineLeading: { alignItems: 'center', width: normalize(30) },
  timelineDot: { width: normalize(10), height: normalize(10), borderRadius: normalize(5), zIndex: 1 },
  timelineLine: { width: 2, flex: 1, backgroundColor: '#F1F5F9', marginVertical: -2 },
  timelineBody: { flex: 1, marginLeft: normalize(10), paddingBottom: normalize(20) },
  timelineStatus: { fontSize: normalize(14), fontWeight: '800', color: '#1C1C1E' },
  timelineDesc: { fontSize: normalize(12), color: '#64748B', marginTop: 4 },
  timelineTime: { fontSize: normalize(11), color: '#94A3B8', marginTop: 4 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFFFFF', padding: normalize(20), borderTopWidth: 1, borderTopColor: '#F1F5F9', flexDirection: 'row' },
  footerBtn: { flex: 1, height: normalize(52), borderRadius: normalize(14), justifyContent: 'center', alignItems: 'center' },
  declineBtn: { backgroundColor: '#FFF1F2', marginRight: normalize(12) },
  declineText: { color: '#F43F5E', fontWeight: '700', fontSize: normalize(15) },
  acceptBtn: { backgroundColor: '#0084F4' },
  acceptText: { color: '#FFFFFF', fontWeight: '700', fontSize: normalize(15) },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: normalize(20) },
  modalContent: { backgroundColor: '#FFFFFF', borderRadius: normalize(24), padding: normalize(24), width: '100%', alignItems: 'center' },
  modalIconContainer: { width: normalize(80), height: normalize(80), borderRadius: normalize(40), justifyContent: 'center', alignItems: 'center', marginBottom: normalize(20) },
  modalTitle: { fontSize: normalize(18), fontWeight: '800', color: '#1C1C1E', marginBottom: normalize(10) },
  modalSubtitle: { fontSize: normalize(14), color: '#64748B', textAlign: 'center', marginBottom: normalize(25), lineHeight: normalize(20) },
  weightInputSection: { width: '100%', marginBottom: normalize(20) },
  weightInputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', borderRadius: normalize(12), paddingHorizontal: normalize(16), height: normalize(52) },
  weightInput: { flex: 1, fontSize: normalize(18), fontWeight: '800', color: '#1C1C1E' },
  weightUnit: { fontSize: normalize(16), fontWeight: '700', color: '#64748B' },
  adjustmentHint: { fontSize: normalize(12), color: '#0084F4', marginTop: 8, fontWeight: '600', textAlign: 'center' },
  modalActions: { flexDirection: 'row', width: '100%' },
  modalCancelBtn: { flex: 1, height: normalize(50), borderRadius: normalize(14), backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginRight: normalize(10) },
  modalCancelText: { fontSize: normalize(15), fontWeight: '700', color: '#64748B' },
  modalConfirmBtn: { flex: 2, height: normalize(50), borderRadius: normalize(14), justifyContent: 'center', alignItems: 'center' },
  modalConfirmBtnDisabled: { backgroundColor: '#E2E8F0', opacity: 0.8 },
  modalConfirmText: { fontSize: normalize(15), fontWeight: '700', color: '#FFFFFF' },
});
