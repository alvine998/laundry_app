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

type Props = NativeStackScreenProps<RootStackParamList, 'SyaratKetentuan'>;

export const SyaratKetentuanScreen = ({ navigation }: Props) => {
  const sections = [
    {
      title: '1. Ketentuan Umum',
      content:
        'Dengan menggunakan aplikasi Laundry Now, Anda menyetujui seluruh syarat dan ketentuan yang berlaku. Layanan ini hanya tersedia untuk pengguna yang berusia minimal 17 tahun atau memiliki izin dari orang tua/wali. Kami berhak untuk mengubah, memodifikasi, atau menghentikan layanan tanpa pemberitahuan sebelumnya.',
    },
    {
      title: '2. Layanan',
      content:
        'Laundry Now menyediakan layanan penghubung antara pelanggan dengan mitra laundry terdaftar. Kami tidak bertanggung jawab secara langsung atas kualitas layanan yang diberikan oleh mitra laundry. Namun kami berkomitmen untuk memastikan standar kualitas yang tinggi dari seluruh mitra kami melalui sistem penilaian dan review.',
    },
    {
      title: '3. Pemesanan dan Pembayaran',
      content:
        'Setiap pemesanan yang telah dikonfirmasi tidak dapat dibatalkan setelah kurir menjemput pakaian. Pembayaran dapat dilakukan melalui metode yang tersedia dalam aplikasi. Harga layanan ditentukan oleh masing-masing mitra laundry dan dapat berubah sewaktu-waktu tanpa pemberitahuan sebelumnya.',
    },
    {
      title: '4. Penjemputan dan Pengantaran',
      content:
        'Jadwal penjemputan dan pengantaran disesuaikan dengan ketersediaan kurir dan mitra laundry. Kami akan berusaha untuk memenuhi jadwal yang telah ditentukan, namun keterlambatan dapat terjadi karena kondisi tertentu seperti cuaca atau lalu lintas. Pelanggan harus memastikan alamat yang diberikan sudah benar.',
    },
    {
      title: '5. Garansi dan Kompensasi',
      content:
        'Laundry Now memberikan garansi atas kerusakan atau kehilangan pakaian selama dalam proses layanan. Klaim harus diajukan maksimal 24 jam setelah pakaian diterima. Kompensasi akan diberikan sesuai dengan nilai wajar pakaian yang rusak atau hilang, dengan batas maksimum yang telah ditentukan.',
    },
    {
      title: '6. Akun Pengguna',
      content:
        'Pengguna bertanggung jawab penuh atas keamanan akun mereka. Jangan bagikan informasi login Anda kepada pihak lain. Kami berhak untuk menangguhkan atau menutup akun yang terdeteksi melakukan pelanggaran terhadap syarat dan ketentuan ini.',
    },
    {
      title: '7. Perubahan Ketentuan',
      content:
        'Laundry Now berhak untuk mengubah syarat dan ketentuan ini sewaktu-waktu. Perubahan akan diberitahukan melalui aplikasi atau email. Dengan terus menggunakan layanan setelah perubahan, Anda dianggap menyetujui ketentuan yang baru.',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={normalize(22)} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Syarat & Ketentuan</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.lastUpdated}>
          <Ionicons name="time-outline" size={normalize(14)} color="#94A3B8" />
          <Text style={styles.lastUpdatedText}>Terakhir diperbarui: 1 Maret 2026</Text>
        </View>

        {sections.map((section, index) => (
          <View key={index} style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionContent}>{section.content}</Text>
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Jika Anda memiliki pertanyaan tentang Syarat & Ketentuan ini, silakan hubungi kami di support@laundrynow.id
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
    marginBottom: normalize(20), paddingVertical: normalize(10),
    paddingHorizontal: normalize(14), backgroundColor: '#FFFFFF',
    borderRadius: normalize(12), borderWidth: 1, borderColor: '#F1F5F9',
  },
  lastUpdatedText: { fontSize: normalize(12), color: '#94A3B8', fontWeight: '600', marginLeft: normalize(8) },
  sectionCard: {
    backgroundColor: '#FFFFFF', borderRadius: normalize(16), padding: normalize(20),
    marginBottom: normalize(12), borderWidth: 1, borderColor: '#F1F5F9',
  },
  sectionTitle: { fontSize: normalize(15), fontWeight: '800', color: '#1C1C1E', marginBottom: normalize(10) },
  sectionContent: { fontSize: normalize(13), color: '#475569', lineHeight: normalize(22) },
  footer: {
    marginTop: normalize(16), padding: normalize(20), backgroundColor: '#DBEAFE',
    borderRadius: normalize(16),
  },
  footerText: { fontSize: normalize(13), color: '#0084F4', lineHeight: normalize(20), fontWeight: '600' },
});
