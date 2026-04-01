import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import normalize from 'react-native-normalize';
import { RootStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'PartnerList'>;

const MOCK_PARTNERS = [
  { 
    id: 'P-001', 
    name: 'Clean & Fresh Laundry', 
    rating: 4.8, 
    distance: '0.5 km', 
    price: 7000, 
    orders: 1240, 
    image: 'https://images.unsplash.com/photo-1545173153-5dd9a66d939a?q=80&w=2671',
    description: 'Spesialis cuci kiloan dengan parfum premium.',
    address: 'Jl. Sudirman No. 12, Jakarta',
    latitude: -6.22416, 
    longitude: 106.81232,
    services: [
      { 
        id: '1', 
        name: 'Kiloan', 
        icon: 'weight-kilogram', 
        color: '#0084F4', 
        price: 7000,
        packages: [
          { id: 'K-REG', name: 'Reguler', time: '2 Hari', price: 7000 },
          { id: 'K-EXP', name: 'Express', time: '24 Jam', price: 10000 },
          { id: 'K-FLS', name: 'Kilat', time: '6 Jam', price: 15000 },
        ]
      },
      { id: '2', name: 'Satuan', icon: 'tshirt-crew-outline', color: '#10B981', price: 15000 },
      { id: '3', name: 'Bedding', icon: 'bed-outline', color: '#F59E0B', price: 45000 },
    ]
  },
  { 
    id: 'P-002', 
    name: 'Super Wash Express', 
    rating: 4.7, 
    distance: '0.8 km', 
    price: 8000, 
    orders: 850, 
    image: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?q=80&w=2670',
    description: 'Cuci kilat 6 jam selesai.',
    address: 'Jl. Thamrin No. 45, Jakarta',
    latitude: -6.18561, 
    longitude: 106.82264,
    services: [
      { 
        id: '1', 
        name: 'Kiloan', 
        icon: 'weight-kilogram', 
        color: '#0084F4', 
        price: 8000,
        packages: [
          { id: 'K-REG', name: 'Reguler', time: '2 Hari', price: 8000 },
          { id: 'K-EXP', name: 'Express', time: '24 Jam', price: 12000 },
        ]
      },
      { id: '4', name: 'Sepatu', icon: 'shoe-sneaker', color: '#EF4444', price: 35000 },
    ]
  },
  { 
    id: 'P-003', 
    name: 'Baba Laundry', 
    rating: 4.9, 
    distance: '1.2 km', 
    price: 6500, 
    orders: 2100, 
    image: 'https://images.unsplash.com/photo-1604335399105-a0c5e5ad3127?q=80&w=2670',
    description: 'Harga ekonomis, hasil higienis.',
    address: 'Jl. Gatot Subroto No. 8, Jakarta',
    latitude: -6.22384, 
    longitude: 106.81432,
    services: [
      { 
        id: '1', 
        name: 'Kiloan', 
        icon: 'weight-kilogram', 
        color: '#0084F4', 
        price: 6500,
        packages: [
          { id: 'K-REG', name: 'Reguler', time: '2 Hari', price: 6500 },
          { id: 'K-EXP', name: 'Express', time: '24 Jam', price: 9500 },
          { id: 'K-FLS', name: 'Kilat', time: '12 Jam', price: 13000 },
        ]
      },
      { id: '2', name: 'Satuan', icon: 'tshirt-crew-outline', color: '#10B981', price: 12000 },
    ]
  },
];

const FILTERS = ['Terdekat', 'Rating 4.5+', 'Termurah'];

export const PartnerListScreen = ({ navigation, route }: Props) => {
  const { service } = route.params;
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('Terdekat');

  // Filter partners by the selected service AND search query
  const filteredPartners = MOCK_PARTNERS.filter(partner => {
    const hasService = partner.services.some(s => s.name === service.name);
    const matchesSearch = partner.name.toLowerCase().includes(search.toLowerCase());
    return hasService && matchesSearch;
  });

  const renderPartner = ({ item }: { item: typeof MOCK_PARTNERS[0] }) => (
    <TouchableOpacity 
      style={styles.partnerCard} 
      activeOpacity={0.9}
      onPress={() => navigation.navigate('PartnerDetail', { partner: item, service })}
    >
      <Image source={{ uri: item.image }} style={styles.partnerImage} />
      <View style={styles.partnerContent}>
        <View style={styles.partnerHeader}>
          <Text style={styles.partnerName} numberOfLines={1}>{item.name}</Text>
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={normalize(12)} color="#F59E0B" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>
        
        <View style={styles.partnerStats}>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="map-marker-distance" size={normalize(14)} color="#64748B" />
            <Text style={styles.statText}>{item.distance}</Text>
          </View>
          <Text style={styles.statDot}>•</Text>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="basket-check" size={normalize(14)} color="#64748B" />
            <Text style={styles.statText}>{item.orders} Pesanan</Text>
          </View>
        </View>

        <View style={styles.partnerFooter}>
          <Text style={styles.priceLabel}>Mulai dari</Text>
          <Text style={styles.priceValue}>
            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(item.price)}
            <Text style={styles.priceUnit}> /kg</Text>
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={normalize(24)} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mitra {service.name}</Text>
        <View style={{ width: normalize(44) }} />
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={normalize(20)} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder={`Cari mitra ${service.name}...`}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <View style={styles.filterContainer}>
        <FlatList
          data={FILTERS}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[styles.filterChip, activeFilter === item && styles.filterChipActive]}
              onPress={() => setActiveFilter(item)}
            >
              <Text style={[styles.filterText, activeFilter === item && styles.filterTextActive]}>{item}</Text>
            </TouchableOpacity>
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
        />
      </View>

      {filteredPartners.length > 0 ? (
        <FlatList
          data={filteredPartners}
          renderItem={renderPartner}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<View style={{ height: normalize(20) }} />}
        />
      ) : (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="store-remove-outline" size={normalize(80)} color="#E2E8F0" />
          <Text style={styles.emptyText}>Belum ada mitra untuk layanan {service.name}</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(15),
    backgroundColor: '#FFFFFF',
  },
  backBtn: {
    width: normalize(44),
    height: normalize(44),
    borderRadius: normalize(12),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: normalize(18),
    fontWeight: '800',
    color: '#1C1C1E',
  },
  searchSection: {
    padding: normalize(20),
    backgroundColor: '#FFFFFF',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: normalize(15),
    paddingVertical: normalize(12),
    borderRadius: normalize(12),
  },
  searchInput: {
    flex: 1,
    marginLeft: normalize(10),
    fontSize: normalize(14),
    color: '#1C1C1E',
  },
  filterContainer: {
    backgroundColor: '#FFFFFF',
    paddingBottom: normalize(15),
  },
  filterList: {
    paddingHorizontal: normalize(20),
  },
  filterChip: {
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(8),
    borderRadius: normalize(20),
    backgroundColor: '#F1F5F9',
    marginRight: normalize(10),
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterChipActive: {
    backgroundColor: '#0084F4',
    borderColor: '#0084F4',
  },
  filterText: {
    fontSize: normalize(13),
    fontWeight: '600',
    color: '#64748B',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: normalize(20),
  },
  partnerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(20),
    marginBottom: normalize(15),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  partnerImage: {
    width: '100%',
    height: normalize(150),
    backgroundColor: '#F1F5F9',
  },
  partnerContent: {
    padding: normalize(16),
  },
  partnerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(8),
  },
  partnerName: {
    flex: 1,
    fontSize: normalize(16),
    fontWeight: '800',
    color: '#1C1C1E',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: normalize(8),
    paddingVertical: normalize(4),
    borderRadius: normalize(8),
  },
  ratingText: {
    fontSize: normalize(12),
    fontWeight: '700',
    color: '#F59E0B',
    marginLeft: normalize(4),
  },
  partnerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(12),
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: normalize(12),
    color: '#64748B',
    fontWeight: '500',
    marginLeft: normalize(4),
  },
  statDot: {
    marginHorizontal: normalize(8),
    color: '#CBD5E1',
  },
  partnerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: normalize(12),
  },
  priceLabel: {
    fontSize: normalize(12),
    color: '#94A3B8',
    fontWeight: '500',
  },
  priceValue: {
    fontSize: normalize(16),
    fontWeight: '800',
    color: '#0084F4',
  },
  priceUnit: {
    fontSize: normalize(12),
    color: '#64748B',
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: normalize(40),
  },
  emptyText: {
    fontSize: normalize(16),
    fontWeight: '600',
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: normalize(16),
  },
});
