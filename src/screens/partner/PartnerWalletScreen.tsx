import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import normalize from 'react-native-normalize';
import Toast from 'react-native-toast-message';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { Button } from '../../components/Button';

type Props = NativeStackScreenProps<RootStackParamList, 'PartnerHome'>;

const { width } = Dimensions.get('window');

const WEEKLY_DATA = [
  { day: 'Sen', amount: 450000 },
  { day: 'Sel', amount: 620000 },
  { day: 'Rab', amount: 380000 },
  { day: 'Kam', amount: 510000 },
  { day: 'Jum', amount: 780000 },
  { day: 'Sab', amount: 950000 },
  { day: 'Min', amount: 820000 },
];

const TRANSACTIONS = [
  { id: 'TX-001', type: 'income', title: 'Orderan ORD-001', date: 'Hari ini, 10:30', amount: '+Rp 35.000', color: '#10B981' },
  { id: 'TX-002', type: 'income', title: 'Orderan ORD-002', date: 'Hari ini, 11:15', amount: '+Rp 80.000', color: '#10B981' },
  { id: 'TX-003', type: 'withdraw', title: 'Tarik Saldo ke BCA', date: 'Kemarin, 14:20', amount: '-Rp 1.500.000', color: '#EF4444' },
  { id: 'TX-004', type: 'income', title: 'Orderan ORD-003', date: 'Kemarin, 16:45', amount: '+Rp 45.000', color: '#10B981' },
];

export const PartnerWalletScreen = ({ navigation }: Props) => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const maxAmount = Math.max(...WEEKLY_DATA.map(d => d.amount));

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dompet Mitra</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0084F4']} tintColor="#0084F4" />
        }
      >
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceTop}>
            <View>
              <Text style={styles.balanceLabel}>Saldo Saat Ini</Text>
              <Text style={styles.balanceAmount}>Rp 4.250.000</Text>
            </View>
            <TouchableOpacity
              style={styles.withdrawHistoryBtn}
              onPress={() => navigation.navigate('RiwayatTarikSaldo')}
            >
              <MaterialCommunityIcons name="history" size={normalize(24)} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Button
            title="Tarik Saldo"
            variant="primary"
            style={styles.withdrawBtn}
            onPress={() => navigation.navigate('TarikSaldo')}
          />
        </View>

        {/* Weekly Stats Chart */}
        <View style={styles.statsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Statistik Pendapatan</Text>
            <View style={styles.periodBadge}>
              <Text style={styles.periodText}>Minggu Ini</Text>
            </View>
          </View>

          <View style={styles.chartContainer}>
            <View style={styles.chartYAxis}>
              <Text style={styles.yAxisLabel}>1M</Text>
              <Text style={styles.yAxisLabel}>500k</Text>
              <Text style={styles.yAxisLabel}>0</Text>
            </View>
            <View style={styles.chartBody}>
              {WEEKLY_DATA.map((item, index) => {
                const barHeight = (item.amount / maxAmount) * 150;
                return (
                  <View key={index} style={styles.chartBarItem}>
                    <View style={styles.barWrapper}>
                      <View
                        style={[
                          styles.barFill,
                          { height: barHeight, backgroundColor: index === 5 ? '#0084F4' : '#E2E8F0' }
                        ]}
                      />
                    </View>
                    <Text style={[styles.barLabel, index === 5 && styles.activeBarLabel]}>{item.day}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* Transaction History */}
        <View style={styles.transactionSection}>
          <Text style={styles.sectionTitle}>Transaksi Terakhir</Text>
          {TRANSACTIONS.map((tx) => (
            <View key={tx.id} style={styles.transactionCard}>
              <View style={[styles.txIcon, { backgroundColor: tx.type === 'income' ? '#DCFCE7' : '#FEE2E2' }]}>
                <MaterialCommunityIcons
                  name={tx.type === 'income' ? 'arrow-bottom-left' : 'arrow-top-right'}
                  size={normalize(20)}
                  color={tx.color}
                />
              </View>
              <View style={styles.txInfo}>
                <Text style={styles.txTitle}>{tx.title}</Text>
                <Text style={styles.txDate}>{tx.date}</Text>
              </View>
              <Text style={[styles.txAmount, { color: tx.color }]}>{tx.amount}</Text>
            </View>
          ))}
          <TouchableOpacity style={styles.viewMoreBtn} onPress={() => { navigation.navigate("Riwayat") }}>
            <Text style={styles.viewMoreText}>Lihat Semua Transaksi</Text>
          </TouchableOpacity>
        </View>

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
  content: { padding: normalize(20) },
  balanceCard: {
    backgroundColor: '#1E293B',
    borderRadius: normalize(24),
    padding: normalize(24),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  balanceTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: normalize(24),
  },
  balanceLabel: { fontSize: normalize(14), color: '#94A3B8', fontWeight: '600' },
  balanceAmount: { fontSize: normalize(28), fontWeight: '800', color: '#FFFFFF', marginTop: normalize(8) },
  withdrawHistoryBtn: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: normalize(10),
    borderRadius: normalize(12),
  },
  withdrawBtn: {
    backgroundColor: '#0084F4',
    height: normalize(52),
    borderRadius: normalize(16),
  },
  statsSection: {
    marginTop: normalize(32),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(20),
  },
  sectionTitle: { fontSize: normalize(16), fontWeight: '800', color: '#1C1C1E' },
  periodBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(6),
    borderRadius: normalize(10),
  },
  periodText: { fontSize: normalize(11), fontWeight: '800', color: '#0084F4' },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(24),
    padding: normalize(20),
    flexDirection: 'row',
    height: normalize(220),
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  chartYAxis: {
    justifyContent: 'space-between',
    paddingBottom: normalize(24),
    marginRight: normalize(12),
  },
  yAxisLabel: { fontSize: normalize(10), color: '#94A3B8', fontWeight: '700' },
  chartBody: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  chartBarItem: {
    alignItems: 'center',
    flex: 1,
  },
  barWrapper: {
    height: 150,
    width: normalize(12),
    backgroundColor: '#F8FAFC',
    borderRadius: normalize(6),
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: normalize(6),
  },
  barLabel: {
    fontSize: normalize(10),
    color: '#94A3B8',
    fontWeight: '700',
    marginTop: normalize(12),
  },
  activeBarLabel: { color: '#0084F4' },
  transactionSection: { marginTop: normalize(32) },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: normalize(12),
    borderRadius: normalize(16),
    marginBottom: normalize(12),
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  txIcon: {
    width: normalize(40),
    height: normalize(40),
    borderRadius: normalize(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  txInfo: { flex: 1, marginLeft: normalize(12) },
  txTitle: { fontSize: normalize(14), fontWeight: '700', color: '#1C1C1E' },
  txDate: { fontSize: normalize(12), color: '#94A3B8', marginTop: normalize(2) },
  txAmount: { fontSize: normalize(14), fontWeight: '800' },
  viewMoreBtn: {
    alignSelf: 'center',
    marginTop: normalize(12),
    padding: normalize(10),
  },
  viewMoreText: { fontSize: normalize(14), color: '#0084F4', fontWeight: '700' },
});
