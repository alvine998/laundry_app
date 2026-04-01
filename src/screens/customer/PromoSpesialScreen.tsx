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

type Props = NativeStackScreenProps<RootStackParamList, 'PromoSpesial'>;

interface Promo {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  code: string;
  minOrder: string;
  validUntil: string;
  bgColor: string;
  accentColor: string;
  icon: string;
}

const PROMOS: Promo[] = [
  {
    id: '1',
    title: 'Potongan 50%',
    subtitle: 'Untuk pengguna baru',
    description: 'Nikmati diskon 50% untuk pesanan pertama kamu di Laundry Now. Berlaku untuk semua jenis layanan cuci.',
    code: 'NEWUSER50',
    minOrder: 'Min. Rp 25.000',
    validUntil: 'Berlaku hingga 30 Apr 2026',
    bgColor: '#DBEAFE',
    accentColor: '#0084F4',
    icon: 'tag-heart',
  },
  {
    id: '2',
    title: 'Gratis Ongkir',
    subtitle: 'Min. order Rp 30.000',
    description: 'Bebas biaya antar jemput untuk semua area layanan. Hemat lebih banyak di setiap pesanan kamu!',
    code: 'GRATISONGKIR',
    minOrder: 'Min. Rp 30.000',
    validUntil: 'Berlaku hingga 15 Apr 2026',
    bgColor: '#DCFCE7',
    accentColor: '#10B981',
    icon: 'truck-fast',
  },
  {
    id: '3',
    title: 'Diskon 30%',
    subtitle: 'Layanan Bedding',
    description: 'Spesial diskon 30% untuk layanan cuci bedding (sprei, selimut, bed cover). Tidur nyenyak dengan perlengkapan bersih!',
    code: 'BEDDING30',
    minOrder: 'Min. Rp 40.000',
    validUntil: 'Berlaku hingga 20 Apr 2026',
    bgColor: '#FEF3C7',
    accentColor: '#F59E0B',
    icon: 'bed-outline',
  },
  {
    id: '4',
    title: 'Cashback 25%',
    subtitle: 'Bayar pakai Saldo Hub',
    description: 'Dapatkan cashback 25% ke Saldo Hub untuk pembayaran menggunakan Saldo Hub. Maksimal cashback Rp 15.000.',
    code: 'CASHBACK25',
    minOrder: 'Min. Rp 35.000',
    validUntil: 'Berlaku hingga 25 Apr 2026',
    bgColor: '#EDE9FE',
    accentColor: '#8B5CF6',
    icon: 'cash-refund',
  },
  {
    id: '5',
    title: 'Cuci Sepatu Rp 20K',
    subtitle: 'Harga spesial weekend',
    description: 'Cuci sepatu cuma Rp 20.000 setiap hari Sabtu & Minggu. Sepatu bersih, aktivitas makin semangat!',
    code: 'SEPATU20K',
    minOrder: 'Tanpa min. order',
    validUntil: 'Setiap Sabtu & Minggu',
    bgColor: '#FFE4E6',
    accentColor: '#EF4444',
    icon: 'shoe-sneaker',
  },
  {
    id: '6',
    title: 'Poin 2x Lipat',
    subtitle: 'Kumpulkan lebih banyak',
    description: 'Dapatkan poin loyalti 2x lipat untuk setiap transaksi di bulan ini. Tukar poin dengan voucher menarik!',
    code: 'POIN2X',
    minOrder: 'Semua transaksi',
    validUntil: 'Berlaku hingga 30 Apr 2026',
    bgColor: '#FFF7ED',
    accentColor: '#EA580C',
    icon: 'star-circle',
  },
];

export const PromoSpesialScreen = ({ navigation }: Props) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={normalize(22)} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Promo Spesial</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Active Promo Count */}
        <View style={styles.countBadge}>
          <MaterialCommunityIcons name="fire" size={normalize(16)} color="#EF4444" />
          <Text style={styles.countText}>{PROMOS.length} promo tersedia untuk kamu</Text>
        </View>

        {PROMOS.map((promo) => (
          <View key={promo.id} style={styles.promoCard}>
            {/* Top Banner */}
            <View style={[styles.promoBanner, { backgroundColor: promo.bgColor }]}>
              <View style={styles.promoBannerContent}>
                <Text style={[styles.promoTitle, { color: promo.accentColor }]}>{promo.title}</Text>
                <Text style={styles.promoSubtitle}>{promo.subtitle}</Text>
              </View>
              <MaterialCommunityIcons
                name={promo.icon as any}
                size={normalize(56)}
                color={promo.accentColor}
                style={styles.promoIconBg}
              />
            </View>

            {/* Details */}
            <View style={styles.promoDetails}>
              <Text style={styles.promoDescription}>{promo.description}</Text>

              <View style={styles.promoInfoRow}>
                <View style={styles.promoInfoItem}>
                  <Ionicons name="pricetag-outline" size={normalize(14)} color="#94A3B8" />
                  <Text style={styles.promoInfoText}>{promo.minOrder}</Text>
                </View>
                <View style={styles.promoInfoItem}>
                  <Ionicons name="time-outline" size={normalize(14)} color="#94A3B8" />
                  <Text style={styles.promoInfoText}>{promo.validUntil}</Text>
                </View>
              </View>

              <View style={styles.promoAction}>
                <View style={[styles.codeBadge, { backgroundColor: promo.bgColor }]}>
                  <Text style={[styles.codeText, { color: promo.accentColor }]}>{promo.code}</Text>
                </View>
                <TouchableOpacity style={[styles.useBtn, { backgroundColor: promo.accentColor }]}>
                  <Text style={styles.useBtnText}>Gunakan</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
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
  content: { padding: normalize(20), paddingBottom: normalize(40) },
  countBadge: {
    flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start',
    backgroundColor: '#FEE2E2', paddingHorizontal: normalize(14), paddingVertical: normalize(8),
    borderRadius: normalize(20), marginBottom: normalize(20),
  },
  countText: { fontSize: normalize(12), fontWeight: '700', color: '#EF4444', marginLeft: normalize(6) },
  promoCard: {
    backgroundColor: '#FFFFFF', borderRadius: normalize(20), overflow: 'hidden',
    marginBottom: normalize(16),
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3,
  },
  promoBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: normalize(20), position: 'relative', overflow: 'hidden',
  },
  promoBannerContent: { flex: 1, zIndex: 1 },
  promoTitle: { fontSize: normalize(22), fontWeight: '900', marginBottom: normalize(4) },
  promoSubtitle: { fontSize: normalize(13), fontWeight: '600', color: '#475569' },
  promoIconBg: { opacity: 0.25, position: 'absolute', right: normalize(10), bottom: normalize(-5) },
  promoDetails: { padding: normalize(20), paddingTop: normalize(16) },
  promoDescription: { fontSize: normalize(13), color: '#475569', lineHeight: normalize(20), marginBottom: normalize(14) },
  promoInfoRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: normalize(16) },
  promoInfoItem: { flexDirection: 'row', alignItems: 'center', marginRight: normalize(20), marginBottom: normalize(6) },
  promoInfoText: { fontSize: normalize(12), color: '#94A3B8', fontWeight: '600', marginLeft: normalize(6) },
  promoAction: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  codeBadge: {
    paddingHorizontal: normalize(14), paddingVertical: normalize(8), borderRadius: normalize(10),
  },
  codeText: { fontSize: normalize(12), fontWeight: '800', letterSpacing: 0.8 },
  useBtn: {
    paddingHorizontal: normalize(24), paddingVertical: normalize(10), borderRadius: normalize(12),
  },
  useBtnText: { fontSize: normalize(13), fontWeight: '700', color: '#FFFFFF' },
});
