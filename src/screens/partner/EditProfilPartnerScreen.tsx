import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Modal,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import normalize from 'react-native-normalize';
import ImagePicker from 'react-native-image-crop-picker';
import { RootStackParamList } from '../../types/navigation';
import { StorageService } from '../../services/StorageService';
import Toast from 'react-native-toast-message';

type Props = NativeStackScreenProps<RootStackParamList, 'EditProfilPartner'>;

export const EditProfilPartnerScreen = ({ navigation }: Props) => {
  const [storeName, setStoreName] = useState('Mitra Perkasa Laundry');
  const [ownerName, setOwnerName] = useState('Budi Santoso');
  const [email, setEmail] = useState('mitra.perkasa@laundrynow.id');
  const [phone, setPhone] = useState('081234567890');
  const [description, setDescription] = useState('Laundry premium dengan layanan kilat dan garansi bersih.');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handlePickFromGallery = () => {
    setShowPhotoModal(false);
    setTimeout(() => {
      ImagePicker.openPicker({
        width: 400,
        height: 400,
        cropping: true,
        cropperCircleOverlay: true,
        mediaType: 'photo',
        compressImageQuality: 0.8,
        cropperToolbarTitle: 'Atur Logo Toko',
      })
        .then((image) => {
          setPhotoUri(image.path);
        })
        .catch((err) => {
          if (err.code !== 'E_PICKER_CANCELLED') {
            Alert.alert('Error', 'Gagal memilih logo.');
          }
        });
    }, 400);
  };

  const handleTakePhoto = async () => {
    setShowPhotoModal(false);

    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Izin Kamera',
            message: 'Laundry Now membutuhkan akses kamera untuk mengambil foto logo toko Anda.',
            buttonNeutral: 'Tanya Nanti',
            buttonNegative: 'Batal',
            buttonPositive: 'OK',
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Toast.show({ type: 'error', text1: 'Izin kamera ditolak. Silakan aktifkan di pengaturan.' });
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }

    setTimeout(() => {
      ImagePicker.openCamera({
        width: 400,
        height: 400,
        cropping: true,
        cropperCircleOverlay: true,
        compressImageQuality: 0.8,
        cropperToolbarTitle: 'Ambil Foto Logo',
      })
        .then((image) => {
          setPhotoUri(image.path);
        })
        .catch((err) => {
          if (err.code !== 'E_PICKER_CANCELLED') {
            Alert.alert('Error', 'Gagal mengambil foto.');
          }
        });
    }, 400);
  };

  const handleSave = async () => {
    if (!storeName.trim() || !ownerName.trim()) {
      Toast.show({ type: 'error', text1: 'Nama Toko dan Pemilik wajib diisi' });
      return;
    }
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(() => resolve(undefined), 1000));
      Toast.show({ type: 'success', text1: 'Profil Mitra berhasil diperbarui!' });
      setTimeout(() => navigation.goBack(), 800);
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Gagal menyimpan profil' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={normalize(22)} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profil Mitra</Text>
        <TouchableOpacity 
          style={[styles.saveBtn, isSaving && styles.saveBtnDisabled]} 
          onPress={handleSave}
          disabled={isSaving}
        >
          <Text style={styles.saveText}>{isSaving ? '...' : 'Simpan'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Logo Section */}
        <View style={styles.avatarSection}>
          <TouchableOpacity 
            style={styles.avatarWrapper} 
            onPress={() => setShowPhotoModal(true)}
          >
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <MaterialCommunityIcons name="store" size={normalize(50)} color="#FFFFFF" />
              </View>
            )}
            <View style={styles.cameraBadge}>
              <MaterialCommunityIcons name="camera" size={normalize(18)} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          <Text style={styles.changePhotoText}>Ubah Logo Toko</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formSection}>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Nama Toko Laundry</Text>
            <View style={styles.inputWrapper}>
              <MaterialCommunityIcons name="store-outline" size={normalize(20)} color="#94A3B8" />
              <TextInput
                style={styles.input}
                value={storeName}
                onChangeText={setStoreName}
                placeholder="Masukkan nama toko"
                placeholderTextColor="#CBD5E1"
              />
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Nama Pemilik</Text>
            <View style={styles.inputWrapper}>
              <MaterialCommunityIcons name="account-outline" size={normalize(20)} color="#94A3B8" />
              <TextInput
                style={styles.input}
                value={ownerName}
                onChangeText={setOwnerName}
                placeholder="Nama lengkap pemilik"
                placeholderTextColor="#CBD5E1"
              />
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Email Bisnis</Text>
            <View style={[styles.inputWrapper, styles.inputDisabled]}>
              <MaterialCommunityIcons name="email-outline" size={normalize(20)} color="#94A3B8" />
              <TextInput
                style={[styles.input, styles.inputTextDisabled]}
                value={email}
                editable={false}
              />
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={normalize(14)} color="#10B981" />
                <Text style={styles.verifiedText}>Aktif</Text>
              </View>
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Nomor Telepon</Text>
            <View style={styles.inputWrapper}>
              <MaterialCommunityIcons name="phone-outline" size={normalize(20)} color="#94A3B8" />
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Deskripsi Toko</Text>
            <View style={[styles.inputWrapper, styles.inputWrapperMultiline]}>
              <TextInput
                style={[styles.input, styles.inputMultiline]}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                placeholder="Ceritakan tentang layanan unggulan Anda..."
                placeholderTextColor="#CBD5E1"
                textAlignVertical="top"
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Photo Picker Modal */}
      <Modal visible={showPhotoModal} transparent animationType="fade">
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setShowPhotoModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Logo Toko</Text>
            <TouchableOpacity style={styles.modalOption} onPress={handleTakePhoto}>
              <Ionicons name="camera" size={normalize(24)} color="#0084F4" />
              <Text style={styles.modalOptionText}>Ambil Foto</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={handlePickFromGallery}>
              <Ionicons name="images" size={normalize(24)} color="#10B981" />
              <Text style={styles.modalOptionText}>Pilih dari Galeri</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setShowPhotoModal(false)}>
              <Text style={styles.modalCancelText}>Batal</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(15),
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: { padding: normalize(8) },
  headerTitle: { fontSize: normalize(17), fontWeight: '800', color: '#1C1C1E' },
  saveBtn: { backgroundColor: '#0084F4', paddingHorizontal: normalize(16), paddingVertical: normalize(8), borderRadius: normalize(10) },
  saveBtnDisabled: { opacity: 0.6 },
  saveText: { color: '#FFFFFF', fontWeight: '700' },
  content: { paddingBottom: normalize(40) },
  avatarSection: { alignItems: 'center', paddingVertical: normalize(30), backgroundColor: '#FFFFFF' },
  avatarWrapper: { position: 'relative' },
  avatarImage: { width: normalize(100), height: normalize(100), borderRadius: normalize(50) },
  avatarPlaceholder: { width: normalize(100), height: normalize(100), borderRadius: normalize(50), backgroundColor: '#0084F4', justifyContent: 'center', alignItems: 'center' },
  cameraBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#0084F4', padding: normalize(6), borderRadius: normalize(15), borderWidth: 2, borderColor: '#FFFFFF' },
  changePhotoText: { marginTop: normalize(10), fontSize: normalize(14), fontWeight: '600', color: '#0084F4' },
  formSection: { paddingHorizontal: normalize(20), marginTop: normalize(20) },
  fieldContainer: { marginBottom: normalize(20) },
  fieldLabel: { fontSize: normalize(13), fontWeight: '700', color: '#475569', marginBottom: normalize(8) },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: normalize(12), paddingHorizontal: normalize(16), borderWidth: 1.5, borderColor: '#E2E8F0' },
  inputWrapperMultiline: { paddingVertical: normalize(10) },
  inputDisabled: { backgroundColor: '#F8FAFC', borderColor: '#F1F5F9' },
  input: { flex: 1, fontSize: normalize(15), color: '#1C1C1E', marginLeft: normalize(10), paddingVertical: normalize(12) },
  inputMultiline: { minHeight: normalize(100) },
  inputTextDisabled: { color: '#94A3B8' },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#DCFCE7', paddingHorizontal: normalize(8), paddingVertical: normalize(3), borderRadius: normalize(10) },
  verifiedText: { fontSize: normalize(10), fontWeight: '700', color: '#10B981', marginLeft: normalize(4) },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: normalize(25), borderTopRightRadius: normalize(25), padding: normalize(20) },
  modalHandle: { width: normalize(40), height: 5, backgroundColor: '#E2E8F0', borderRadius: 3, alignSelf: 'center', marginBottom: normalize(20) },
  modalTitle: { fontSize: normalize(18), fontWeight: '800', marginBottom: normalize(20) },
  modalOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: normalize(15) },
  modalOptionText: { fontSize: normalize(16), fontWeight: '600', marginLeft: normalize(15) },
  modalCancelBtn: { marginTop: normalize(10), paddingVertical: normalize(15), alignItems: 'center' },
  modalCancelText: { fontSize: normalize(16), fontWeight: '700', color: '#EF4444' },
});
