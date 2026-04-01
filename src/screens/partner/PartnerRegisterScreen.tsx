import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Toast from 'react-native-toast-message';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import normalize from 'react-native-normalize';
import { RootStackParamList } from '../../types/navigation';
import { Button } from '../../components/Button';

type Props = NativeStackScreenProps<RootStackParamList, 'PartnerRegister'>;

export const PartnerRegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [laundryName, setLaundryName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    // Basic Validation
    if (!laundryName.trim()) {
      return showToast('error', 'Nama Laundry wajib diisi!');
    }
    if (!ownerName.trim()) {
      return showToast('error', 'Nama Pemilik wajib diisi!');
    }
    if (!email.trim() || !email.includes('@')) {
      return showToast('error', 'Email tidak valid!');
    }
    if (!phone.trim() || phone.length < 10) {
      return showToast('error', 'Nomor Telepon tidak valid!');
    }
    if (!address.trim()) {
      return showToast('error', 'Alamat wajib diisi!');
    }

    setIsLoading(true);
    try {
      // In a real app, this would call an API
      // For now, we simulate success and move to OTP verification
      console.log('Registering partner:', { laundryName, ownerName, email, phone, address });
      
      Toast.show({
        type: 'success',
        text1: 'Pendaftaran Berhasil!',
        text2: 'Mohon verifikasi email Anda.',
        position: 'top',
      });

      // Navigate to OTP for verification
      navigation.navigate('OTP', { email, type: 'partner' });
    } catch (error) {
      showToast('error', 'Gagal mendaftar. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (type: 'success' | 'error', text1: string) => {
    Toast.show({
      type,
      text1,
      position: 'top',
    });
  };

  const openMapPicker = () => {
    navigation.navigate('MapPicker', {
      onSelect: (selectedAddress) => {
        setAddress(selectedAddress);
      },
    });
  };

  return (
    <SafeAreaView style={styles.areaView}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={normalize(24)} color="#1C1C1E" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Daftar Mitra</Text>
          <View style={styles.placeholderIcon} />
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.welcomeText}>Bergabung Jadi Mitra!</Text>
          <Text style={styles.subtitleText}>
            Lengkapi data di bawah ini untuk mulai mengembangkan bisnis laundry Anda bersama Laundry Now.
          </Text>

          <View style={styles.form}>
            {/* Laundry Name */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Nama Laundry</Text>
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons name="store-outline" size={normalize(20)} color="#94A3B8" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Contoh: Fresh Clean Laundry"
                  value={laundryName}
                  onChangeText={setLaundryName}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            {/* Owner Name */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Nama Pemilik</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={normalize(20)} color="#94A3B8" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Masukkan nama lengkap Anda"
                  value={ownerName}
                  onChangeText={setOwnerName}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            {/* Email */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Email Bisnis</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={normalize(20)} color="#94A3B8" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="mitra@laundry.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            {/* Phone */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Nomor Telepon</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="call-outline" size={normalize(20)} color="#94A3B8" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="0812XXXXXXXX"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            {/* Address */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Alamat Lengkap</Text>
              <View style={styles.addressWrapper}>
                <View style={[styles.inputContainer, { flex: 1, marginBottom: 0 }]}>
                  <Ionicons name="location-outline" size={normalize(20)} color="#94A3B8" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { height: normalize(80), textAlignVertical: 'top' }]}
                    placeholder="Masukkan alamat lengkap toko"
                    multiline
                    value={address}
                    onChangeText={setAddress}
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                <TouchableOpacity style={styles.mapLink} onPress={openMapPicker}>
                  <Ionicons name="map-outline" size={normalize(18)} color="#0084F4" />
                  <Text style={styles.mapLinkText}>Pilih di Peta</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Button 
              title={isLoading ? "Memproses..." : "Daftar Sekarang"} 
              onPress={handleRegister} 
              variant="secondary" 
              disabled={isLoading}
              style={{ marginTop: normalize(16) }}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Sudah punya akun? {' '}
              <Text style={styles.linkText} onPress={() => navigation.navigate('PartnerLogin')}>
                Masuk di sini
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  areaView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(16),
    paddingTop: normalize(12),
    paddingBottom: normalize(20),
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backButton: {
    padding: normalize(8),
  },
  headerTitle: {
    fontSize: normalize(18),
    fontWeight: '700',
    color: '#1C1C1E',
  },
  placeholderIcon: {
    width: normalize(40),
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: normalize(24),
    paddingTop: normalize(24),
    paddingBottom: normalize(40),
  },
  welcomeText: {
    fontSize: normalize(24),
    fontWeight: '800',
    color: '#1C1C1E',
    marginBottom: normalize(8),
  },
  subtitleText: {
    fontSize: normalize(14),
    color: '#64748B',
    lineHeight: normalize(22),
    marginBottom: normalize(24),
  },
  form: {
    marginBottom: normalize(24),
  },
  formGroup: {
    marginBottom: normalize(20),
  },
  label: {
    fontSize: normalize(14),
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: normalize(8),
    marginLeft: normalize(4),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: normalize(16),
    paddingHorizontal: normalize(16),
    backgroundColor: '#F8FAFC',
  },
  inputIcon: {
    marginRight: normalize(12),
  },
  input: {
    flex: 1,
    fontSize: normalize(15),
    color: '#1C1C1E',
    minHeight: normalize(48),
    paddingVertical: normalize(12),
  },
  addressWrapper: {
    gap: normalize(8),
  },
  mapLink: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    padding: normalize(4),
  },
  mapLinkText: {
    fontSize: normalize(13),
    color: '#0084F4',
    fontWeight: '700',
    marginLeft: normalize(6),
  },
  footer: {
    marginTop: normalize(16),
    alignItems: 'center',
  },
  footerText: {
    fontSize: normalize(14),
    color: '#64748B',
  },
  linkText: {
    color: '#0084F4',
    fontWeight: '700',
  },
});
