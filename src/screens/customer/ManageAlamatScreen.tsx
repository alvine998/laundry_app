import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import normalize from 'react-native-normalize';
import { RootStackParamList } from '../../types/navigation';
import { StorageService } from '../../services/StorageService';
import { Address } from '../../types/address';
import Toast from 'react-native-toast-message';

type Props = NativeStackScreenProps<RootStackParamList, 'ManageAlamat'>;

export const ManageAlamatScreen = ({ navigation, route }: Props) => {
  const editingAddress = route.params?.address;
  const isEditing = !!editingAddress;

  const [label, setLabel] = useState(editingAddress?.label || '');
  const [name, setName] = useState(editingAddress?.name || '');
  const [phone, setPhone] = useState(editingAddress?.phone || '');
  const [address, setAddress] = useState(editingAddress?.address || '');
  const [isDefault, setIsDefault] = useState(editingAddress?.isDefault || false);
  const [icon, setIcon] = useState(editingAddress?.icon || 'home-outline');

  const ICON_OPTIONS = [
    { label: 'Rumah', value: 'home-outline' },
    { label: 'Kantor', value: 'office-building-outline' },
    { label: 'Sekolah', value: 'school-outline' },
    { label: 'Lainnya', value: 'map-marker-outline' },
  ];

  const handleSave = async () => {
    if (!label || !name || !phone || !address) {
      Alert.alert('Error', 'Semua data harus diisi');
      return;
    }

    const newAddress: Address = {
      id: isEditing ? editingAddress.id : Date.now().toString(),
      label,
      name,
      phone,
      address,
      isDefault,
      icon,
    };

    if (isEditing) {
      await StorageService.updateAddress(newAddress);
      Toast.show({ type: 'success', text1: 'Alamat berhasil diperbarui' });
    } else {
      await StorageService.addAddress(newAddress);
      Toast.show({ type: 'success', text1: 'Alamat baru ditambahkan' });
    }

    navigation.goBack();
  };

  const openMapPicker = () => {
    navigation.navigate('MapPicker', {
      onSelect: (selectedAddress: string) => {
        setAddress(selectedAddress);
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={normalize(22)} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEditing ? 'Ubah Alamat' : 'Tambah Alamat'}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Label Alamat</Text>
          <View style={styles.iconContainer}>
            {ICON_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.iconItem, icon === opt.value && styles.iconItemActive]}
                onPress={() => {
                  setIcon(opt.value);
                  if (!label || ICON_OPTIONS.some(o => o.label === label)) {
                    setLabel(opt.label);
                  }
                }}
              >
                <MaterialCommunityIcons 
                  name={opt.value as any} 
                  size={normalize(20)} 
                  color={icon === opt.value ? '#0084F4' : '#64748B'} 
                />
                <Text style={[styles.iconLabel, icon === opt.value && styles.iconLabelActive]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TextInput
            style={styles.input}
            placeholder="Label Alamat (misal: Rumah Alvin)"
            value={label}
            onChangeText={setLabel}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detail Penerima</Text>
          <Text style={styles.inputLabel}>Nama Lengkap</Text>
          <TextInput
            style={styles.input}
            placeholder="Nama Penerima"
            value={name}
            onChangeText={setName}
          />
          
          <Text style={styles.inputLabel}>Nomor Telepon</Text>
          <TextInput
            style={styles.input}
            placeholder="0812-xxxx-xxxx"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Alamat Lengkap</Text>
            <TouchableOpacity onPress={openMapPicker} style={styles.mapLink}>
              <Ionicons name="map-outline" size={normalize(14)} color="#0084F4" />
              <Text style={styles.mapLinkText}>Pilih di Peta</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Tulis alamat lengkap Anda..."
            value={address}
            onChangeText={setAddress}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={[styles.section, styles.rowBetween]}>
          <View>
            <Text style={styles.sectionTitle}>Jadikan Alamat Utama</Text>
            <Text style={styles.sectionSubtitle}>Pasikan alamat ini jadi tujuan utama</Text>
          </View>
          <Switch
            value={isDefault}
            onValueChange={setIsDefault}
            trackColor={{ false: '#E2E8F0', true: '#BFDBFE' }}
            thumbColor={isDefault ? '#0084F4' : '#F1F5F9'}
          />
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.submitBtn} onPress={handleSave}>
          <Text style={styles.submitBtnText}>{isEditing ? 'Simpan Perubahan' : 'Simpan Alamat'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
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
  content: { padding: normalize(20), paddingBottom: normalize(100) },
  section: { marginBottom: normalize(24) },
  sectionTitle: { fontSize: normalize(15), fontWeight: '800', color: '#1C1C1E', marginBottom: normalize(12) },
  sectionSubtitle: { fontSize: normalize(12), color: '#64748B', marginTop: normalize(-8) },
  inputLabel: { fontSize: normalize(13), fontWeight: '700', color: '#475569', marginBottom: normalize(8) },
  input: {
    backgroundColor: '#F8FAFC', borderRadius: normalize(12), paddingHorizontal: normalize(16),
    paddingVertical: normalize(12), fontSize: normalize(14), color: '#1C1C1E',
    borderWidth: 1, borderColor: '#E2E8F0', marginBottom: normalize(16),
  },
  textArea: { height: normalize(100), textAlignVertical: 'top' },
  iconContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: normalize(16) },
  iconItem: {
    flex: 1, alignItems: 'center', padding: normalize(12), borderRadius: normalize(12),
    backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', marginHorizontal: normalize(4),
  },
  iconItemActive: { borderColor: '#0084F4', backgroundColor: '#EFF6FF' },
  iconLabel: { fontSize: normalize(11), fontWeight: '700', color: '#64748B', marginTop: normalize(4) },
  iconLabelActive: { color: '#0084F4' },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  mapLink: { flexDirection: 'row', alignItems: 'center' },
  mapLinkText: { fontSize: normalize(13), fontWeight: '700', color: '#0084F4', marginLeft: normalize(4) },
  bottomBar: {
    padding: normalize(20), borderTopWidth: 1, borderTopColor: '#F1F5F9',
  },
  submitBtn: {
    backgroundColor: '#0084F4', paddingVertical: normalize(16), borderRadius: normalize(16),
    alignItems: 'center',
  },
  submitBtnText: { fontSize: normalize(15), fontWeight: '800', color: '#FFFFFF' },
});
