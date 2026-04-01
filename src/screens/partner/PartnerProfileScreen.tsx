import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import normalize from 'react-native-normalize';
import Toast from 'react-native-toast-message';
import { PartnerTabNavigator, PartnerTabParamList } from '../../navigation/PartnerTabNavigator';
import { RootStackParamList } from '../../types/navigation';
import { StorageService } from '../../services/StorageService';

type Props = CompositeScreenProps<
  BottomTabScreenProps<PartnerTabParamList, 'Profil'>,
  NativeStackScreenProps<RootStackParamList>
>;

const MenuItem = ({ icon, title, subtitle, color, onPress, isDestructive = false }: any) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
      <MaterialCommunityIcons name={icon} size={normalize(22)} color={isDestructive ? '#EF4444' : color} />
    </View>
    <View style={styles.menuText}>
      <Text style={[styles.menuTitle, isDestructive && { color: '#EF4444' }]}>{title}</Text>
      {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
    </View>
    <Ionicons name="chevron-forward" size={normalize(18)} color="#CBD5E1" />
  </TouchableOpacity>
);

export const PartnerProfileScreen = ({ navigation }: Props) => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Konfirmasi Keluar',
      'Apakah Anda yakin ingin keluar dari akun Mitra?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Keluar',
          style: 'destructive',
          onPress: async () => {
            await StorageService.clearSession();
            navigation.getParent()?.reset({
              index: 0,
              routes: [{ name: 'Onboarding' }],
            });
          }
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0084F4']} tintColor="#0084F4" />
        }
      >
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              <MaterialCommunityIcons name="store" size={normalize(40)} color="#0084F4" />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.name}>Mitra Perkasa Laundry</Text>
              <Text style={styles.email}>mitra.perkasa@laundrynow.id</Text>
              <View style={styles.verifiedBadge}>
                <MaterialCommunityIcons name="check-decagram" size={normalize(14)} color="#10B981" />
                <Text style={styles.verifiedText}>Mitra Terverifikasi</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('EditProfilPartner')}>
            <MaterialCommunityIcons name="pencil" size={normalize(20)} color="#0084F4" />
          </TouchableOpacity>
        </View>

        {/* Business Stats Overlay */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>4.9</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>1.2k</Text>
            <Text style={styles.statLabel}>Orderan</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>5 thn</Text>
            <Text style={styles.statLabel}>Mitra</Text>
          </View>
        </View>

        {/* Menu Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Manajemen Toko</Text>
          <View style={styles.menuCard}>
            <MenuItem
              icon="store-cog-outline"
              title="Pengaturan Toko"
              subtitle="Edit jam buka & info toko"
              color="#0084F4"
              onPress={() => navigation.navigate('PengaturanToko')}
            />
            <MenuItem
              icon="washing-machine"
              title="Kelola Layanan"
              subtitle="Atur daftar harga & layanan"
              color="#10B981"
              onPress={() => navigation.navigate('KelolaLayanan')}
            />
            <MenuItem
              icon="star-outline"
              title="Ulasan Pelanggan"
              subtitle="Lihat feedback pelanggan"
              color="#F59E0B"
              onPress={() => navigation.navigate('UlasanPelanggan')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dukungan & Legal</Text>
          <View style={styles.menuCard}>
            <MenuItem
              icon="help-circle-outline"
              title="Pusat Bantuan"
              color="#6366F1"
              onPress={() => navigation.navigate('PusatBantuan', { type: 'partner' })}
            />
            <MenuItem
              icon="file-document-outline"
              title="Syarat & Ketentuan"
              color="#64748B"
              onPress={() => navigation.navigate('SyaratKetentuan')}
            />
            <MenuItem
              icon="shield-check-outline"
              title="Kebijakan Privasi"
              color="#64748B"
              onPress={() => navigation.navigate('KebijakanPrivasi')}
            />
          </View>
        </View>

        <View style={[styles.section, { marginBottom: normalize(40) }]}>
          <View style={styles.menuCard}>
            <MenuItem
              icon="logout"
              title="Keluar Akun"
              color="#EF4444"
              isDestructive={true}
              onPress={handleLogout}
            />
          </View>
          <Text style={styles.versionText}>Laundry Now for Partners • v1.0.2</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    backgroundColor: '#FFFFFF',
    padding: normalize(24),
    paddingTop: normalize(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: normalize(32),
    borderBottomRightRadius: normalize(32),
  },
  profileInfo: { flexDirection: 'row', alignItems: 'center' },
  avatarContainer: {
    width: normalize(72),
    height: normalize(72),
    borderRadius: normalize(36),
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: { marginLeft: normalize(16) },
  name: { fontSize: normalize(18), fontWeight: '800', color: '#1C1C1E' },
  email: { fontSize: normalize(13), color: '#64748B', marginTop: normalize(2) },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: normalize(8),
    paddingVertical: normalize(4),
    borderRadius: normalize(8),
    marginTop: normalize(8),
    alignSelf: 'flex-start',
  },
  verifiedText: { fontSize: normalize(10), fontWeight: '700', color: '#10B981', marginLeft: normalize(4) },
  editBtn: {
    padding: normalize(10),
    backgroundColor: '#F1F5F9',
    borderRadius: normalize(12),
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    marginHorizontal: normalize(20),
    marginTop: normalize(0),
    padding: normalize(20),
    borderRadius: normalize(24),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: normalize(18), fontWeight: '800', color: '#FFFFFF' },
  statLabel: { fontSize: normalize(12), color: '#94A3B8', marginTop: normalize(4) },
  statDivider: { width: 1, height: normalize(40), backgroundColor: 'rgba(255,255,255,0.1)' },
  section: { marginTop: normalize(32), paddingHorizontal: normalize(20) },
  sectionTitle: {
    fontSize: normalize(13),
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: normalize(12),
    marginLeft: normalize(4),
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(20),
    padding: normalize(8),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: normalize(14),
  },
  iconContainer: {
    width: normalize(44),
    height: normalize(44),
    borderRadius: normalize(14),
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: { flex: 1, marginLeft: normalize(14) },
  menuTitle: { fontSize: normalize(15), fontWeight: '700', color: '#1C1C1E' },
  menuSubtitle: { fontSize: normalize(12), color: '#64748B', marginTop: normalize(2) },
  versionText: {
    textAlign: 'center',
    color: '#CBD5E1',
    fontSize: normalize(12),
    marginTop: normalize(20),
    fontWeight: '500',
  },
});
