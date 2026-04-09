import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import normalize from 'react-native-normalize';
import { RootStackParamList } from '../../types/navigation';
import { StorageService } from '../../services/StorageService';
import { Address } from '../../types/address';
import Toast from 'react-native-toast-message';

type Props = NativeStackScreenProps<RootStackParamList, 'AlamatSaya'>;

export const AlamatSayaScreen = ({ navigation }: Props) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadAddresses();
    });

    loadAddresses();
    return unsubscribe;
  }, [navigation]);

  const loadAddresses = async () => {
    setIsLoading(true);
    const data = await StorageService.getAddresses();
    setAddresses(data);
    setIsLoading(false);
  };

  const handleSetDefault = async (id: string) => {
    await StorageService.setDefaultAddress(id);
    loadAddresses();
    Toast.show({ type: 'success', text1: 'Alamat utama berhasil diubah' });
  };

  const handleDelete = (id: string) => {
    Alert.alert('Hapus Alamat', 'Yakin ingin menghapus alamat ini?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          await StorageService.deleteAddress(id);
          loadAddresses();
          Toast.show({ type: 'success', text1: 'Alamat berhasil dihapus' });
        },
      },
    ]);
  };

  const handleEdit = (address: Address) => {
    navigation.navigate('ManageAlamat', { address });
  };

  const handleAdd = () => {
    navigation.navigate('ManageAlamat', {});
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={normalize(22)} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Alamat Saya</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {addresses.map((item) => (
          <View key={item.id} style={[styles.addressCard, item.isDefault && styles.addressCardDefault]}>
            <View style={styles.cardTop}>
              <View style={[styles.labelBadge, { backgroundColor: item.isDefault ? '#DBEAFE' : '#F1F5F9' }]}>
                <MaterialCommunityIcons name={item.icon as any} size={normalize(16)} color={item.isDefault ? '#0084F4' : '#64748B'} />
                <Text style={[styles.labelText, item.isDefault && { color: '#0084F4' }]}>{item.label}</Text>
              </View>
              {item.isDefault && (
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultText}>Utama</Text>
                </View>
              )}
            </View>

            <Text style={styles.cardName}>{item.name}</Text>
            <Text style={styles.cardPhone}>{item.phone}</Text>
            <Text style={styles.cardAddress}>{item.address}</Text>

            <View style={styles.cardActions}>
              {!item.isDefault && (
                <TouchableOpacity style={styles.actionBtn} onPress={() => handleSetDefault(item.id)}>
                  <MaterialCommunityIcons name="check-circle-outline" size={normalize(16)} color="#0084F4" />
                  <Text style={styles.actionTextBlue}>Jadikan Utama</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity 
                style={[styles.actionBtn, { marginLeft: item.isDefault ? 0 : normalize(20) }]} 
                onPress={() => handleEdit(item)}
              >
                <MaterialCommunityIcons name="pencil-outline" size={normalize(16)} color="#64748B" />
                <Text style={styles.actionTextGray}>Ubah</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionBtn, { marginLeft: normalize(20) }]} 
                onPress={() => handleDelete(item.id)}
              >
                <MaterialCommunityIcons name="trash-can-outline" size={normalize(16)} color="#EF4444" />
                <Text style={styles.actionTextRed}>Hapus</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {!isLoading && addresses.length === 0 && (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="map-marker-off-outline" size={normalize(64)} color="#E2E8F0" />
            <Text style={styles.emptyTitle}>Belum ada alamat</Text>
            <Text style={styles.emptySubtitle}>Tambahkan alamat untuk mempermudah penjemputan</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.addBtn} activeOpacity={0.8} onPress={handleAdd}>
          <Ionicons name="add-circle" size={normalize(20)} color="#FFFFFF" />
          <Text style={styles.addBtnText}>Tambah Alamat Baru</Text>
        </TouchableOpacity>
      </View>
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
  content: { padding: normalize(20), paddingBottom: normalize(100) },
  addressCard: {
    backgroundColor: '#FFFFFF', borderRadius: normalize(20), padding: normalize(20),
    marginBottom: normalize(16), borderWidth: 1.5, borderColor: '#F1F5F9',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1,
  },
  addressCardDefault: { borderColor: '#0084F4', borderWidth: 1.5 },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: normalize(12) },
  labelBadge: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: normalize(12), paddingVertical: normalize(6), borderRadius: normalize(20),
  },
  labelText: { fontSize: normalize(12), fontWeight: '700', color: '#64748B', marginLeft: normalize(6) },
  defaultBadge: {
    backgroundColor: '#DBEAFE', paddingHorizontal: normalize(10), paddingVertical: normalize(4), borderRadius: normalize(12),
  },
  defaultText: { fontSize: normalize(11), fontWeight: '700', color: '#0084F4' },
  cardName: { fontSize: normalize(15), fontWeight: '800', color: '#1C1C1E', marginBottom: normalize(4) },
  cardPhone: { fontSize: normalize(13), fontWeight: '600', color: '#64748B', marginBottom: normalize(8) },
  cardAddress: { fontSize: normalize(13), color: '#475569', lineHeight: normalize(20) },
  cardActions: { flexDirection: 'row', marginTop: normalize(16), borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: normalize(12) },
  actionBtn: { flexDirection: 'row', alignItems: 'center' },
  actionTextBlue: { fontSize: normalize(12), fontWeight: '700', color: '#0084F4', marginLeft: normalize(6) },
  actionTextRed: { fontSize: normalize(12), fontWeight: '700', color: '#EF4444', marginLeft: normalize(6) },
  actionTextGray: { fontSize: normalize(12), fontWeight: '700', color: '#64748B', marginLeft: normalize(6) },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: normalize(80) },
  emptyTitle: { fontSize: normalize(18), fontWeight: '800', color: '#1C1C1E', marginTop: normalize(16) },
  emptySubtitle: { fontSize: normalize(14), color: '#64748B', marginTop: normalize(8), textAlign: 'center' },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: normalize(20), backgroundColor: '#FFFFFF',
    borderTopWidth: 1, borderTopColor: '#F1F5F9',
  },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#0084F4', paddingVertical: normalize(16), borderRadius: normalize(16),
  },
  addBtnText: { fontSize: normalize(15), fontWeight: '700', color: '#FFFFFF', marginLeft: normalize(8) },
});
