import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
  Linking,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import normalize from 'react-native-normalize';
import { RootStackParamList } from '../../types/navigation';

const { width } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'PartnerDetail'>;

const MOCK_REVIEWS = [
  { id: '1', user: 'Andi Saputra', rating: 5, comment: 'Sangat rapi dan wangi. Cepat juga selesainya!', date: '2 hari yang lalu' },
  { id: '2', user: 'Siti Aminah', rating: 4, comment: 'Harga terjangkau, pelayanan ramah.', date: '5 hari yang lalu' },
];

export const PartnerDetailScreen = ({ navigation, route }: Props) => {
  const { partner, service } = route.params;
  const [isModalVisible, setIsModalVisible] = useState(false);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(val);
  };

  const openMap = () => {
    const { latitude, longitude, name } = partner;
    const lat = latitude || -6.2088;
    const lng = longitude || 106.8456;
    
    const url = Platform.select({
      ios: `maps:0,0?q=${name}@${lat},${lng}`,
      android: `geo:0,0?q=${lat},${lng}(${name})`,
    });

    if (url) {
      Linking.canOpenURL(url).then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          const browserUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
          Linking.openURL(browserUrl);
        }
      });
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroContainer}>
          <Image source={{ uri: partner.image }} style={styles.heroImage} />
          <SafeAreaView style={styles.headerOverlay}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={normalize(24)} color="#FFFFFF" />
            </TouchableOpacity>
          </SafeAreaView>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.mainInfo}>
            <View style={styles.titleRow}>
              <Text style={styles.partnerName}>{partner.name}</Text>
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={normalize(14)} color="#F59E0B" />
                <Text style={styles.ratingText}>{partner.rating}</Text>
              </View>
            </View>
            <View style={styles.locationRow}>
              <Ionicons name="location" size={normalize(16)} color="#EF4444" />
              <Text style={styles.addressText} numberOfLines={1}>{partner.address}</Text>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>5+ Thn</Text>
                <Text style={styles.statLabel}>Pengalaman</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{partner.orders}</Text>
                <Text style={styles.statLabel}>Orders</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.statBox}>
                <Text style={styles.statValue}>6 Jam</Text>
                <Text style={styles.statLabel}>Selesai</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tentang Kami</Text>
            <Text style={styles.description}>{partner.description} Kami selalu mengutamakan kebersihan dan kepuasan pelanggan dengan menggunakan deterjen ramah lingkungan.</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Lokasi Kami</Text>
            <TouchableOpacity style={styles.locationCard} activeOpacity={0.8} onPress={openMap}>
              <View style={styles.locationInfo}>
                <Ionicons name="location" size={normalize(20)} color="#EF4444" />
                <Text style={styles.locationAddress} numberOfLines={2}>{partner.address}</Text>
              </View>
              <View style={styles.mapBtn}>
                <Ionicons name="map-outline" size={normalize(20)} color="#FFFFFF" />
                <Text style={styles.mapBtnText}>Buka di Peta</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Daftar Layanan</Text>
            <View style={styles.serviceItem}>
              <View style={styles.serviceInfo}>
                <View style={styles.serviceIcon}>
                  <MaterialCommunityIcons name="weight-kilogram" size={normalize(22)} color="#0084F4" />
                </View>
                <Text style={styles.serviceName}>Cuci & Gosok (Kiloan)</Text>
              </View>
              <Text style={styles.servicePrice}>{formatCurrency(partner.price)}/kg</Text>
            </View>
            <View style={styles.serviceItem}>
              <View style={styles.serviceInfo}>
                <View style={styles.serviceIcon}>
                  <MaterialCommunityIcons name="tshirt-crew" size={normalize(22)} color="#10B981" />
                </View>
                <Text style={styles.serviceName}>Cuci Satuan</Text>
              </View>
              <Text style={styles.servicePrice}>Dari {formatCurrency(15000)}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Ulasan Pelanggan</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>Lihat Semua</Text>
              </TouchableOpacity>
            </View>
            {MOCK_REVIEWS.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.userName}>{review.user}</Text>
                  <View style={styles.userRating}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Ionicons key={s} name="star" size={normalize(12)} color={s <= review.rating ? "#F59E0B" : "#E2E8F0"} />
                    ))}
                  </View>
                </View>
                <Text style={styles.reviewComment}>{review.comment}</Text>
                <Text style={styles.reviewDate}>{review.date}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.totalLabel}>Partner</Text>
          <Text style={styles.serviceLabel}>{partner.name}</Text>
        </View>
        <TouchableOpacity 
          style={styles.orderBtn}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={styles.orderBtnText}>Pilih Layanan</Text>
        </TouchableOpacity>
      </View>

      {/* Service Selection Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
          <View style={styles.modalBackdrop} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContent}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>Pilih Layanan Laundry</Text>
          <Text style={styles.modalSubtitle}>Silakan pilih jenis layanan yang Anda butuhkan di {partner.name}</Text>
          
          <View style={styles.modalServiceList}>
            {partner.services?.map((item: any) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.modalServiceItem}
                onPress={() => {
                  setIsModalVisible(false);
                  navigation.navigate('ServiceOrder', { service: item, partner });
                }}
              >
                <View style={[styles.modalServiceIcon, { backgroundColor: item.color + '15' }]}>
                  <MaterialCommunityIcons name={item.icon} size={normalize(26)} color={item.color} />
                </View>
                <View style={styles.modalServiceInfo}>
                  <Text style={styles.modalServiceName}>{item.name}</Text>
                  <Text style={styles.modalServiceDesc}>Harga: {formatCurrency(item.price)}{item.name === 'Kiloan' ? '/kg' : ''}</Text>
                </View>
                <Ionicons name="chevron-forward" size={normalize(20)} color="#CBD5E1" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  heroContainer: {
    height: normalize(280),
    width: '100%',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    position: 'absolute',
    top: normalize(10),
    left: normalize(20),
    zIndex: 10,
  },
  backBtn: {
    width: normalize(44),
    height: normalize(44),
    borderRadius: normalize(12),
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: normalize(30),
    borderTopRightRadius: normalize(30),
    marginTop: normalize(-30),
    paddingBottom: normalize(100),
  },
  mainInfo: {
    padding: normalize(20),
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(8),
  },
  partnerName: {
    fontSize: normalize(22),
    fontWeight: '900',
    color: '#1C1C1E',
    flex: 1,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(4),
    borderRadius: normalize(10),
  },
  ratingText: {
    fontSize: normalize(14),
    fontWeight: '700',
    color: '#F59E0B',
    marginLeft: normalize(4),
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(20),
  },
  addressText: {
    fontSize: normalize(14),
    color: '#64748B',
    fontWeight: '500',
    marginLeft: normalize(6),
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: normalize(20),
    padding: normalize(15),
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: normalize(16),
    fontWeight: '800',
    color: '#1C1C1E',
  },
  statLabel: {
    fontSize: normalize(12),
    color: '#94A3B8',
    fontWeight: '600',
    marginTop: normalize(2),
  },
  divider: {
    width: 1,
    height: normalize(30),
    backgroundColor: '#E2E8F0',
  },
  section: {
    padding: normalize(20),
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(15),
  },
  sectionTitle: {
    fontSize: normalize(16),
    fontWeight: '800',
    color: '#1C1C1E',
    marginBottom: normalize(15),
  },
  seeAllText: {
    fontSize: normalize(13),
    color: '#0084F4',
    fontWeight: '700',
  },
  description: {
    fontSize: normalize(14),
    lineHeight: normalize(22),
    color: '#64748B',
    fontWeight: '500',
  },
  locationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(20),
    padding: normalize(16),
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: normalize(10),
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(15),
  },
  locationAddress: {
    flex: 1,
    fontSize: normalize(14),
    color: '#1C1C1E',
    fontWeight: '600',
    marginLeft: normalize(10),
  },
  mapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0084F4',
    paddingVertical: normalize(12),
    borderRadius: normalize(12),
  },
  mapBtnText: {
    color: '#FFFFFF',
    fontSize: normalize(14),
    fontWeight: '800',
    marginLeft: normalize(8),
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(15),
  },
  serviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceIcon: {
    width: normalize(40),
    height: normalize(40),
    borderRadius: normalize(12),
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalize(12),
  },
  serviceName: {
    fontSize: normalize(14),
    fontWeight: '700',
    color: '#1C1C1E',
  },
  servicePrice: {
    fontSize: normalize(14),
    fontWeight: '800',
    color: '#0084F4',
  },
  reviewCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: normalize(16),
    padding: normalize(15),
    marginBottom: normalize(15),
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(8),
  },
  userName: {
    fontSize: normalize(14),
    fontWeight: '800',
    color: '#1C1C1E',
  },
  userRating: {
    flexDirection: 'row',
  },
  reviewComment: {
    fontSize: normalize(13),
    color: '#475569',
    lineHeight: normalize(20),
    fontWeight: '500',
  },
  reviewDate: {
    fontSize: normalize(11),
    color: '#94A3B8',
    fontWeight: '600',
    marginTop: normalize(8),
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(20),
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceContainer: {
    flex: 1,
  },
  totalLabel: {
    fontSize: normalize(12),
    color: '#94A3B8',
    fontWeight: '600',
  },
  serviceLabel: {
    fontSize: normalize(18),
    fontWeight: '900',
    color: '#1C1C1E',
  },
  orderBtn: {
    backgroundColor: '#0084F4',
    paddingHorizontal: normalize(32),
    paddingVertical: normalize(16),
    borderRadius: normalize(16),
  },
  orderBtnText: {
    color: '#FFFFFF',
    fontSize: normalize(15),
    fontWeight: '800',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: normalize(30),
    borderTopRightRadius: normalize(30),
    padding: normalize(20),
    paddingBottom: normalize(40),
  },
  modalHandle: {
    width: normalize(40),
    height: normalize(5),
    backgroundColor: '#E2E8F0',
    borderRadius: normalize(5),
    alignSelf: 'center',
    marginBottom: normalize(20),
  },
  modalTitle: {
    fontSize: normalize(20),
    fontWeight: '800',
    color: '#1C1C1E',
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: normalize(14),
    color: '#64748B',
    textAlign: 'center',
    marginTop: normalize(8),
    marginBottom: normalize(25),
    paddingHorizontal: normalize(20),
  },
  modalServiceList: {
    gap: normalize(12),
  },
  modalServiceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: normalize(16),
    padding: normalize(16),
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  modalServiceIcon: {
    width: normalize(50),
    height: normalize(50),
    borderRadius: normalize(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalServiceInfo: {
    flex: 1,
    marginLeft: normalize(15),
  },
  modalServiceName: {
    fontSize: normalize(16),
    fontWeight: '800',
    color: '#1C1C1E',
  },
  modalServiceDesc: {
    fontSize: normalize(12),
    color: '#64748B',
    marginTop: normalize(2),
  },
});
