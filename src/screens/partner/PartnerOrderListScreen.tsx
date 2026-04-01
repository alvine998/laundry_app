import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
} from 'react-native';
import Toast from 'react-native-toast-message';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import normalize from 'react-native-normalize';
import { RootStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'PartnerOrderList'>;

const TABS = ['Semua', 'Baru', 'Pesanan Diterima', 'Penjemputan', 'Proses', 'Pengantaran', 'Selesai', 'Batal'];

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
    case 'Batal': return { bg: '#FEE2E2', text: '#EF4444' };
    default: return { bg: '#F1F5F9', text: '#64748B' };
  }
};

const MOCK_ORDERS = [
  { id: 'ORD-001', customer: 'Budi Santoso', service: 'Cuci & Gosok', weight: '5kg', status: 'Baru', price: 'Rp 35.000', date: '01 Apr, 10:30' },
  { id: 'ORD-002', customer: 'Siti Aminah', service: 'Bedding', weight: '2set', status: 'Proses', price: 'Rp 80.000', date: '01 Apr, 09:15' },
  { id: 'ORD-004', customer: 'Rina Wijaya', service: 'Expressed', weight: '2kg', status: 'Selesai', price: 'Rp 50.000', date: '31 Mar, 16:20' },
  { id: 'ORD-005', customer: 'Eko Sulistyo', service: 'Cuci & Gosok', weight: '6kg', status: 'Batal', price: 'Rp 42.000', date: '31 Mar, 11:10' },
  { id: 'ORD-006', customer: 'Lina Marlina', service: 'Cuci & Gosok', weight: '4kg', status: 'Baru', price: 'Rp 28.000', date: '01 Apr, 11:00' },
];

export const PartnerOrderListScreen = ({ navigation }: Props) => {
  const [activeTab, setActiveTab] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'accept' | 'reject' | 'update'>('accept');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [actualWeight, setActualWeight] = useState('');

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

  const filteredOrders = MOCK_ORDERS.filter(order => {
    const matchesTab = activeTab === 'Semua' || order.status === activeTab;
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const renderOrderItem = ({ item }: { item: typeof MOCK_ORDERS[0] }) => {
    const colors = getStatusColor(item.status);

    return (
      <TouchableOpacity 
        style={styles.orderCard}
        onPress={() => navigation.navigate('PartnerOrderDetail', { order: item })}
      >
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderId}>{item.id}</Text>
            <Text style={styles.orderDate}>{item.date}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: colors.bg }]}>
            <Text style={[styles.statusText, { color: colors.text }]}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.orderBody}>
          <View style={styles.customerAvatar}>
            <Ionicons name="person-circle" size={normalize(44)} color="#E2E8F0" />
          </View>
          <View style={styles.orderInfo}>
            <Text style={styles.customerName}>{item.customer}</Text>
            <Text style={styles.serviceInfo}>{item.service} • {item.weight}</Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.priceValue}>{item.price}</Text>
          </View>
        </View>

        <View style={styles.orderFooter}>
          {item.status !== 'Selesai' && item.status !== 'Batal' && (
            <View style={styles.orderActions}>
              <TouchableOpacity 
                style={[styles.actionBtn, styles.declineBtn]}
                onPress={() => openModal('reject', item)}
              >
                <Text style={styles.declineText}>Tolak</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionBtn, styles.acceptBtn]}
                onPress={() => openModal(item.status === 'Baru' ? 'accept' : 'update', item)}
              >
                <Text style={styles.acceptText}>
                  {item.status === 'Baru' ? 'Terima' : `Update ke ${getNextStatus(item.status)}`}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.detailBtn}>
            <Text style={styles.detailBtnText}>Lihat Rincian</Text>
            <Ionicons name="chevron-forward" size={normalize(16)} color="#64748B" />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={normalize(24)} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Daftar Pesanan</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={normalize(20)} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari ID Pesanan atau Nama Pelanggan"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#94A3B8"
          />
        </View>
      </View>

      <View style={styles.tabSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabContainer}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredOrders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="clipboard-text-outline" size={normalize(64)} color="#E2E8F0" />
            <Text style={styles.emptyTitle}>Tidak ada pesanan</Text>
            <Text style={styles.emptySubtitle}>Pesanan dengan status "{activeTab}" tidak ditemukan.</Text>
          </View>
        }
      />

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
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
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
  backBtn: { padding: normalize(8) },
  headerTitle: { fontSize: normalize(18), fontWeight: '800', color: '#1C1C1E' },

  searchSection: {
    padding: normalize(20),
    backgroundColor: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: normalize(12),
    paddingHorizontal: normalize(12),
    height: normalize(44),
  },
  searchInput: {
    flex: 1,
    marginLeft: normalize(10),
    fontSize: normalize(14),
    color: '#1C1C1E',
  },

  tabSection: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  tabContainer: {
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(12),
  },
  tab: {
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(8),
    borderRadius: normalize(20),
    marginRight: normalize(10),
    backgroundColor: '#F1F5F9',
  },
  activeTab: { backgroundColor: '#0084F4' },
  tabText: { fontSize: normalize(13), fontWeight: '700', color: '#64748B' },
  activeTabText: { color: '#FFFFFF' },

  listContent: { padding: normalize(20) },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(20),
    padding: normalize(16),
    marginBottom: normalize(16),
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: normalize(12),
    paddingBottom: normalize(12),
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  orderId: { fontSize: normalize(13), fontWeight: '800', color: '#1C1C1E' },
  orderDate: { fontSize: normalize(11), color: '#94A3B8', marginTop: 2 },
  statusBadge: {
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(4),
    borderRadius: normalize(8),
  },
  statusText: { fontSize: normalize(11), fontWeight: '800' },

  orderBody: { flexDirection: 'row', alignItems: 'center' },
  customerAvatar: { marginRight: normalize(12) },
  orderInfo: { flex: 1 },
  customerName: { fontSize: normalize(15), fontWeight: '700', color: '#1C1C1E' },
  serviceInfo: { fontSize: normalize(12), color: '#64748B', marginTop: 2 },
  priceContainer: { alignItems: 'flex-end' },
  priceValue: { fontSize: normalize(14), fontWeight: '800', color: '#0084F4' },

  orderFooter: {
    marginTop: normalize(12),
    paddingTop: normalize(12),
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  orderActions: {
    flexDirection: 'row',
    marginBottom: normalize(12),
  },
  actionBtn: {
    flex: 1,
    paddingVertical: normalize(10),
    borderRadius: normalize(10),
    alignItems: 'center',
  },
  declineBtn: {
    backgroundColor: '#FFF1F2',
    marginRight: normalize(10),
  },
  declineText: {
    color: '#F43F5E',
    fontWeight: '700',
    fontSize: normalize(13),
  },
  acceptBtn: {
    backgroundColor: '#0084F4',
  },
  acceptText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: normalize(13),
  },
  detailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: normalize(4),
  },
  detailBtnText: {
    fontSize: normalize(13),
    fontWeight: '700',
    color: '#64748B',
    marginRight: 4,
  },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: normalize(80),
  },
  emptyTitle: {
    fontSize: normalize(18),
    fontWeight: '800',
    color: '#1C1C1E',
    marginTop: normalize(16),
  },
  emptySubtitle: {
    fontSize: normalize(14),
    color: '#64748B',
    marginTop: normalize(8),
    textAlign: 'center',
    paddingHorizontal: normalize(40),
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
