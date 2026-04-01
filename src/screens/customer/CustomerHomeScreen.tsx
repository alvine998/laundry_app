import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  RefreshControl,
  BackHandler,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import normalize from 'react-native-normalize';
import { RootStackParamList } from '../../types/navigation';
import { CustomerTabParamList } from '../../navigation/CustomerTabNavigator';
import { StorageService } from '../../services/StorageService';
import Toast from 'react-native-toast-message';

type Props = CompositeScreenProps<
  BottomTabScreenProps<CustomerTabParamList, 'Dashboard'>,
  NativeStackScreenProps<RootStackParamList>
>;

const SERVICES = [
  { id: '1', name: 'Kiloan', icon: 'weight-kilogram', color: '#0084F4' },
  { id: '2', name: 'Satuan', icon: 'tshirt-crew-outline', color: '#10B981' },
  { id: '3', name: 'Bedding', icon: 'bed-outline', color: '#F59E0B' },
  { id: '4', name: 'Sepatu', icon: 'shoe-sneaker', color: '#EF4444' },
];

const NEARBY_MOCK = [
  { id: 'L-001', name: 'Clean & Fresh', rating: 4.8, distance: '0.5 km', image: 'https://images.unsplash.com/photo-1545173153-5dd9a66d939a?q=80&w=2671' },
  { id: 'L-002', name: 'Super Wash', rating: 4.7, distance: '0.8 km', image: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?q=80&w=2670' },
  { id: 'L-003', name: 'Baba Laundry', rating: 4.9, distance: '1.2 km', image: 'https://images.unsplash.com/photo-1604335399105-a0c5e5ad3127?q=80&w=2670' },
];

export const CustomerHomeScreen = ({ navigation }: Props) => {
  const [refreshing, setRefreshing] = useState(false);
  const [address, setAddress] = useState('Jl. Sudirman No. 123, Jakarta Selatan');
  const [balance, setBalance] = useState(0);
  const [points, setPoints] = useState(0);
  const [activeOrders, setActiveOrders] = useState<any[]>([]);
  const backPressCount = useRef(0);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (backPressCount.current === 0) {
          backPressCount.current = 1;
          Toast.show({
            type: 'info',
            text1: 'Tekan sekali lagi untuk keluar',
            position: 'bottom',
            visibilityTime: 2000,
          });
          setTimeout(() => {
            backPressCount.current = 0;
          }, 2000);
          return true;
        } else {
          BackHandler.exitApp();
          return true;
        }
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );

      const fetchData = async () => {
        const session = await StorageService.getUserSession();
        if (session) {
          setBalance(session.balance || 0);
          setPoints(session.loyaltyPoints || 0);
        }

        const orders = await StorageService.getActiveOrders();
        setActiveOrders(orders);
      };
      fetchData();

      return () => backHandler.remove();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleAddressPress = () => {
    navigation.navigate('MapPicker', {
      onSelect: (newAddress: string) => setAddress(newAddress),
    });
  };
  const handleLogout = async () => {
    await StorageService.clearSession();
    navigation.getParent()?.reset({
      index: 0,
      routes: [{ name: 'Onboarding' }],
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.decorativeBg} />
      <ScrollView
        stickyHeaderIndices={[1, 2]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0084F4" colors={['#0084F4']} />
        }
      >
        {/* Header - Address & Profile */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.addressContainer}
            activeOpacity={0.7}
            onPress={handleAddressPress}
          >
            <Ionicons name="location" size={normalize(20)} color="#EF4444" />
            <View style={styles.addressTextWrapper}>
              <Text style={styles.addressLabel}>Alamat Penjemputan</Text>
              <Text style={styles.addressValue} numberOfLines={1}>
                {address}
              </Text>
            </View>
            <Ionicons name="chevron-down" size={normalize(18)} color="#64748B" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={styles.profileBtn}>
            <MaterialCommunityIcons name="logout" size={normalize(24)} color="#1C1C1E" />
          </TouchableOpacity>
        </View>

        {/* Active Orders Section - Always index 1 for sticky stability */}
        <View key="sticky-orders" style={[styles.stickyWrapper, activeOrders.length === 0 && { height: 0 }]}>
          {activeOrders.length > 0 && (
            <View style={styles.activeOrdersSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Pesanan Aktif</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Riwayat')}>
                  <Text style={styles.seeAllText}>Riwayat</Text>
                </TouchableOpacity>
              </View>
              {activeOrders.map((order) => (
                <TouchableOpacity
                  key={order.id}
                  style={styles.activeOrderCard}
                  onPress={() => navigation.navigate('OrderTracking', { orderId: order.id })}
                >
                  <View style={styles.activeOrderIcon}>
                    <MaterialCommunityIcons name="washing-machine" size={normalize(24)} color="#FFFFFF" />
                  </View>
                  <View style={styles.activeOrderInfo}>
                    <Text style={styles.activeOrderName}>{order.partnerName}</Text>
                    <Text style={styles.activeOrderStatus}>{order.status}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={normalize(20)} color="#94A3B8" />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>



        {/* Balance Card - GoPay Style */}
        <View style={styles.balanceSection}>
          {/* Wallet & Points Card */}
          <View style={styles.walletCard}>
            <View style={styles.walletInfo}>
              <TouchableOpacity
                style={styles.walletItem}
                onPress={() => navigation.navigate('Riwayat', { initialTab: 'Saldo' })}
              >
                <View style={styles.walletHeader}>
                  <MaterialCommunityIcons name="wallet-outline" size={normalize(18)} color="#64748B" />
                  <Text style={styles.walletLabel}>Saldo Hub</Text>
                </View>
                <Text style={styles.walletValue}>Rp {balance.toLocaleString('id-ID')}</Text>
              </TouchableOpacity>
              <View style={styles.walletDivider} />
              <TouchableOpacity
                style={styles.walletItem}
                onPress={() => navigation.navigate('Riwayat', { initialTab: 'Poin' })}
              >
                <View style={styles.walletHeader}>
                  <MaterialCommunityIcons name="star-circle" size={normalize(18)} color="#F59E0B" />
                  <Text style={styles.walletLabel}>Loyalty Poin</Text>
                </View>
                <Text style={[styles.walletValue, { color: '#F59E0B' }]}>{points} Poin</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.topupBtn} onPress={() => navigation.navigate('Topup')}>
              <Ionicons name="add-circle" size={normalize(20)} color="#FFFFFF" />
              <Text style={styles.topupText}>Top Up</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Service Categories */}
        <View style={styles.serviceSection}>
          <Text style={styles.sectionTitle}>Layanan Kami</Text>
          <View style={styles.serviceGrid}>
            {SERVICES.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.serviceItem}
                onPress={() => navigation.navigate('PartnerList', { service: item })}
              >
                <View style={[styles.serviceIcon, { backgroundColor: item.color + '15' }]}>
                  <MaterialCommunityIcons name={item.icon} size={normalize(28)} color={item.color} />
                </View>
                <Text style={styles.serviceName}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Nearby Laundry Section */}
        <View style={styles.nearbySection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Laundry Terdekat</Text>
            <TouchableOpacity onPress={() => navigation.navigate('NearbyLaundry')}>
              <Text style={styles.seeAllText}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.nearbyScroll}>
            {NEARBY_MOCK.map((item) => (
              <TouchableOpacity key={item.id} style={styles.nearbyCard} onPress={() => navigation.navigate('NearbyLaundry')}>
                <Image source={{ uri: item.image }} style={styles.nearbyImage} />
                <View style={styles.nearbyContent}>
                  <Text style={styles.nearbyName} numberOfLines={1}>{item.name}</Text>
                  <View style={styles.nearbyInfo}>
                    <Ionicons name="star" size={normalize(12)} color="#F59E0B" />
                    <Text style={styles.nearbyRating}>{item.rating}</Text>
                    <Text style={styles.nearbyDot}>•</Text>
                    <Text style={styles.nearbyDistance}>{item.distance}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Promotions Banner */}
        <View style={styles.promoSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Promo Spesial</Text>
            <TouchableOpacity onPress={() => navigation.navigate('PromoSpesial')}>
              <Text style={styles.seeAllText}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.promoScroll}>
            <View style={[styles.promoCard, { backgroundColor: '#DBEAFE' }]}>
              <Text style={styles.promoTitle}>Potongan 50%</Text>
              <Text style={styles.promoSubtitle}>Untuk pengguna baru</Text>
              <MaterialCommunityIcons name="tag-heart" size={normalize(60)} color="#0084F4" style={styles.promoIcon} />
            </View>
            <View style={[styles.promoCard, { backgroundColor: '#DCFCE7' }]}>
              <Text style={styles.promoTitle}>Gratis Ongkir</Text>
              <Text style={styles.promoSubtitle}>Min. order Rp 30.000</Text>
              <MaterialCommunityIcons name="truck-fast" size={normalize(60)} color="#10B981" style={styles.promoIcon} />
            </View>
          </ScrollView>
        </View>

        {/* Bottom Padding */}
        <View style={{ height: normalize(40) }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  decorativeBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderBottomLeftRadius: normalize(40),
    borderBottomRightRadius: normalize(40),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: normalize(20),
    paddingTop: normalize(15),
    paddingBottom: normalize(10),
  },
  addressContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: normalize(10),
    borderRadius: normalize(12),
    marginRight: normalize(12),
  },
  addressTextWrapper: {
    flex: 1,
    marginLeft: normalize(8),
  },
  addressLabel: {
    fontSize: normalize(10),
    color: '#64748B',
    fontWeight: '600',
  },
  addressValue: {
    fontSize: normalize(13),
    color: '#1C1C1E',
    fontWeight: '700',
  },
  profileBtn: {
    padding: normalize(8),
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: normalize(12),
  },
  searchSection: {
    backgroundColor: 'transparent',
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(12),
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: normalize(14),
    paddingHorizontal: normalize(15),
    height: normalize(48),
  },
  searchInput: {
    flex: 1,
    marginLeft: normalize(10),
    fontSize: normalize(15),
    color: '#1C1C1E',
  },
  balanceSection: {
    paddingHorizontal: normalize(20),
    marginTop: normalize(10),
  },
  walletCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(20),
    padding: normalize(20),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  walletInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  walletItem: {
    flex: 1,
  },
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(4),
  },
  walletLabel: {
    fontSize: normalize(11),
    color: '#64748B',
    fontWeight: '700',
    marginLeft: normalize(4),
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  walletValue: {
    fontSize: normalize(16),
    fontWeight: '900',
    color: '#1C1C1E',
  },
  walletDivider: {
    width: 1,
    height: normalize(30),
    backgroundColor: '#F1F5F9',
    marginHorizontal: normalize(15),
  },
  topupBtn: {
    backgroundColor: '#0084F4',
    paddingHorizontal: normalize(15),
    paddingVertical: normalize(10),
    borderRadius: normalize(12),
    flexDirection: 'row',
    alignItems: 'center',
  },
  topupText: {
    color: '#FFFFFF',
    fontWeight: '700',
    marginLeft: normalize(5),
    fontSize: normalize(12),
  },
  sectionTitle: {
    fontSize: normalize(18),
    fontWeight: '800',
    color: '#1C1C1E',
  },
  stickyWrapper: {
    backgroundColor: '#F8FAFC',
    zIndex: -1,
  },
  activeOrdersSection: {
    paddingHorizontal: normalize(20),
    paddingTop: normalize(24),
    paddingBottom: normalize(8),
    backgroundColor: '#F8FAFC',
  },
  activeOrderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(20),
    padding: normalize(16),
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: normalize(12),
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  activeOrderIcon: {
    width: normalize(48),
    height: normalize(48),
    borderRadius: normalize(14),
    backgroundColor: '#0084F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalize(16),
  },
  activeOrderInfo: {
    flex: 1,
  },
  activeOrderName: {
    fontSize: normalize(15),
    fontWeight: '800',
    color: '#1C1C1E',
  },
  activeOrderStatus: {
    fontSize: normalize(13),
    color: '#0084F4',
    fontWeight: '700',
    marginTop: normalize(2),
  },
  serviceSection: {
    marginTop: normalize(24),
    paddingHorizontal: normalize(20),
  },
  serviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: normalize(20),
  },
  serviceItem: {
    width: '23%',
    alignItems: 'center',
    marginBottom: normalize(20),
  },
  serviceIcon: {
    width: normalize(52),
    height: normalize(52),
    borderRadius: normalize(16),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: normalize(8),
  },
  serviceName: {
    fontSize: normalize(11),
    fontWeight: '600',
    color: '#475569',
    textAlign: 'center',
  },
  promoSection: {
    marginTop: normalize(10),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: normalize(20),
    marginBottom: normalize(16),
  },
  seeAllText: {
    fontSize: normalize(14),
    fontWeight: '700',
    color: '#0084F4',
  },
  nearbySection: {
    marginTop: normalize(10),
  },
  nearbyScroll: {
    paddingLeft: normalize(20),
  },
  nearbyCard: {
    width: normalize(160),
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(20),
    marginRight: normalize(15),
    marginBottom: normalize(15),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    overflow: 'hidden',
  },
  nearbyImage: {
    width: '100%',
    height: normalize(100),
    backgroundColor: '#F1F5F9',
  },
  nearbyContent: {
    padding: normalize(12),
  },
  nearbyName: {
    fontSize: normalize(14),
    fontWeight: '800',
    color: '#1C1C1E',
    marginBottom: normalize(4),
  },
  nearbyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nearbyRating: {
    fontSize: normalize(12),
    fontWeight: '700',
    color: '#1F2937',
    marginLeft: normalize(2),
  },
  nearbyDot: {
    marginHorizontal: normalize(4),
    color: '#94A3B8',
  },
  nearbyDistance: {
    fontSize: normalize(11),
    color: '#64748B',
    fontWeight: '600',
  },
  promoScroll: {
    paddingLeft: normalize(20),
  },
  promoCard: {
    width: normalize(280),
    height: normalize(140),
    borderRadius: normalize(20),
    padding: normalize(20),
    marginRight: normalize(15),
    position: 'relative',
    overflow: 'hidden',
  },
  promoTitle: {
    fontSize: normalize(22),
    fontWeight: '900',
    color: '#1C1C1E',
  },
  promoSubtitle: {
    fontSize: normalize(14),
    fontWeight: '600',
    color: '#475569',
    marginTop: normalize(4),
  },
  promoIcon: {
    position: 'absolute',
    bottom: normalize(-10),
    right: normalize(10),
    opacity: 0.2,
  },
});
