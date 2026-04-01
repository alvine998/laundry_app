import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import normalize from 'react-native-normalize';
import Toast from 'react-native-toast-message';
import { RootStackParamList } from '../../types/navigation';
import { StorageService } from '../../services/StorageService';

type Props = NativeStackScreenProps<RootStackParamList, 'ServiceOrder'>;

const ADDITIONAL_OPTIONS = [
  { id: '1', name: 'Parfum Ekstra', price: 2000, icon: 'spray' },
  { id: '3', name: 'Antar Jemput', price: 5000, icon: 'truck-delivery' },
];

export const ServiceOrderScreen = ({ navigation, route }: Props) => {
  const { service, partner } = route.params;
  const [quantity, setQuantity] = useState('1');
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]); // Start with no extras
  const [totalPrice, setTotalPrice] = useState(0);
  const [voucherCode, setVoucherCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [voucherError, setVoucherError] = useState('');
  const [isVoucherApplied, setIsVoucherApplied] = useState(false);

  const [selectedPackage, setSelectedPackage] = useState(
    service.packages && service.packages.length > 0 ? service.packages[0] : null
  );

  const BASE_PRICE = selectedPackage
    ? selectedPackage.price
    : (service.price || (partner ? partner.price : (service.name === 'Kiloan' ? 7000 : 15000)));

  const UNIT = service.name === 'Kiloan' ? 'kg' : 'pcs';

  useEffect(() => {
    calculateTotal();
  }, [quantity, selectedOptions, discount, selectedPackage, BASE_PRICE]);

  const calculateTotal = () => {
    const qty = parseFloat(quantity) || 0;
    let base = qty * BASE_PRICE;

    selectedOptions.forEach(optId => {
      const option = ADDITIONAL_OPTIONS.find(o => o.id === optId);
      if (option) base += option.price;
    });

    setTotalPrice(Math.max(0, base - discount));
  };

  const validateVoucher = () => {
    const code = voucherCode.toUpperCase();
    if (code === 'HEMAT') {
      const disc = 5000;
      setDiscount(disc);
      setIsVoucherApplied(true);
      setVoucherError('');
      Toast.show({ type: 'success', text1: 'Voucher Berhasil Dipasang!', text2: 'Diskon Rp 5.000 telah diterapkan.' });
    } else if (code === 'NEWUSER') {
      const disc = Math.round((parseFloat(quantity) || 0) * BASE_PRICE * 0.1); // 10% off
      setDiscount(disc);
      setIsVoucherApplied(true);
      setVoucherError('');
      Toast.show({ type: 'success', text1: 'Voucher Berhasil Dipasang!', text2: 'Diskon 10% telah diterapkan.' });
    } else {
      setVoucherError('Kode voucher tidak valid');
      setDiscount(0);
      setIsVoucherApplied(false);
    }
  };

  const toggleOption = (id: string) => {
    if (selectedOptions.includes(id)) {
      setSelectedOptions(selectedOptions.filter(o => o !== id));
    } else {
      setSelectedOptions([...selectedOptions, id]);
    }
  };

  const handleOrder = async () => {
    const earnedPoints = Math.floor(totalPrice / 1000);
    
    navigation.navigate('Payment', {
      totalAmount: totalPrice,
      serviceInfo: service,
      partnerInfo: partner,
      estimatedPoints: earnedPoints,
    });
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(val);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={normalize(24)} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order {service.name}</Text>
        <View style={{ width: normalize(44) }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Partner Preview Card */}
        {partner && (
          <View style={styles.partnerPreview}>
            <Image source={{ uri: partner.image }} style={styles.partnerThumb} />
            <View style={styles.partnerMeta}>
              <Text style={styles.partnerSmallName}>{partner.name}</Text>
              <View style={styles.partnerSmallRating}>
                <Ionicons name="star" size={normalize(12)} color="#F59E0B" />
                <Text style={styles.partnerRatingText}>{partner.rating}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Service Hero */}
        <View style={[styles.heroCard, { backgroundColor: service.color + '10' }]}>
          <View style={[styles.heroIcon, { backgroundColor: service.color }]}>
            <MaterialCommunityIcons name={service.icon as any} size={normalize(40)} color="#FFFFFF" />
          </View>
          <View style={styles.heroText}>
            <Text style={styles.serviceName}>{service.name}</Text>
            <Text style={styles.servicePrice}>{formatCurrency(BASE_PRICE)} / {UNIT}</Text>
          </View>
        </View>

        {/* Package Selection Section */}
        {service.packages && service.packages.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pilih Paket</Text>
            <View style={styles.packageGrid}>
              {service.packages.map((pkg: any) => (
                <TouchableOpacity
                  key={pkg.id}
                  style={[
                    styles.packageCard,
                    selectedPackage?.id === pkg.id && styles.packageCardActive
                  ]}
                  onPress={() => setSelectedPackage(pkg)}
                >
                  <View style={styles.packageHeader}>
                    <Text style={[styles.packageName, selectedPackage?.id === pkg.id && styles.packageTextActive]}>
                      {pkg.name}
                    </Text>
                    {selectedPackage?.id === pkg.id && (
                      <Ionicons name="checkmark-circle" size={normalize(18)} color="#FFFFFF" />
                    )}
                  </View>
                  <Text style={[styles.packageTime, selectedPackage?.id === pkg.id && styles.packageTimeActive]}>
                    Selesai {pkg.time}
                  </Text>
                  <Text style={[styles.packagePrice, selectedPackage?.id === pkg.id && styles.packagePriceActive]}>
                    {formatCurrency(pkg.price)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Quantity Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estimasi {UNIT === 'kg' ? 'Berat' : 'Jumlah'} ({UNIT})</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => setQuantity(Math.max(1, (parseFloat(quantity) || 0) - 1).toString())}
            >
              <Ionicons name="remove" size={normalize(24)} color="#0084F4" />
            </TouchableOpacity>
            <TextInput
              style={styles.qtyInput}
              keyboardType="numeric"
              value={quantity}
              onChangeText={setQuantity}
            />
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => setQuantity(((parseFloat(quantity) || 0) + 1).toString())}
            >
              <Ionicons name="add" size={normalize(24)} color="#0084F4" />
            </TouchableOpacity>
          </View>

          {/* Courier Scale Notice */}
          <View style={styles.noticeContainer}>
            <Ionicons name="information-circle-outline" size={normalize(18)} color="#0084F4" />
            <Text style={styles.noticeText}>
              Kurir akan membawa timbangan. Berat akhir akan dikonfirmasi saat penjemputan.
            </Text>
          </View>
        </View>

        {/* Options Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Opsi Tambahan</Text>
          {ADDITIONAL_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionItem,
                selectedOptions.includes(option.id) && styles.optionActive
              ]}
              onPress={() => toggleOption(option.id)}
            >
              <View style={styles.optionInfo}>
                <View style={styles.optionIconContainer}>
                  <MaterialCommunityIcons name={option.icon as any} size={normalize(22)} color="#64748B" />
                </View>
                <View>
                  <Text style={styles.optionName}>{option.name}</Text>
                  <Text style={styles.optionPrice}>
                    {option.price === 0 ? 'Gratis' : `+ ${formatCurrency(option.price)}`}
                  </Text>
                </View>
              </View>
              <Ionicons
                name={selectedOptions.includes(option.id) ? "checkbox" : "square-outline"}
                size={normalize(24)}
                color={selectedOptions.includes(option.id) ? "#0084F4" : "#E2E8F0"}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Voucher Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Promo & Voucher</Text>
          <View style={styles.voucherRow}>
            <View style={[styles.voucherInputContainer, isVoucherApplied && styles.voucherAppliedBorder]}>
              <MaterialCommunityIcons name="ticket-percent-outline" size={normalize(22)} color={isVoucherApplied ? "#10B981" : "#94A3B8"} />
              <TextInput
                style={styles.voucherInput}
                placeholder="Masukkan kode voucher"
                value={voucherCode}
                onChangeText={(text) => {
                  setVoucherCode(text);
                  if (isVoucherApplied) {
                    setIsVoucherApplied(false);
                    setDiscount(0);
                  }
                }}
                autoCapitalize="characters"
              />
            </View>
            <TouchableOpacity
              style={[styles.voucherBtn, isVoucherApplied && styles.voucherBtnDisabled]}
              onPress={validateVoucher}
              disabled={isVoucherApplied || !voucherCode}
            >
              <Text style={styles.voucherBtnText}>{isVoucherApplied ? 'Terpasang' : 'Gunakan'}</Text>
            </TouchableOpacity>
          </View>
          {voucherError ? <Text style={styles.voucherErrorText}>{voucherError}</Text> : null}
          {isVoucherApplied ? <Text style={styles.voucherSuccessText}>Voucher hemat telah dipasang!</Text> : null}
        </View>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Ringkasan Biaya</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Layanan {service.name} {selectedPackage ? `(${selectedPackage.name})` : ''} x {quantity} {UNIT}
            </Text>
            <Text style={styles.summaryValue}>{formatCurrency((parseFloat(quantity) || 0) * BASE_PRICE)}</Text>
          </View>
          {selectedOptions.map(optId => {
            const opt = ADDITIONAL_OPTIONS.find(o => o.id === optId);
            if (!opt || opt.price === 0) return null;
            return (
              <View key={optId} style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{opt.name}</Text>
                <Text style={styles.summaryValue}>{formatCurrency(opt.price)}</Text>
              </View>
            );
          })}
          {discount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Diskon Promo</Text>
              <Text style={[styles.summaryValue, { color: '#EF4444' }]}>- {formatCurrency(discount)}</Text>
            </View>
          )}
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Estimasi Total</Text>
            <Text style={styles.totalValue}>{formatCurrency(totalPrice)}</Text>
          </View>
          <View style={styles.pointsEarnedContainer}>
            <MaterialCommunityIcons name="star-circle" size={normalize(18)} color="#F59E0B" />
            <Text style={styles.pointsEarnedText}>Kamu akan mendapatkan {Math.floor(totalPrice / 1000)} Poin</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.orderBtn} onPress={handleOrder}>
          <Text style={styles.orderBtnText}>Pesan Sekarang</Text>
        </TouchableOpacity>
      </View>
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
  scrollContent: {
    padding: normalize(20),
  },
  partnerPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: normalize(12),
    borderRadius: normalize(16),
    marginBottom: normalize(15),
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  partnerThumb: {
    width: normalize(40),
    height: normalize(40),
    borderRadius: normalize(8),
  },
  partnerMeta: {
    marginLeft: normalize(12),
  },
  partnerSmallName: {
    fontSize: normalize(14),
    fontWeight: '700',
    color: '#1C1C1E',
  },
  partnerSmallRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: normalize(2),
  },
  partnerRatingText: {
    fontSize: normalize(11),
    fontWeight: '700',
    color: '#F59E0B',
    marginLeft: normalize(2),
  },
  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: normalize(20),
    borderRadius: normalize(24),
    marginBottom: normalize(25),
  },
  heroIcon: {
    width: normalize(70),
    height: normalize(70),
    borderRadius: normalize(20),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  heroText: {
    marginLeft: normalize(20),
  },
  serviceName: {
    fontSize: normalize(22),
    fontWeight: '900',
    color: '#1C1C1E',
  },
  servicePrice: {
    fontSize: normalize(14),
    color: '#64748B',
    fontWeight: '600',
    marginTop: normalize(4),
  },
  section: {
    marginBottom: normalize(30),
  },
  sectionTitle: {
    fontSize: normalize(16),
    fontWeight: '800',
    color: '#1C1C1E',
    marginBottom: normalize(15),
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(16),
    padding: normalize(10),
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  qtyBtn: {
    width: normalize(44),
    height: normalize(44),
    borderRadius: normalize(12),
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyInput: {
    fontSize: normalize(20),
    fontWeight: '800',
    color: '#1C1C1E',
    textAlign: 'center',
    flex: 1,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(16),
    padding: normalize(16),
    marginBottom: normalize(12),
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  optionActive: {
    borderColor: '#0084F4',
    backgroundColor: '#F0F9FF',
  },
  optionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIconContainer: {
    width: normalize(44),
    height: normalize(44),
    borderRadius: normalize(12),
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalize(15),
  },
  optionName: {
    fontSize: normalize(15),
    fontWeight: '700',
    color: '#1C1C1E',
  },
  optionPrice: {
    fontSize: normalize(12),
    color: '#64748B',
    fontWeight: '600',
    marginTop: normalize(2),
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(24),
    padding: normalize(20),
    marginBottom: normalize(30),
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  summaryTitle: {
    fontSize: normalize(16),
    fontWeight: '800',
    color: '#1C1C1E',
    marginBottom: normalize(15),
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: normalize(10),
  },
  summaryLabel: {
    fontSize: normalize(14),
    color: '#64748B',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: normalize(14),
    color: '#1C1C1E',
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: normalize(15),
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: normalize(16),
    fontWeight: '800',
    color: '#1C1C1E',
  },
  totalValue: {
    fontSize: normalize(20),
    fontWeight: '900',
    color: '#0084F4',
  },
  pointsEarnedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    padding: normalize(10),
    borderRadius: normalize(12),
    marginTop: normalize(15),
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  pointsEarnedText: {
    fontSize: normalize(13),
    fontWeight: '700',
    color: '#D97706',
    marginLeft: normalize(8),
  },
  noticeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    padding: normalize(12),
    borderRadius: normalize(12),
    marginTop: normalize(12),
    borderWidth: 1,
    borderColor: '#B9E6FE',
  },
  noticeText: {
    flex: 1,
    fontSize: normalize(12),
    color: '#0369A1',
    fontWeight: '600',
    marginLeft: normalize(8),
    lineHeight: normalize(18),
  },
  footer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(20),
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  orderBtn: {
    backgroundColor: '#0084F4',
    paddingVertical: normalize(18),
    borderRadius: normalize(16),
    alignItems: 'center',
  },
  orderBtnText: {
    color: '#FFFFFF',
    fontSize: normalize(16),
    fontWeight: '800',
  },
  voucherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: normalize(10),
  },
  voucherInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(12),
    paddingHorizontal: normalize(12),
    height: normalize(52),
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  voucherAppliedBorder: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  voucherInput: {
    flex: 1,
    marginLeft: normalize(10),
    fontSize: normalize(14),
    fontWeight: '600',
    color: '#1C1C1E',
  },
  voucherBtn: {
    backgroundColor: '#0084F4',
    paddingHorizontal: normalize(15),
    height: normalize(52),
    borderRadius: normalize(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  voucherBtnDisabled: {
    backgroundColor: '#10B981',
  },
  voucherBtnText: {
    color: '#FFFFFF',
    fontSize: normalize(13),
    fontWeight: '800',
  },
  voucherErrorText: {
    color: '#EF4444',
    fontSize: normalize(12),
    fontWeight: '600',
    marginTop: normalize(5),
    marginLeft: normalize(4),
  },
  voucherSuccessText: {
    color: '#10B981',
    fontSize: normalize(12),
    fontWeight: '600',
    marginTop: normalize(5),
    marginLeft: normalize(4),
  },
  packageGrid: {
    flexDirection: 'row',
    gap: normalize(12),
  },
  packageCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(16),
    padding: normalize(15),
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minHeight: normalize(100),
  },
  packageCardActive: {
    backgroundColor: '#0084F4',
    borderColor: '#0084F4',
    shadowColor: '#0084F4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(4),
  },
  packageName: {
    fontSize: normalize(15),
    fontWeight: '800',
    color: '#1C1C1E',
  },
  packageTextActive: {
    color: '#FFFFFF',
  },
  packageTime: {
    fontSize: normalize(12),
    color: '#64748B',
    fontWeight: '600',
    marginBottom: normalize(8),
  },
  packageTimeActive: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  packagePrice: {
    fontSize: normalize(14),
    fontWeight: '800',
    color: '#0084F4',
  },
  packagePriceActive: {
    color: '#FFFFFF',
  },
});
