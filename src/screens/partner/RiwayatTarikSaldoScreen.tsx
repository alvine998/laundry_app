import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import normalize from 'react-native-normalize';
import { RootStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'RiwayatTarikSaldo'>;

const MOCK_WITHDRAWALS = [
  { id: 'WD-001', amount: 'Rp 1.500.000', date: 'Kemarin, 14:20', status: 'Berhasil', bank: 'BCA', acc: '8830 **** 5678', color: '#10B981', bgColor: '#DCFCE7' },
  { id: 'WD-002', amount: 'Rp 500.000', date: '28 Mar, 10:30', status: 'Berhasil', bank: 'BCA', acc: '8830 **** 5678', color: '#10B981', bgColor: '#DCFCE7' },
  { id: 'WD-003', amount: 'Rp 2.000.000', date: '25 Mar, 09:15', status: 'Proses', bank: 'BCA', acc: '8830 **** 5678', color: '#0084F4', bgColor: '#DBEAFE' },
  { id: 'WD-004', amount: 'Rp 750.000', date: '20 Mar, 16:45', status: 'Gagal', bank: 'BCA', acc: '8830 **** 5678', color: '#EF4444', bgColor: '#FEE2E2' },
];

export const RiwayatTarikSaldoScreen = ({ navigation }: Props) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={normalize(22)} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Riwayat Penarikan</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {MOCK_WITHDRAWALS.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.withdrawalCard}
            onPress={() => navigation.navigate('DetailRiwayatTarikSaldo', { withdrawal: item })}
            activeOpacity={0.7}
          >
            <View style={styles.cardHeader}>
              <View style={styles.bankTag}>
                <MaterialCommunityIcons name="bank" size={normalize(14)} color="#64748B" />
                <Text style={styles.bankText}>{item.bank} • {item.acc}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: item.bgColor }]}>
                <Text style={[styles.statusText, { color: item.color }]}>{item.status}</Text>
              </View>
            </View>

            <View style={styles.cardBody}>
              <View>
                <Text style={styles.amountLabel}>Nominal Penarikan</Text>
                <Text style={styles.amountValue}>{item.amount}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.footerRow}>
                <Text style={styles.dateText}>{item.date}</Text>
                <Text style={styles.idText}>ID: {item.id}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.infoBox}>
          <Ionicons name="help-circle-outline" size={normalize(18)} color="#94A3B8" />
          <Text style={styles.infoText}>
            Ada kendala dengan penarikan? Hubungi Pusat Bantuan Mitra kami.
          </Text>
        </View>

        <View style={{ height: normalize(40) }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: normalize(20), paddingVertical: normalize(15), backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  backBtn: { padding: normalize(8) },
  headerTitle: { fontSize: normalize(17), fontWeight: '800', color: '#1C1C1E' },
  content: { padding: normalize(20) },
  withdrawalCard: { backgroundColor: '#FFFFFF', borderRadius: normalize(20), marginBottom: normalize(16), shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2, borderWidth: 1, borderColor: '#F1F5F9', overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', paddingHorizontal: normalize(16), paddingVertical: normalize(10), borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  bankTag: { flexDirection: 'row', alignItems: 'center' },
  bankText: { fontSize: normalize(11), color: '#64748B', fontWeight: '700', marginLeft: normalize(6) },
  statusBadge: { paddingHorizontal: normalize(10), paddingVertical: normalize(4), borderRadius: normalize(8) },
  statusText: { fontSize: normalize(10), fontWeight: '800' },
  cardBody: { padding: normalize(16) },
  amountLabel: { fontSize: normalize(12), color: '#94A3B8', fontWeight: '600' },
  amountValue: { fontSize: normalize(18), fontWeight: '800', color: '#1C1C1E', marginTop: normalize(4) },
  divider: { height: 1, backgroundColor: '#F8FAFC', marginVertical: normalize(12) },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dateText: { fontSize: normalize(11), color: '#94A3B8', fontWeight: '600' },
  idText: { fontSize: normalize(11), color: '#CBD5E1', fontWeight: '700' },
  infoBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: normalize(24), paddingHorizontal: normalize(20) },
  infoText: { fontSize: normalize(12), color: '#94A3B8', marginLeft: normalize(8), textAlign: 'center', lineHeight: normalize(18) },
});
