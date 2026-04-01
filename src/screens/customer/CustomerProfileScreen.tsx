import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import normalize from 'react-native-normalize';
import { RootStackParamList } from '../../types/navigation';
import { CustomerTabParamList } from '../../navigation/CustomerTabNavigator';
import { StorageService } from '../../services/StorageService';

type Props = CompositeScreenProps<
  BottomTabScreenProps<CustomerTabParamList, 'Profil'>,
  NativeStackScreenProps<RootStackParamList>
>;

export const CustomerProfileScreen = ({ navigation }: Props) => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  const handleLogout = async () => {
    await StorageService.clearSession();
    navigation.getParent()?.reset({
      index: 0,
      routes: [{ name: 'Onboarding' }],
    });
  };

  const MenuItem = ({ icon, title, subtitle, color = '#1C1C1E', onPress }: any) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={[styles.menuIconContainer, { backgroundColor: color + '10' }]}>
        <MaterialCommunityIcons name={icon} size={normalize(22)} color={color} />
      </View>
      <View style={styles.menuTextContainer}>
        <Text style={styles.menuTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={normalize(18)} color="#CBD5E1" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0084F4" colors={['#0084F4']} />
        }
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>AN</Text>
            </View>
            {/* <TouchableOpacity style={styles.editBadge}>
              <MaterialCommunityIcons name="camera" size={normalize(16)} color="#FFFFFF" />
            </TouchableOpacity> */}
          </View>
          <Text style={styles.userName}>Alvin Nugraha</Text>
          <Text style={styles.userEmail}>alvin.nugraha@example.com</Text>
          <TouchableOpacity style={styles.editProfileBtn} onPress={() => navigation.navigate('EditProfile')}>
            <Text style={styles.editProfileText}>Edit Profil</Text>
          </TouchableOpacity>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Akun & Keamanan</Text>
          <View style={styles.menuCard}>
            <MenuItem
              icon="map-marker-outline"
              title="Alamat Saya"
              subtitle="Kelola alamat penjemputan"
              color="#F59E0B"
              onPress={() => navigation.navigate('AlamatSaya')}
            />
            <MenuItem
              icon="ticket-outline"
              title="Voucher Saya"
              subtitle="Cek voucher yang bisa dipakai"
              color="#EF4444"
              onPress={() => navigation.navigate('VoucherSaya')}
            />
          </View>
        </View>

        {/* Other Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lainnya</Text>
          <View style={styles.menuCard}>
            <MenuItem
              icon="help-circle-outline"
              title="Pusat Bantuan"
              color="#10B981"
              onPress={() => navigation.navigate('PusatBantuan', { type: 'customer' })}
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

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <MaterialCommunityIcons name="logout" size={normalize(20)} color="#F43F5E" />
          <Text style={styles.logoutText}>Keluar Akun</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.versionText}>Versi 1.0.0</Text>
        </View>

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
  profileHeader: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingVertical: normalize(32),
    borderBottomLeftRadius: normalize(32),
    borderBottomRightRadius: normalize(32),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: normalize(16),
  },
  avatar: {
    width: normalize(90),
    height: normalize(90),
    borderRadius: normalize(45),
    backgroundColor: '#0084F4',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#E0F2FE',
  },
  avatarText: {
    fontSize: normalize(32),
    fontWeight: '800',
    color: '#FFFFFF',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0084F4',
    width: normalize(32),
    height: normalize(32),
    borderRadius: normalize(16),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontSize: normalize(20),
    fontWeight: '800',
    color: '#1C1C1E',
  },
  userEmail: {
    fontSize: normalize(14),
    color: '#64748B',
    marginTop: normalize(4),
    fontWeight: '500',
  },
  editProfileBtn: {
    marginTop: normalize(16),
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(8),
    borderRadius: normalize(20),
    backgroundColor: '#F1F5F9',
  },
  editProfileText: {
    fontSize: normalize(13),
    fontWeight: '700',
    color: '#475569',
  },
  section: {
    marginTop: normalize(24),
    paddingHorizontal: normalize(20),
  },
  sectionTitle: {
    fontSize: normalize(13),
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 1,
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
    padding: normalize(12),
  },
  menuIconContainer: {
    width: normalize(40),
    height: normalize(40),
    borderRadius: normalize(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuTextContainer: {
    flex: 1,
    marginLeft: normalize(15),
  },
  menuTitle: {
    fontSize: normalize(15),
    fontWeight: '700',
    color: '#1C1C1E',
  },
  menuSubtitle: {
    fontSize: normalize(12),
    color: '#64748B',
    marginTop: normalize(2),
  },
  logoutBtn: {
    marginHorizontal: normalize(20),
    marginTop: normalize(32),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: normalize(16),
    backgroundColor: '#FFF1F2',
    borderRadius: normalize(16),
    borderWidth: 1,
    borderColor: '#FFE4E6',
  },
  logoutText: {
    fontSize: normalize(15),
    fontWeight: '700',
    color: '#F43F5E',
    marginLeft: normalize(10),
  },
  footer: {
    marginTop: normalize(32),
    alignItems: 'center',
  },
  versionText: {
    fontSize: normalize(12),
    color: '#94A3B8',
    fontWeight: '600',
  },
});
