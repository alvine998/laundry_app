import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import normalize from 'react-native-normalize';
import { RootStackParamList } from '../../types/navigation';
import Toast from 'react-native-toast-message';

type Props = NativeStackScreenProps<RootStackParamList, 'PengaturanToko'>;

const DAY_STATUS = [
  { day: 'Senin', open: '08:00', close: '20:00', isActive: true },
  { day: 'Selasa', open: '08:00', close: '20:00', isActive: true },
  { day: 'Rabu', open: '08:00', close: '20:00', isActive: true },
  { day: 'Kamis', open: '08:00', close: '20:00', isActive: true },
  { day: 'Jumat', open: '08:00', close: '20:00', isActive: true },
  { day: 'Sabtu', open: '09:00', close: '18:00', isActive: true },
  { day: 'Minggu', open: '-', close: '-', isActive: false },
];

export const PengaturanTokoScreen = ({ navigation }: Props) => {
  const [address, setAddress] = useState('Jl. Merdeka No. 123, Jakarta Selatan');
  const [bankName, setBankName] = useState('Bank BCA');
  const [accountNumber, setAccountNumber] = useState('8830123456');
  const [accountHolder, setAccountHolder] = useState('Budi Santoso');
  const [isAutoAccept, setIsAutoAccept] = useState(true);

  const handleSave = () => {
    Toast.show({ type: 'success', text1: 'Pengaturan toko berhasil disimpan' });
    setTimeout(() => navigation.goBack(), 800);
  };

  const openMapPicker = () => {
    // Navigate to MapPicker when available
    Toast.show({ type: 'info', text1: 'Membuka Peta...' });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={normalize(22)} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pengaturan Toko</Text>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveText}>Simpan</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Location Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lokasi Operasional</Text>
          <View style={styles.card}>
            <View style={styles.addressContainer}>
              <Ionicons name="location" size={normalize(24)} color="#EF4444" />
              <View style={styles.addressInfo}>
                <Text style={styles.addressLabel}>Alamat Toko</Text>
                <Text style={styles.addressValue}>{address}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.mapLink} onPress={openMapPicker}>
              <Ionicons name="map-outline" size={normalize(16)} color="#0084F4" />
              <Text style={styles.mapLinkText}>Ubah di Peta</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Business Hours Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Jam Operasional</Text>
          <View style={styles.card}>
            {DAY_STATUS.map((item, index) => (
              <View key={index} style={[styles.dayRow, index === DAY_STATUS.length - 1 && { borderBottomWidth: 0 }]}>
                <Text style={[styles.dayName, !item.isActive && { color: '#94A3B8' }]}>{item.day}</Text>
                <View style={styles.timeWrapper}>
                  {item.isActive ? (
                    <Text style={styles.timeText}>{item.open} - {item.close}</Text>
                  ) : (
                    <Text style={[styles.timeText, { color: '#EF4444' }]}>Tutup</Text>
                  )}
                  <MaterialCommunityIcons name="chevron-right" size={normalize(18)} color="#CBD5E1" />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Wallet & Payout Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rekening Penarikan</Text>
          <View style={styles.card}>
            <View style={styles.inputContainer}>
              <Text style={styles.fieldLabel}>Nama Bank</Text>
              <TextInput style={styles.input} value={bankName} onChangeText={setBankName} />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.fieldLabel}>Nomor Rekening</Text>
              <TextInput style={styles.input} value={accountNumber} onChangeText={setAccountNumber} keyboardType="numeric" />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.fieldLabel}>Nama Pemilik Rekening</Text>
              <TextInput style={styles.input} value={accountHolder} onChangeText={setAccountHolder} />
            </View>
          </View>
        </View>

        {/* Other Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fitur Pesanan</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View>
                <Text style={styles.settingTitle}>Terima Otomatis</Text>
                <Text style={styles.settingSub}>Langsung terima pesanan baru</Text>
              </View>
              <Switch trackColor={{ false: '#E2E8F0', true: '#DCFCE7' }} thumbColor={isAutoAccept ? '#10B981' : '#FFFFFF'} onValueChange={setIsAutoAccept} value={isAutoAccept} />
            </View>
          </View>
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
  saveBtn: { backgroundColor: '#0084F4', paddingHorizontal: normalize(16), paddingVertical: normalize(8), borderRadius: normalize(10) },
  saveText: { color: '#FFFFFF', fontWeight: '700' },
  content: { padding: normalize(20) },
  section: { marginBottom: normalize(24) },
  sectionTitle: { fontSize: normalize(13), fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: normalize(12), marginLeft: normalize(4) },
  card: { backgroundColor: '#FFFFFF', borderRadius: normalize(20), padding: normalize(16), shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  addressContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: normalize(15) },
  addressInfo: { flex: 1, marginLeft: normalize(12) },
  addressLabel: { fontSize: normalize(12), color: '#94A3B8', fontWeight: '600' },
  addressValue: { fontSize: normalize(14), fontWeight: '700', color: '#1C1C1E', marginTop: normalize(2) },
  mapLink: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F0F9FF', padding: normalize(10), borderRadius: normalize(12) },
  mapLinkText: { fontSize: normalize(13), color: '#0084F4', fontWeight: '700', marginLeft: normalize(8) },
  dayRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: normalize(14), borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
  dayName: { fontSize: normalize(14), fontWeight: '600', color: '#1C1C1E' },
  timeWrapper: { flexDirection: 'row', alignItems: 'center' },
  timeText: { fontSize: normalize(14), fontWeight: '700', color: '#64748B', marginRight: normalize(8) },
  inputContainer: { marginBottom: normalize(16) },
  fieldLabel: { fontSize: normalize(12), fontWeight: '700', color: '#94A3B8', marginBottom: normalize(8), marginLeft: normalize(4) },
  input: { backgroundColor: '#F8FAFC', borderRadius: normalize(12), paddingHorizontal: normalize(16), paddingVertical: normalize(12), fontSize: normalize(14), fontWeight: '700', color: '#1C1C1E', borderWidth: 1, borderColor: '#F1F5F9' },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  settingTitle: { fontSize: normalize(15), fontWeight: '700', color: '#1C1C1E' },
  settingSub: { fontSize: normalize(12), color: '#94A3B8', marginTop: 2 },
});
