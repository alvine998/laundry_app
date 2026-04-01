import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Linking,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import normalize from 'react-native-normalize';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'PusatBantuan'>;

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  icon: string;
  color: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: '1',
    question: 'Bagaimana cara memesan layanan laundry?',
    answer: 'Pilih layanan yang kamu inginkan di halaman utama, pilih partner laundry terdekat, tentukan jumlah dan jenis pakaian, lalu lakukan pembayaran. Kurir akan menjemput pakaianmu sesuai jadwal.',
    icon: 'shopping-outline',
    color: '#0084F4',
  },
  {
    id: '2',
    question: 'Berapa lama waktu pengerjaan laundry?',
    answer: 'Waktu pengerjaan tergantung layanan yang dipilih. Layanan reguler membutuhkan 2-3 hari kerja, sementara layanan express hanya 1 hari kerja. Waktu antar jemput biasanya 30-60 menit.',
    icon: 'clock-outline',
    color: '#F59E0B',
  },
  {
    id: '3',
    question: 'Bagaimana jika pakaian saya rusak atau hilang?',
    answer: 'Kami memiliki kebijakan garansi penuh. Jika pakaianmu rusak atau hilang selama proses laundry, kami akan memberikan kompensasi sesuai nilai pakaian. Hubungi kami melalui fitur chat untuk klaim.',
    icon: 'shield-alert-outline',
    color: '#EF4444',
  },
  {
    id: '4',
    question: 'Bagaimana cara menggunakan voucher?',
    answer: 'Saat checkout, masukkan kode voucher di kolom yang tersedia dan tekan "Gunakan". Diskon akan otomatis diterapkan pada total pembayaran kamu jika memenuhi syarat minimum order.',
    icon: 'ticket-percent-outline',
    color: '#10B981',
  },
  {
    id: '5',
    question: 'Metode pembayaran apa saja yang tersedia?',
    answer: 'Kami menerima pembayaran melalui Saldo Hub, transfer bank (BCA, Mandiri, BNI, BRI), e-wallet (GoPay, OVO, Dana, ShopeePay), dan kartu kredit/debit.',
    icon: 'credit-card-outline',
    color: '#8B5CF6',
  },
];

const PARTNER_FAQ_ITEMS: FAQItem[] = [
  {
    id: 'p1',
    question: 'Bagaimana cara menarik saldo pendapatan?',
    answer: 'Buka menu Dompet di dashboard mitra, klik tombol "Tarik Saldo", masukkan nominal penarikan (minimal Rp 50.000), dan konfirmasi. Dana akan masuk ke rekening Anda dalam 1-2 hari kerja.',
    icon: 'wallet-outline',
    color: '#10B981',
  },
  {
    id: 'p2',
    question: 'Bagaimana cara mengubah harga atau ketersediaan layanan?',
    answer: 'Masuk ke menu profil, pilih "Kelola Layanan". Di sana Anda bisa mengaktifkan/menonaktifkan layanan tertentu atau mengubah harga per kg/pcs untuk setiap kategori.',
    icon: 'tag-outline',
    color: '#0084F4',
  },
  {
    id: 'p3',
    question: 'Apa yang harus dilakukan jika ada pembatalan order?',
    answer: 'Jika pelanggan membatalkan order sebelum proses pencucian dimulai, sistem akan otomatis mengembalikan dana ke saldo pelanggan. Jika pembatalan dilakukan oleh mitra, silakan hubungi admin melalui chat support.',
    icon: 'close-circle-outline',
    color: '#EF4444',
  },
  {
    id: 'p4',
    question: 'Bagaimana cara mengatur jam operasional toko?',
    answer: 'Buka menu profil, pilih "Pengaturan Toko". Anda bisa mengatur jam buka dan tutup untuk setiap hari dalam seminggu agar pelanggan tahu kapan bisa memesan.',
    icon: 'clock-outline',
    color: '#F59E0B',
  },
  {
    id: 'p5',
    question: 'Bagaimana jika kurir belum mengambil jemputan?',
    answer: 'Pastikan status pesanan sudah benar. Jika kurir eksternal belum datang dalam 30 menit, silakan gunakan fitur "Lacak Kurir" atau hubungi CS kami melalui WhatsApp.',
    icon: 'moped-outline',
    color: '#8B5CF6',
  },
];

const CONTACT_OPTIONS = [
  { id: '1', icon: 'whatsapp', title: 'WhatsApp', subtitle: '+62 822-3452-1792', color: '#25D366' },
  { id: '2', icon: 'email-outline', title: 'Email', subtitle: 'support@laundrynow.id', color: '#0084F4' },
  // { id: '3', icon: 'phone-outline', title: 'Telepon', subtitle: '021-12345678', color: '#F59E0B' },
];

export const PusatBantuanScreen = ({ navigation, route }: Props) => {
  const { type } = route.params;
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const handleContact = (id: string) => {
    if (id === '1') {
      // WhatsApp
      const phoneNumber = '6282234521792';
      const message = 'Halo Admin Laundry Now, saya butuh bantuan.';
      const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
      Linking.openURL(url).catch(() => {
        // Fallback to web browser if WhatsApp app is not installed
        Linking.openURL(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`);
      });
    } else if (id === '2') {
      // Email
      const email = 'support@laundrynow.id';
      const subject = 'Bantuan Laundry Now';
      const url = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
      Linking.openURL(url);
    }
  };

  const selectedData = type === 'partner' ? PARTNER_FAQ_ITEMS : FAQ_ITEMS;

  const filteredFAQ = selectedData.filter(
    item =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={normalize(22)} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pusat Bantuan</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={normalize(20)} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari pertanyaan..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* FAQ Section */}
        <Text style={styles.sectionTitle}>Pertanyaan Umum (FAQ)</Text>
        {filteredFAQ.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.faqCard, expandedId === item.id && styles.faqCardExpanded]}
            onPress={() => toggleExpand(item.id)}
            activeOpacity={0.8}
          >
            <View style={styles.faqHeader}>
              <View style={[styles.faqIcon, { backgroundColor: item.color + '15' }]}>
                <MaterialCommunityIcons name={item.icon as any} size={normalize(20)} color={item.color} />
              </View>
              <Text style={styles.faqQuestion}>{item.question}</Text>
              <Ionicons
                name={expandedId === item.id ? 'chevron-up' : 'chevron-down'}
                size={normalize(18)}
                color="#94A3B8"
              />
            </View>
            {expandedId === item.id && (
              <View style={styles.faqAnswerWrapper}>
                <Text style={styles.faqAnswer}>{item.answer}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}

        {/* Contact Section */}
        <Text style={[styles.sectionTitle, { marginTop: normalize(32) }]}>Hubungi Kami</Text>
        <View style={styles.contactCard}>
          {CONTACT_OPTIONS.map((contact) => (
            <TouchableOpacity 
              key={contact.id} 
              style={styles.contactItem}
              onPress={() => handleContact(contact.id)}
            >
              <View style={[styles.contactIcon, { backgroundColor: contact.color + '15' }]}>
                <MaterialCommunityIcons name={contact.icon as any} size={normalize(22)} color={contact.color} />
              </View>
              <View style={styles.contactText}>
                <Text style={styles.contactTitle}>{contact.title}</Text>
                <Text style={styles.contactSubtitle}>{contact.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={normalize(18)} color="#CBD5E1" />
            </TouchableOpacity>
          ))}
        </View>
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
  searchBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
    borderRadius: normalize(14), paddingHorizontal: normalize(15), height: normalize(48),
    marginBottom: normalize(24), borderWidth: 1, borderColor: '#E2E8F0',
  },
  searchInput: { flex: 1, marginLeft: normalize(10), fontSize: normalize(15), color: '#1C1C1E' },
  sectionTitle: {
    fontSize: normalize(13), fontWeight: '700', color: '#94A3B8',
    textTransform: 'uppercase', letterSpacing: 1, marginBottom: normalize(16), marginLeft: normalize(4),
  },
  faqCard: {
    backgroundColor: '#FFFFFF', borderRadius: normalize(16), padding: normalize(16),
    marginBottom: normalize(12), borderWidth: 1, borderColor: '#F1F5F9',
  },
  faqCardExpanded: { borderColor: '#0084F4' },
  faqHeader: { flexDirection: 'row', alignItems: 'center' },
  faqIcon: {
    width: normalize(36), height: normalize(36), borderRadius: normalize(10),
    justifyContent: 'center', alignItems: 'center', marginRight: normalize(12),
  },
  faqQuestion: { flex: 1, fontSize: normalize(14), fontWeight: '700', color: '#1C1C1E' },
  faqAnswerWrapper: {
    marginTop: normalize(12), paddingTop: normalize(12),
    borderTopWidth: 1, borderTopColor: '#F1F5F9',
  },
  faqAnswer: { fontSize: normalize(13), color: '#475569', lineHeight: normalize(20) },
  contactCard: {
    backgroundColor: '#FFFFFF', borderRadius: normalize(20), padding: normalize(8),
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1,
  },
  contactItem: { flexDirection: 'row', alignItems: 'center', padding: normalize(14) },
  contactIcon: {
    width: normalize(44), height: normalize(44), borderRadius: normalize(14),
    justifyContent: 'center', alignItems: 'center',
  },
  contactText: { flex: 1, marginLeft: normalize(14) },
  contactTitle: { fontSize: normalize(15), fontWeight: '700', color: '#1C1C1E' },
  contactSubtitle: { fontSize: normalize(12), color: '#64748B', marginTop: normalize(2) },
});
