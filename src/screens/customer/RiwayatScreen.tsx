import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import normalize from 'react-native-normalize';
import { RootStackParamList } from '../../types/navigation';
import { StorageService, ActiveOrder } from '../../services/StorageService';

type Props = NativeStackScreenProps<RootStackParamList, 'Riwayat'>;

const MOCK_TRANSACTIONS = [
  { id: 'TX-001', type: 'topup', title: 'Top Up OVO', amount: 50000, date: '31 Mar 2026, 14:20', status: 'Selesai' },
  { id: 'TX-002', type: 'payment', title: 'Cuci & Gosok 5kg', amount: -35000, date: '30 Mar 2026, 09:15', status: 'Selesai' },
  { id: 'TX-003', type: 'topup', title: 'Top Up GoPay', amount: 100000, date: '28 Mar 2026, 18:45', status: 'Selesai' },
  { id: 'TX-004', type: 'payment', title: 'Bedding Set Large', amount: -80000, date: '27 Mar 2026, 11:30', status: 'Selesai' },
  { id: 'TX-005', type: 'topup', title: 'Top Up DANA', amount: 20000, date: '25 Mar 2026, 08:10', status: 'Selesai' },
];

const MOCK_POINT_TRANSACTIONS = [
  { id: 'PX-001', title: 'Poin dari Pesanan #TX-002', amount: 35, date: '30 Mar 2026, 09:15', status: 'Selesai' },
  { id: 'PX-002', title: 'Poin dari Pesanan #TX-004', amount: 80, date: '27 Mar 2026, 11:30', status: 'Selesai' },
  { id: 'PX-003', title: 'Bonus Pengguna Baru', amount: 100, date: '20 Mar 2026, 10:00', status: 'Selesai' },
];

const TABS = ['Semua', 'Pesanan', 'Saldo', 'Poin'];

export const RiwayatScreen = ({ navigation, route }: Props) => {
  const [activeTab, setActiveTab] = useState(route.params?.initialTab || 'Semua');
  const [refreshing, setRefreshing] = useState(false);
  const [activeOrders, setActiveOrders] = useState<ActiveOrder[]>([]);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const orders = await StorageService.getActiveOrders();
        setActiveOrders(orders);
      };
      fetchData();
    }, [])
  );

  const filteredData = activeTab === 'Poin' 
    ? MOCK_POINT_TRANSACTIONS 
    : activeTab === 'Pesanan'
    ? activeOrders
    : [...activeOrders.map(o => ({ ...o, type: 'payment', title: o.serviceName, amount: -o.totalAmount })), ...MOCK_TRANSACTIONS].filter((item) => {
        if (activeTab === 'Semua') return true;
        if (activeTab === 'Saldo') return (item as any).amount !== undefined; // Show all cash transactions
        return true;
      });

  const onRefresh = () => {
    setRefreshing(true);
    const fetchData = async () => {
      const orders = await StorageService.getActiveOrders();
      setActiveOrders(orders);
      setRefreshing(false);
    };
    fetchData();
  };

  const renderItem = ({ item }: { item: any }) => {
    const isPoint = activeTab === 'Poin';
    const isActiveOrder = item.status && item.status !== 'Selesai';
    const isIncome = isPoint ? item.amount > 0 : item.amount > 0;
    
    // Determine title for active order if not present
    const itemTitle = item.title || item.serviceName || 'Layanan Laundry';
    const itemAmount = Math.abs(item.amount || item.totalAmount || 0);

    return (
      <TouchableOpacity 
        style={styles.transactionItem}
        onPress={() => {
          if (isActiveOrder || activeTab === 'Pesanan') {
            navigation.navigate('OrderTracking', { orderId: item.id });
          }
        }}
        activeOpacity={isActiveOrder ? 0.7 : 1}
      >
        <View style={[styles.iconContainer, { backgroundColor: isPoint ? '#FFFBEB' : (isActiveOrder ? '#EFF6FF' : (isIncome ? '#DCFCE7' : '#F1F5F9')) }]}>
          <MaterialCommunityIcons 
            name={isPoint ? "star-circle" : (isActiveOrder ? "washing-machine" : (isIncome ? "wallet-plus" : "basket-check"))} 
            size={normalize(24)} 
            color={isPoint ? "#F59E0B" : (isActiveOrder ? "#0084F4" : (isIncome ? "#10B981" : "#64748B"))} 
          />
        </View>
        <View style={styles.itemContent}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemTitle}>{itemTitle}</Text>
            <Text style={[styles.amountText, { color: isPoint ? '#F59E0B' : (isIncome ? '#10B981' : '#1C1C1E') }]}>
              {isPoint 
                ? `+${item.amount} Poin` 
                : `${isIncome ? '+' : '-'}${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(itemAmount)}`
              }
            </Text>
          </View>
          <View style={styles.itemFooter}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemDate}>{item.date}</Text>
              {isActiveOrder && (
                <Text style={styles.trackLink}>Klik untuk lacak</Text>
              )}
            </View>
            <View style={[styles.statusBadge, { backgroundColor: item.status === 'Selesai' ? '#F0FDF4' : '#EFF6FF' }]}>
              <Text style={[styles.statusText, { color: item.status === 'Selesai' ? '#16A34A' : '#0084F4' }]}>
                {item.status}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={normalize(24)} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Riwayat & Poin</Text>
        <View style={{ width: normalize(44) }} />
      </View>

      {/* Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.tabScroll}
        contentContainerStyle={styles.tabContainer}
      >
        {TABS.map((tab) => (
          <TouchableOpacity 
            key={tab} 
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0084F4']} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="file-search-outline" size={normalize(60)} color="#E2E8F0" />
            <Text style={styles.emptyText}>Tidak ada riwayat transaksi</Text>
          </View>
        }
      />
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
  tabScroll: {
    backgroundColor: '#FFFFFF',
    maxHeight: normalize(60),
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(12),
  },
  tab: {
    paddingHorizontal: normalize(18),
    paddingVertical: normalize(8),
    borderRadius: normalize(20),
    marginRight: normalize(10),
    backgroundColor: '#F1F5F9',
  },
  tabActive: {
    backgroundColor: '#0084F4',
  },
  tabText: {
    fontSize: normalize(14),
    fontWeight: '600',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: normalize(20),
  },
  transactionItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(20),
    padding: normalize(16),
    marginBottom: normalize(15),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  iconContainer: {
    width: normalize(52),
    height: normalize(52),
    borderRadius: normalize(16),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalize(15),
  },
  itemContent: {
    flex: 1,
    justifyContent: 'center',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(6),
  },
  itemTitle: {
    fontSize: normalize(15),
    fontWeight: '800',
    color: '#1C1C1E',
  },
  amountText: {
    fontSize: normalize(15),
    fontWeight: '800',
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemDate: {
    fontSize: normalize(12),
    color: '#94A3B8',
    fontWeight: '500',
  },
  trackLink: {
    fontSize: normalize(12),
    color: '#0084F4',
    fontWeight: '700',
    marginTop: normalize(2),
  },
  statusBadge: {
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(4),
    borderRadius: normalize(8),
  },
  statusText: {
    fontSize: normalize(11),
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: normalize(100),
  },
  emptyText: {
    marginTop: normalize(15),
    color: '#94A3B8',
    fontSize: normalize(15),
    fontWeight: '600',
  },
});
