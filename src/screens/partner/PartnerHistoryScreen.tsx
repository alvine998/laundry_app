import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import normalize from 'react-native-normalize';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';

const MOCK_HISTORY = [
  { id: 'ORD-001', customer: 'Budi Santoso', service: 'Cuci & Gosok', date: '31 Mar, 10:30', price: 'Rp 35.000', status: 'Selesai' },
  { id: 'ORD-002', customer: 'Siti Aminah', service: 'Bedding', date: '30 Mar, 14:15', price: 'Rp 80.000', status: 'Selesai' },
  { id: 'ORD-003', customer: 'Andi Pratama', service: 'Cuci Saja', date: '29 Mar, 09:45', price: 'Rp 25.000', status: 'Selesai' },
  { id: 'ORD-004', customer: 'Rina Wijaya', service: 'Expressed', date: '28 Mar, 16:20', price: 'Rp 50.000', status: 'Batal' },
  { id: 'ORD-005', customer: 'Eko Sulistyo', service: 'Cuci & Gosok', date: '27 Mar, 11:10', price: 'Rp 42.000', status: 'Selesai' },
];

export const PartnerHistoryScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [activeTab, setActiveTab] = useState<'Selesai' | 'Batal'>('Selesai');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const filteredHistory = MOCK_HISTORY.filter(h => h.status === activeTab);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Riwayat Pesanan</Text>
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'Selesai' && styles.activeTab]}
          onPress={() => setActiveTab('Selesai')}
        >
          <Text style={[styles.tabText, activeTab === 'Selesai' && styles.activeTabText]}>Selesai</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'Batal' && styles.activeTab]}
          onPress={() => setActiveTab('Batal')}
        >
          <Text style={[styles.tabText, activeTab === 'Batal' && styles.activeTabText]}>Batal</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0084F4']} tintColor="#0084F4" />
        }
      >
        {filteredHistory.map((item) => (
          <View key={item.id} style={styles.historyCard}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.orderId}>{item.id}</Text>
                <Text style={styles.dateText}>{item.date}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: item.status === 'Selesai' ? '#DCFCE7' : '#FEE2E2' }]}>
                <Text style={[styles.statusText, { color: item.status === 'Selesai' ? '#10B981' : '#EF4444' }]}>
                  {item.status}
                </Text>
              </View>
            </View>

            <View style={styles.cardBody}>
              <View style={styles.customerAvatar}>
                <Ionicons name="person-circle" size={normalize(40)} color="#E2E8F0" />
              </View>
              <View style={styles.orderInfo}>
                <Text style={styles.customerName}>{item.customer}</Text>
                <Text style={styles.serviceText}>{item.service}</Text>
              </View>
              <View style={styles.priceContainer}>
                <Text style={styles.priceLabel}>Penghasilan</Text>
                <Text style={styles.priceValue}>{item.price}</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.detailBtn}
              onPress={() => navigation.navigate('PartnerOrderDetail', { order: item })}
            >
              <Text style={styles.detailBtnText}>Lihat Rincian</Text>
              <Ionicons name="chevron-forward" size={normalize(14)} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        ))}

        {filteredHistory.length === 0 && (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="clipboard-text-outline" size={normalize(64)} color="#E2E8F0" />
            <Text style={styles.emptyTitle}>Belum ada riwayat</Text>
            <Text style={styles.emptySubtitle}>Pesanan yang {activeTab.toLowerCase()} akan muncul di sini.</Text>
          </View>
        )}

        <View style={{ height: normalize(40) }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(20),
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: { fontSize: normalize(18), fontWeight: '800', color: '#1C1C1E' },
  tabContainer: {
    flexDirection: 'row',
    padding: normalize(16),
    backgroundColor: '#FFFFFF',
  },
  tab: {
    flex: 1,
    paddingVertical: normalize(10),
    alignItems: 'center',
    borderRadius: normalize(12),
  },
  activeTab: { backgroundColor: '#F1F5F9' },
  tabText: { fontSize: normalize(14), fontWeight: '700', color: '#94A3B8' },
  activeTabText: { color: '#1C1C1E' },
  content: { padding: normalize(16) },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(20),
    padding: normalize(16),
    marginBottom: normalize(16),
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(16),
    paddingBottom: normalize(12),
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  orderId: { fontSize: normalize(12), fontWeight: '800', color: '#1C1C1E' },
  dateText: { fontSize: normalize(12), color: '#94A3B8', marginTop: normalize(2) },
  statusBadge: {
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(4),
    borderRadius: normalize(8),
  },
  statusText: { fontSize: normalize(10), fontWeight: '800' },
  cardBody: { flexDirection: 'row', alignItems: 'center' },
  customerAvatar: { marginRight: normalize(12) },
  orderInfo: { flex: 1 },
  customerName: { fontSize: normalize(15), fontWeight: '700', color: '#1C1C1E' },
  serviceText: { fontSize: normalize(13), color: '#64748B', marginTop: normalize(2) },
  priceContainer: { alignItems: 'flex-end' },
  priceLabel: { fontSize: normalize(10), color: '#94A3B8', fontWeight: '600' },
  priceValue: { fontSize: normalize(14), fontWeight: '800', color: '#10B981', marginTop: normalize(2) },
  detailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: normalize(16),
    paddingTop: normalize(12),
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  detailBtnText: { fontSize: normalize(13), fontWeight: '700', color: '#94A3B8' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: normalize(80) },
  emptyTitle: { fontSize: normalize(18), fontWeight: '800', color: '#1C1C1E', marginTop: normalize(16) },
  emptySubtitle: { fontSize: normalize(14), color: '#64748B', marginTop: normalize(8), textAlign: 'center' },
});
