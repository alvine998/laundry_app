import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import normalize from 'react-native-normalize';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'KebijakanPrivasi'>;

export const KebijakanPrivasiScreen = ({ navigation }: Props) => {
  const sections = [
    {
      title: '1. Informasi yang Kami Kumpulkan',
      content:
        'Kami mengumpulkan informasi yang Anda berikan secara langsung, seperti nama, alamat email, nomor telepon, dan alamat pengiriman. Kami juga mengumpulkan data penggunaan aplikasi secara otomatis, termasuk informasi perangkat, lokasi (dengan izin Anda), dan interaksi dengan fitur aplikasi.',
    },
    {
      title: '2. Penggunaan Informasi',
      content:
        'Informasi yang dikumpulkan digunakan untuk: menyediakan dan meningkatkan layanan kami, memproses pesanan dan pembayaran, mengirimkan notifikasi terkait pesanan, memberikan dukungan pelanggan, serta mengirimkan informasi promosi dan penawaran (dengan persetujuan Anda).',
    },
    {
      title: '3. Berbagi Informasi',
      content:
        'Kami tidak menjual data pribadi Anda. Informasi hanya dibagikan kepada mitra laundry terkait untuk memproses pesanan, penyedia layanan pembayaran, dan pihak ketiga yang membantu operasional kami (seperti layanan cloud dan analitik). Semua pihak ketiga wajib menjaga kerahasiaan data Anda.',
    },
    {
      title: '4. Keamanan Data',
      content:
        'Kami menerapkan langkah-langkah keamanan teknis dan organisasi yang sesuai untuk melindungi data pribadi Anda dari akses tidak sah, kehilangan, atau penyalahgunaan. Semua data sensitif dienkripsi saat transmisi menggunakan teknologi SSL/TLS.',
    },
    {
      title: '5. Penyimpanan Data',
      content:
        'Data pribadi Anda disimpan selama akun Anda aktif atau selama diperlukan untuk menyediakan layanan. Anda dapat meminta penghapusan akun dan data kapan saja dengan menghubungi tim dukungan kami. Data akan dihapus dalam waktu 30 hari kerja setelah permintaan diterima.',
    },
    {
      title: '6. Hak Pengguna',
      content:
        'Anda memiliki hak untuk: mengakses data pribadi Anda, memperbarui atau memperbaiki data yang tidak akurat, meminta penghapusan data, menolak penggunaan data untuk pemasaran, dan memindahkan data Anda ke layanan lain. Untuk menggunakan hak ini, hubungi kami melalui Pusat Bantuan.',
    },
    {
      title: '7. Cookie dan Teknologi Pelacakan',
      content:
        'Kami menggunakan cookie dan teknologi serupa untuk meningkatkan pengalaman pengguna, menganalisis penggunaan aplikasi, dan menyajikan konten yang relevan. Anda dapat mengelola preferensi cookie melalui pengaturan perangkat Anda.',
    },
    {
      title: '8. Perubahan Kebijakan',
      content:
        'Kebijakan privasi ini dapat diperbarui dari waktu ke waktu. Kami akan memberitahu Anda tentang perubahan signifikan melalui notifikasi dalam aplikasi atau email. Penggunaan berkelanjutan atas layanan kami setelah perubahan berarti Anda menyetujui kebijakan yang diperbarui.',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={normalize(22)} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kebijakan Privasi</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.lastUpdated}>
          <Ionicons name="shield-checkmark-outline" size={normalize(14)} color="#10B981" />
          <Text style={styles.lastUpdatedText}>Terakhir diperbarui: 1 Maret 2026</Text>
        </View>

        <View style={styles.introCard}>
          <Text style={styles.introText}>
            Laundry Now berkomitmen untuk melindungi privasi dan keamanan data pribadi Anda. Kebijakan ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda.
          </Text>
        </View>

        {sections.map((section, index) => (
          <View key={index} style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionContent}>{section.content}</Text>
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerTitle}>Ada Pertanyaan?</Text>
          <Text style={styles.footerText}>
            Hubungi kami di privacy@laundrynow.id atau melalui Pusat Bantuan dalam aplikasi.
          </Text>
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
  lastUpdated: {
    flexDirection: 'row', alignItems: 'center',
    marginBottom: normalize(16), paddingVertical: normalize(10),
    paddingHorizontal: normalize(14), backgroundColor: '#DCFCE7',
    borderRadius: normalize(12),
  },
  lastUpdatedText: { fontSize: normalize(12), color: '#10B981', fontWeight: '600', marginLeft: normalize(8) },
  introCard: {
    backgroundColor: '#FFFFFF', borderRadius: normalize(16), padding: normalize(20),
    marginBottom: normalize(16), borderLeftWidth: 4, borderLeftColor: '#0084F4',
  },
  introText: { fontSize: normalize(14), color: '#475569', lineHeight: normalize(22), fontWeight: '500' },
  sectionCard: {
    backgroundColor: '#FFFFFF', borderRadius: normalize(16), padding: normalize(20),
    marginBottom: normalize(12), borderWidth: 1, borderColor: '#F1F5F9',
  },
  sectionTitle: { fontSize: normalize(15), fontWeight: '800', color: '#1C1C1E', marginBottom: normalize(10) },
  sectionContent: { fontSize: normalize(13), color: '#475569', lineHeight: normalize(22) },
  footer: {
    marginTop: normalize(16), padding: normalize(20), backgroundColor: '#F1F5F9',
    borderRadius: normalize(16), alignItems: 'center',
  },
  footerTitle: { fontSize: normalize(16), fontWeight: '800', color: '#1C1C1E', marginBottom: normalize(8) },
  footerText: { fontSize: normalize(13), color: '#64748B', lineHeight: normalize(20), textAlign: 'center', fontWeight: '500' },
});
