import React, { useState } from 'react';
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

type Props = NativeStackScreenProps<RootStackParamList, 'VoucherSaya'>;

interface Voucher {
  id: string;
  code: string;
  title: string;
  description: string;
  discount: string;
  minOrder: string;
  expiry: string;
  isUsed: boolean;
  color: string;
}

const MOCK_VOUCHERS: Voucher[] = [
  {
    id: '1',
    code: 'LAUNDRYKECE',
    title: 'Diskon 50%',
    description: 'Potongan harga untuk semua layanan cuci',
    discount: '50%',
    minOrder: 'Min. Rp 30.000',
    expiry: 'Berlaku hingga 30 Apr 2026',
    isUsed: false,
    color: '#0084F4',
  },
  {
    id: '2',
    code: 'GRATISONGKIR',
    title: 'Gratis Ongkir',
    description: 'Bebas biaya antar jemput untuk semua area',
    discount: 'FREE',
    minOrder: 'Min. Rp 50.000',
    expiry: 'Berlaku hingga 15 Apr 2026',
    isUsed: false,
    color: '#10B981',
  },
  {
    id: '3',
    code: 'NEWUSER25',
    title: 'Diskon 25%',
    description: 'Khusus pengguna baru Laundry Now',
    discount: '25%',
    minOrder: 'Min. Rp 20.000',
    expiry: 'Sudah digunakan',
    isUsed: true,
    color: '#94A3B8',
  },
];

export const VoucherSayaScreen = ({ navigation }: Props) => {
  const [activeTab, setActiveTab] = useState<'active' | 'used'>('active');

  const filtered = MOCK_VOUCHERS.filter(v =>
    activeTab === 'active' ? !v.isUsed : v.isUsed
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={normalize(22)} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Voucher Saya</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'active' && styles.tabActive]}
          onPress={() => setActiveTab('active')}
        >
          <Text style={[styles.tabText, activeTab === 'active' && styles.tabTextActive]}>Tersedia</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'used' && styles.tabActive]}
          onPress={() => setActiveTab('used')}
        >
          <Text style={[styles.tabText, activeTab === 'used' && styles.tabTextActive]}>Terpakai</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {filtered.map((voucher) => (
          <View key={voucher.id} style={[styles.voucherCard, voucher.isUsed && styles.voucherCardUsed]}>
            <View style={styles.voucherLeft}>
              <View style={[styles.discountCircle, { backgroundColor: voucher.color + '15' }]}>
                <Text style={[styles.discountText, { color: voucher.color }]}>{voucher.discount}</Text>
              </View>
            </View>
            <View style={styles.voucherDivider}>
              <View style={[styles.notchCircle, styles.notchTop]} />
              <View style={styles.dashedLine} />
              <View style={[styles.notchCircle, styles.notchBottom]} />
            </View>
            <View style={styles.voucherRight}>
              <Text style={[styles.voucherTitle, voucher.isUsed && styles.textMuted]}>{voucher.title}</Text>
              <Text style={[styles.voucherDesc, voucher.isUsed && styles.textMuted]}>{voucher.description}</Text>
              <Text style={styles.voucherMin}>{voucher.minOrder}</Text>
              <View style={styles.voucherBottom}>
                <Text style={[styles.voucherExpiry, voucher.isUsed && { color: '#EF4444' }]}>{voucher.expiry}</Text>
                {!voucher.isUsed && (
                  <View style={[styles.codeBadge, { backgroundColor: voucher.color + '15' }]}>
                    <Text style={[styles.codeText, { color: voucher.color }]}>{voucher.code}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        ))}

        {filtered.length === 0 && (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="ticket-outline" size={normalize(64)} color="#E2E8F0" />
            <Text style={styles.emptyTitle}>
              {activeTab === 'active' ? 'Belum ada voucher' : 'Belum ada voucher terpakai'}
            </Text>
            <Text style={styles.emptySubtitle}>Pantau terus promo menarik dari Laundry Now</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: normalize(20), paddingVertical: normalize(15),
    backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    width: normalize(40), height: normalize(40), borderRadius: normalize(12),
    backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { fontSize: normalize(17), fontWeight: '800', color: '#1C1C1E' },
  headerSpacer: { width: normalize(40) },
  tabBar: {
    flexDirection: 'row', backgroundColor: '#FFFFFF',
    paddingHorizontal: normalize(20), paddingVertical: normalize(8),
  },
  tab: {
    flex: 1, paddingVertical: normalize(10), alignItems: 'center',
    borderRadius: normalize(12), marginHorizontal: normalize(4),
  },
  tabActive: { backgroundColor: '#0084F4' },
  tabText: { fontSize: normalize(14), fontWeight: '700', color: '#94A3B8' },
  tabTextActive: { color: '#FFFFFF' },
  content: { padding: normalize(20) },
  voucherCard: {
    flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: normalize(16),
    marginBottom: normalize(16), overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  voucherCardUsed: { opacity: 0.6 },
  voucherLeft: {
    width: normalize(90), justifyContent: 'center', alignItems: 'center', padding: normalize(12),
  },
  discountCircle: {
    width: normalize(64), height: normalize(64), borderRadius: normalize(32),
    justifyContent: 'center', alignItems: 'center',
  },
  discountText: { fontSize: normalize(16), fontWeight: '900' },
  voucherDivider: { width: normalize(1), justifyContent: 'center', alignItems: 'center', position: 'relative' },
  notchCircle: {
    width: normalize(20), height: normalize(20), borderRadius: normalize(10),
    backgroundColor: '#F8FAFC', position: 'absolute', zIndex: 1,
  },
  notchTop: { top: normalize(-10) },
  notchBottom: { bottom: normalize(-10) },
  dashedLine: { width: 1, flex: 1, borderLeftWidth: 1, borderLeftColor: '#E2E8F0', borderStyle: 'dashed' },
  voucherRight: { flex: 1, padding: normalize(16) },
  voucherTitle: { fontSize: normalize(16), fontWeight: '800', color: '#1C1C1E', marginBottom: normalize(4) },
  voucherDesc: { fontSize: normalize(12), color: '#64748B', marginBottom: normalize(6) },
  voucherMin: { fontSize: normalize(11), fontWeight: '600', color: '#94A3B8', marginBottom: normalize(10) },
  voucherBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  voucherExpiry: { fontSize: normalize(10), color: '#94A3B8', fontWeight: '600', flex: 1 },
  codeBadge: { paddingHorizontal: normalize(10), paddingVertical: normalize(4), borderRadius: normalize(8) },
  codeText: { fontSize: normalize(10), fontWeight: '800', letterSpacing: 0.5 },
  textMuted: { color: '#94A3B8' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: normalize(80) },
  emptyTitle: { fontSize: normalize(18), fontWeight: '800', color: '#1C1C1E', marginTop: normalize(16) },
  emptySubtitle: { fontSize: normalize(14), color: '#64748B', marginTop: normalize(8), textAlign: 'center' },
});
