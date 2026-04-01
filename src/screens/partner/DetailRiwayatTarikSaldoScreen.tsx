import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import normalize from 'react-native-normalize';
import ViewShot, { captureRef } from 'react-native-view-shot';
import Share from 'react-native-share';
import { RootStackParamList } from '../../types/navigation';
import { Button } from '../../components/Button';

type Props = NativeStackScreenProps<RootStackParamList, 'DetailRiwayatTarikSaldo'>;

export const DetailRiwayatTarikSaldoScreen = ({ navigation, route }: Props) => {
  const { withdrawal } = route.params;
  const viewShotRef = useRef<ViewShot>(null);

  const handleShare = async () => {
    try {
      const uri = await captureRef(viewShotRef, {
        format: 'png',
        quality: 0.9,
      });

      const message = `Bukti Penarikan Saldo - Laundry Now\n\nID: ${withdrawal.id}\nStatus: ${withdrawal.status}\nNominal: ${withdrawal.amount}\n\nTerima kasih telah menggunakan Laundry Now Mitra!`;

      await Share.open({
        url: uri,
        message,
        title: 'Bukti Penarikan Saldo',
        subject: 'Bukti Penarikan Saldo',
      });
    } catch (error: any) {
      if (error.message !== 'User did not share') {
        console.log('Share Error:', error.message);
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={normalize(22)} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail Penarikan</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 0.9 }} style={{ backgroundColor: '#F8FAFC' }}>
          <View style={styles.receiptWrapper}>
            {/* Top Notch for Receipt Look */}
            <View style={styles.receiptTopBorder} />

            <View style={styles.receiptMain}>
              <View style={styles.statusContainer}>
                <View style={[styles.statusIconBg, { backgroundColor: withdrawal.bgColor }]}>
                  <MaterialCommunityIcons
                    name={withdrawal.status === 'Berhasil' ? 'check-circle' : withdrawal.status === 'Gagal' ? 'close-circle' : 'clock'}
                    size={normalize(48)}
                    color={withdrawal.color}
                  />
                </View>
                <Text style={[styles.statusText, { color: withdrawal.color }]}>Penarikan {withdrawal.status}</Text>
                <Text style={styles.receiptAmount}>{withdrawal.amount}</Text>
              </View>
            </View>

            {/* Dotted Divider */}
            <View style={styles.dottedDividerContainer}>
              <View style={styles.sideCutoutLeft} />
              <View style={styles.sideCutoutRight} />
              <View style={styles.dottedLine} />
            </View>

            <View style={styles.receiptDetails}>
              <DetailItem label="ID Transaksi" value={withdrawal.id} />
              <DetailItem label="Waktu" value={withdrawal.date} />
              <DetailItem label="Metode Penarikan" value={`${withdrawal.bank} (${withdrawal.acc})`} />
              <DetailItem label="Nama Pemilik" value="Budi Santoso" />

              <View style={styles.footerDivider} />

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total Diterima</Text>
                <Text style={styles.totalValue}>{withdrawal.amount}</Text>
              </View>
            </View>

            {/* Bottom ZigZag for Receipt Look */}
            <View style={styles.receiptBottomBorder} />
          </View>
        </ViewShot>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Informasi Tambahan</Text>
          <Text style={styles.infoText}>
            Dana akan masuk ke rekening Anda sesuai dengan jadwal operasional bank. Jika status sudah "Berhasil" namun dana belum masuk dalam 24 jam, silakan hubungi CS.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Bagikan Bukti"
          variant="primary"
          onPress={handleShare}
        // icon="share-outline"
        />
      </View>
    </SafeAreaView>
  );
};

interface DetailItemProps {
  label: string;
  value: string;
}

const DetailItem = ({ label, value }: DetailItemProps) => (
  <View style={styles.detailItem}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: normalize(20), paddingVertical: normalize(15), backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  backBtn: { padding: normalize(8) },
  headerTitle: { fontSize: normalize(17), fontWeight: '800', color: '#1C1C1E' },
  content: { padding: normalize(20), paddingBottom: normalize(40) },

  receiptWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(4),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },
  receiptTopBorder: {
    height: normalize(6),
    backgroundColor: '#0084F4',
    borderTopLeftRadius: normalize(4),
    borderTopRightRadius: normalize(4),
  },
  receiptMain: {
    padding: normalize(24),
    alignItems: 'center',
  },
  statusContainer: {
    alignItems: 'center',
  },
  statusIconBg: {
    width: normalize(80),
    height: normalize(80),
    borderRadius: normalize(40),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: normalize(16),
  },
  statusText: {
    fontSize: normalize(16),
    fontWeight: '800',
    marginBottom: normalize(8),
  },
  receiptAmount: {
    fontSize: normalize(32),
    fontWeight: '900',
    color: '#1C1C1E',
  },

  dottedDividerContainer: {
    position: 'relative',
    height: 20,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  sideCutoutLeft: {
    position: 'absolute',
    left: -10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    zIndex: 1,
  },
  sideCutoutRight: {
    position: 'absolute',
    right: -10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    zIndex: 1,
  },
  dottedLine: {
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginHorizontal: 15,
  },

  receiptDetails: {
    padding: normalize(24),
    paddingTop: normalize(10),
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: normalize(16),
  },
  detailLabel: {
    fontSize: normalize(13),
    color: '#94A3B8',
    fontWeight: '600',
  },
  detailValue: {
    fontSize: normalize(13),
    color: '#1C1C1E',
    fontWeight: '700',
    textAlign: 'right',
    flex: 1,
    marginLeft: normalize(20),
  },
  footerDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: normalize(16),
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: normalize(15),
    fontWeight: '700',
    color: '#1C1C1E',
  },
  totalValue: {
    fontSize: normalize(18),
    fontWeight: '800',
    color: '#0084F4',
  },
  receiptBottomBorder: {
    height: 10,
    width: '100%',
    // Simple zig zag pattern using small circles/blocks
    borderStyle: 'dotted',
    borderWidth: 5,
    borderColor: '#F8FAFC',
    marginBottom: -5,
  },

  infoSection: {
    marginTop: normalize(32),
    paddingHorizontal: normalize(4),
  },
  infoTitle: {
    fontSize: normalize(15),
    fontWeight: '800',
    color: '#1C1C1E',
    marginBottom: normalize(12),
  },
  infoText: {
    fontSize: normalize(13),
    color: '#64748B',
    lineHeight: normalize(20),
  },

  footer: {
    padding: normalize(20),
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
});
