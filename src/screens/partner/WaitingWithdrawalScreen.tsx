import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import normalize from 'react-native-normalize';
import { RootStackParamList } from '../../types/navigation';
import { Button } from '../../components/Button';

type Props = NativeStackScreenProps<RootStackParamList, 'WaitingWithdrawal'>;

const { width } = Dimensions.get('window');

export const WaitingWithdrawalScreen = ({ navigation, route }: Props) => {
  const { amount } = route.params;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <View style={styles.illustrationContainer}>
          <View style={styles.iconBg}>
            <MaterialCommunityIcons name="clock-fast" size={normalize(60)} color="#0084F4" />
          </View>
          <View style={styles.successBadge}>
            <Ionicons name="checkmark-circle" size={normalize(24)} color="#10B981" />
          </View>
        </View>

        <Text style={styles.title}>Pengajuan Terkirim</Text>
        <Text style={styles.subtitle}>
          Permintaan penarikan dana Anda sedang diproses oleh tim kami.
        </Text>

        <View style={styles.detailCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Nominal Penarikan</Text>
            <Text style={styles.detailValue}>Rp {amount.toLocaleString('id-ID')}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Estimasi Diterima</Text>
            <Text style={styles.detailValue}>1-2 Hari Kerja</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Metode</Text>
            <Text style={styles.detailValue}>Transfer BCA</Text>
          </View>
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={normalize(20)} color="#64748B" />
          <Text style={styles.infoText}>
            Kami akan memberi tahu Anda melalui notifikasi setelah dana berhasil dikirim ke rekening Anda.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title="Lihat Riwayat"
          variant="secondary"
          onPress={() => navigation.replace('RiwayatTarikSaldo')}
          style={styles.historyBtn}
        />
        <Button
          title="Kembali ke Dompet"
          variant="primary"
          onPress={() => navigation.navigate('PartnerHome')}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: normalize(30) },
  illustrationContainer: { marginBottom: normalize(32), position: 'relative' },
  iconBg: { width: normalize(120), height: normalize(120), backgroundColor: '#F0F9FF', borderRadius: normalize(60), justifyContent: 'center', alignItems: 'center' },
  successBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#FFFFFF', borderRadius: normalize(15), padding: 2 },
  title: { fontSize: normalize(22), fontWeight: '800', color: '#1C1C1E', marginBottom: normalize(12), textAlign: 'center' },
  subtitle: { fontSize: normalize(15), color: '#64748B', textAlign: 'center', lineHeight: normalize(22), marginBottom: normalize(40) },
  detailCard: { backgroundColor: '#F8FAFC', borderRadius: normalize(24), padding: normalize(20), width: '100%', borderWidth: 1, borderColor: '#F1F5F9' },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detailLabel: { fontSize: normalize(13), color: '#94A3B8', fontWeight: '600' },
  detailValue: { fontSize: normalize(14), color: '#1C1C1E', fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: normalize(15) },
  infoBox: { flexDirection: 'row', marginTop: normalize(32), backgroundColor: '#F1F5F9', padding: normalize(16), borderRadius: normalize(16) },
  infoText: { flex: 1, fontSize: normalize(12), color: '#64748B', lineHeight: normalize(18), marginLeft: normalize(10) },
  footer: { padding: normalize(20), borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  historyBtn: { marginBottom: normalize(12) },
});
