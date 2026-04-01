import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
  Modal,
  Platform,
  Alert,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import normalize from 'react-native-normalize';
import { RootStackParamList } from '../../types/navigation';
import Toast from 'react-native-toast-message';

type Props = NativeStackScreenProps<RootStackParamList, 'KelolaLayanan'>;

const INITIAL_SERVICES = [
  { id: '1', name: 'Cuci Kiloan (Reguler)', category: 'Kiloan', price: '7000', unit: '/kg', isActive: true, icon: 'washing-machine' },
  { id: '2', name: 'Cuci Kiloan (Ekspres)', category: 'Kiloan', price: '12000', unit: '/kg', isActive: true, icon: 'flash-outline' },
  { id: '3', name: 'Setrika Saja', category: 'Kiloan', price: '5000', unit: '/kg', isActive: true, icon: 'iron-outline' },
  { id: '4', name: 'Bed Cover (Besar)', category: 'Bedding', price: '45000', unit: '/pcs', isActive: true, icon: 'bed-outline' },
  { id: '5', name: 'Selimut (Kecil)', category: 'Bedding', price: '25000', unit: '/pcs', isActive: false, icon: 'bed-outline' },
  { id: '6', name: 'Jas Set', category: 'Satuan', price: '50000', unit: '/set', isActive: true, icon: 'tie' },
];

const CATEGORIES = ['Kiloan', 'Satuan', 'Bedding', 'Sepatu', 'Lainnya'];
const UNITS = ['/kg', '/pcs', '/set', '/m2'];

export const KelolaLayananScreen = ({ navigation }: Props) => {
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('Kiloan');
  const [newUnit, setNewUnit] = useState('/kg');

  const toggleService = (id: string) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s));
  };

  const handlePriceChange = (id: string, newPrice: string) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, price: newPrice } : s));
  };

  const handleDeleteService = (id: string, name: string) => {
    Alert.alert(
      'Hapus Layanan',
      `Apakah Anda yakin ingin menghapus layanan "${name}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Hapus', 
          style: 'destructive',
          onPress: () => {
            setServices(prev => prev.filter(s => s.id !== id));
            Toast.show({ type: 'success', text1: 'Layanan berhasil dihapus' });
          }
        },
      ]
    );
  };

  const clearInputs = () => {
    setNewName('');
    setNewPrice('');
    setNewCategory('Kiloan');
    setNewUnit('/kg');
  };

  const handleAddService = () => {
    if (!newName.trim() || !newPrice.trim()) {
      Toast.show({ type: 'error', text1: 'Nama dan harga wajib diisi' });
      return;
    }

    const newId = (services.length + 1).toString();
    const serviceIcon = newCategory === 'Kiloan' ? 'washing-machine' :
      newCategory === 'Bedding' ? 'bed-outline' :
        newCategory === 'Satuan' ? 'tie' : 'dots-horizontal';

    const newServiceObj = {
      id: newId,
      name: newName.trim(),
      category: newCategory,
      price: newPrice,
      unit: newUnit,
      isActive: true,
      icon: serviceIcon,
    };

    setServices([newServiceObj, ...services]);
    setShowAddModal(false);
    clearInputs();
    Toast.show({ type: 'success', text1: 'Layanan baru ditambahkan' });
  };

  const handleSave = () => {
    Toast.show({ type: 'success', text1: 'Layanan berhasil diperbarui' });
    setTimeout(() => navigation.goBack(), 800);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={normalize(22)} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kelola Layanan</Text>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveText}>Simpan</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.infoText}>Atur harga dan ketersediaan layanan yang Anda tawarkan ke pelanggan.</Text>

        {services.map((service) => (
          <View key={service.id} style={[styles.serviceCard, !service.isActive && styles.disabledCard]}>
            <View style={styles.serviceTop}>
              <View style={[styles.iconContainer, { backgroundColor: service.isActive ? '#DBEAFE' : '#F1F5F9' }]}>
                <MaterialCommunityIcons name={service.icon as any} size={normalize(24)} color={service.isActive ? '#0084F4' : '#94A3B8'} />
              </View>
              <View style={styles.serviceInfo}>
                <Text style={[styles.serviceName, !service.isActive && { color: '#94A3B8' }]}>{service.name}</Text>
                <Text style={styles.categoryBadge}>{service.category}</Text>
              </View>
              <View style={styles.actionRow}>
                <TouchableOpacity 
                  style={styles.deleteBtn} 
                  onPress={() => handleDeleteService(service.id, service.name)}
                >
                  <MaterialCommunityIcons name="trash-can-outline" size={normalize(20)} color="#EF4444" />
                </TouchableOpacity>
                <Switch 
                  trackColor={{ false: '#E2E8F0', true: '#DCFCE7' }} 
                  thumbColor={service.isActive ? '#10B981' : '#FFFFFF'} 
                  onValueChange={() => toggleService(service.id)} 
                  value={service.isActive} 
                />
              </View>
            </View>

            <View style={styles.priceRow}>
              <View style={styles.priceInputWrapper}>
                <Text style={styles.currencyLabel}>Rp</Text>
                <TextInput style={styles.priceInput} value={service.price} onChangeText={(val) => handlePriceChange(service.id, val)} keyboardType="numeric" editable={service.isActive} />
              </View>
              <Text style={styles.unitLabel}>{service.unit}</Text>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddModal(true)}>
          <Ionicons name="add-circle-outline" size={normalize(24)} color="#10B981" />
          <Text style={styles.addBtnText}>Tambah Layanan Baru</Text>
        </TouchableOpacity>

        <View style={{ height: normalize(40) }} />
      </ScrollView>

      {/* Add Service Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Tambah Layanan</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={normalize(24)} color="#1C1C1E" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Nama Layanan</Text>
                <TextInput
                  style={styles.modalInput}
                  value={newName}
                  onChangeText={setNewName}
                  placeholder="Contoh: Cuci Kiloan Super"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Kategori</Text>
                <View style={styles.chipRow}>
                  {CATEGORIES.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[styles.chip, newCategory === cat && styles.chipActive]}
                      onPress={() => setNewCategory(cat)}
                    >
                      <Text style={[styles.chipText, newCategory === cat && styles.chipTextActive]}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Harga</Text>
                <View style={styles.modalPriceInputWrapper}>
                  <Text style={styles.modalCurrency}>Rp</Text>
                  <TextInput
                    style={styles.modalPriceInput}
                    value={newPrice}
                    onChangeText={setNewPrice}
                    placeholder="0"
                    placeholderTextColor="#94A3B8"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Satuan</Text>
                <View style={styles.chipRow}>
                  {UNITS.map((unit) => (
                    <TouchableOpacity
                      key={unit}
                      style={[styles.chip, newUnit === unit && styles.chipActive]}
                      onPress={() => setNewUnit(unit)}
                    >
                      <Text style={[styles.chipText, newUnit === unit && styles.chipTextActive]}>
                        {unit}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity style={styles.modalSubmitBtn} onPress={handleAddService}>
                <Text style={styles.modalSubmitText}>Tambah Layanan</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  infoText: { fontSize: normalize(13), color: '#64748B', lineHeight: normalize(20), marginBottom: normalize(20), marginLeft: normalize(4) },
  serviceCard: { backgroundColor: '#FFFFFF', borderRadius: normalize(20), padding: normalize(16), marginBottom: normalize(16), shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2, borderWidth: 1, borderColor: '#F1F5F9' },
  disabledCard: { opacity: 0.8, backgroundColor: '#F8FAFC' },
  serviceTop: { flexDirection: 'row', alignItems: 'center', marginBottom: normalize(20) },
  iconContainer: { width: normalize(48), height: normalize(48), borderRadius: normalize(14), justifyContent: 'center', alignItems: 'center' },
  serviceInfo: { flex: 1, marginLeft: normalize(15) },
  serviceName: { fontSize: normalize(15), fontWeight: '700', color: '#1C1C1E' },
  categoryBadge: { fontSize: normalize(10), fontWeight: '700', color: '#0084F4', backgroundColor: '#EFF6FF', paddingHorizontal: normalize(8), paddingVertical: normalize(4), borderRadius: normalize(6), alignSelf: 'flex-start', marginTop: 4, textTransform: 'uppercase' },
  actionRow: { flexDirection: 'row', alignItems: 'center' },
  deleteBtn: { marginRight: normalize(12), padding: normalize(4) },
  priceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: normalize(15), borderTopWidth: 1, borderTopColor: '#F8FAFC' },
  priceInputWrapper: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  currencyLabel: { fontSize: normalize(14), fontWeight: '700', color: '#64748B', marginRight: normalize(8) },
  priceInput: { fontSize: normalize(18), fontWeight: '800', color: '#1C1C1E', flex: 1, padding: 0 },
  unitLabel: { fontSize: normalize(14), fontWeight: '600', color: '#94A3B8' },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#DCFCE7', paddingVertical: normalize(14), borderRadius: normalize(16), marginTop: normalize(8), borderStyle: 'dashed', borderWidth: 1, borderColor: '#10B981' },
  addBtnText: { fontSize: normalize(14), fontWeight: '700', color: '#10B981', marginLeft: normalize(8) },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: normalize(28),
    borderTopRightRadius: normalize(28),
    paddingHorizontal: normalize(20),
    paddingTop: normalize(20),
    paddingBottom: Platform.OS === 'ios' ? normalize(40) : normalize(20),
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(24),
  },
  modalTitle: {
    fontSize: normalize(20),
    fontWeight: '800',
    color: '#1C1C1E',
  },
  inputSection: {
    marginBottom: normalize(20),
  },
  inputLabel: {
    fontSize: normalize(13),
    fontWeight: '700',
    color: '#475569',
    marginBottom: normalize(8),
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  modalInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: normalize(14),
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(12),
    fontSize: normalize(15),
    color: '#1C1C1E',
    fontWeight: '600',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  modalPriceInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: normalize(14),
    paddingHorizontal: normalize(16),
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  modalCurrency: {
    fontSize: normalize(15),
    fontWeight: '700',
    color: '#64748B',
    marginRight: normalize(8),
  },
  modalPriceInput: {
    flex: 1,
    paddingVertical: normalize(12),
    fontSize: normalize(18),
    fontWeight: '800',
    color: '#1C1C1E',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: normalize(-4),
  },
  chip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(8),
    borderRadius: normalize(10),
    margin: normalize(4),
  },
  chipActive: {
    backgroundColor: '#0084F4',
  },
  chipText: {
    fontSize: normalize(13),
    fontWeight: '600',
    color: '#64748B',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  modalSubmitBtn: {
    backgroundColor: '#10B981',
    paddingVertical: normalize(16),
    borderRadius: normalize(16),
    alignItems: 'center',
    marginTop: normalize(12),
    marginBottom: normalize(10),
  },
  modalSubmitText: {
    color: '#FFFFFF',
    fontSize: normalize(16),
    fontWeight: '700',
  },
});
