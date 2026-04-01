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
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import normalize from 'react-native-normalize';
import ImagePicker from 'react-native-image-crop-picker';
import { RootStackParamList } from '../../types/navigation';
import { StorageService } from '../../services/StorageService';
import Toast from 'react-native-toast-message';

type Props = NativeStackScreenProps<RootStackParamList, 'EditProfile'>;

export const EditProfileScreen = ({ navigation }: Props) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const session = await StorageService.getUserSession();
      if (session) {
        setName(session.name || '');
        setEmail(session.email || '');
      }
    };
    loadProfile();
  }, []);

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
        cropperToolbarTitle: 'Atur Foto Profil',
      })
        .then((image) => {
          setPhotoUri(image.path);
        })
        .catch((err) => {
          if (err.code !== 'E_PICKER_CANCELLED') {
            Alert.alert('Error', 'Gagal memilih foto dari galeri.');
          }
        });
    }, 400);
  };

  const handleTakePhoto = () => {
    setShowPhotoModal(false);
    setTimeout(() => {
      ImagePicker.openCamera({
        width: 400,
        height: 400,
        cropping: true,
        cropperCircleOverlay: true,
        compressImageQuality: 0.8,
        cropperToolbarTitle: 'Atur Foto Profil',
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

  const handleRemovePhoto = () => {
    setShowPhotoModal(false);
    setPhotoUri(null);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Toast.show({ type: 'error', text1: 'Nama tidak boleh kosong' });
      return;
    }
    setIsSaving(true);
    try {
      const session = await StorageService.getUserSession();
      if (session) {
        await StorageService.setUserSession({
          ...session,
          name: name.trim(),
        });
      }
      Toast.show({ type: 'success', text1: 'Profil berhasil disimpan!' });
      setTimeout(() => navigation.goBack(), 800);
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Gagal menyimpan profil' });
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = () => {
    if (!name.trim()) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={normalize(22)} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profil</Text>
        <TouchableOpacity
          style={[styles.saveBtn, isSaving && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={isSaving}
          activeOpacity={0.7}
        >
          <Text style={styles.saveText}>{isSaving ? 'Menyimpan...' : 'Simpan'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <TouchableOpacity
            style={styles.avatarWrapper}
            onPress={() => setShowPhotoModal(true)}
            activeOpacity={0.8}
          >
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitials}>{getInitials()}</Text>
              </View>
            )}
            <View style={styles.cameraBadge}>
              <MaterialCommunityIcons name="camera" size={normalize(18)} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          <Text style={styles.changePhotoText}>Ketuk untuk ubah foto</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formSection}>
          {/* Name */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Nama Lengkap</Text>
            <View style={styles.inputWrapper}>
              <MaterialCommunityIcons name="account-outline" size={normalize(20)} color="#94A3B8" />
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Masukkan nama lengkap"
                placeholderTextColor="#CBD5E1"
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Email</Text>
            <View style={[styles.inputWrapper, styles.inputDisabled]}>
              <MaterialCommunityIcons name="email-outline" size={normalize(20)} color="#94A3B8" />
              <TextInput
                style={[styles.input, styles.inputTextDisabled]}
                value={email}
                editable={false}
                placeholder="Email"
                placeholderTextColor="#CBD5E1"
              />
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={normalize(16)} color="#10B981" />
                <Text style={styles.verifiedText}>Terverifikasi</Text>
              </View>
            </View>
          </View>

          {/* Phone */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Nomor Telepon</Text>
            <View style={styles.inputWrapper}>
              <MaterialCommunityIcons name="phone-outline" size={normalize(20)} color="#94A3B8" />
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Contoh: 08123456789"
                placeholderTextColor="#CBD5E1"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Address */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Alamat</Text>
            <View style={[styles.inputWrapper, styles.inputWrapperMultiline]}>
              <MaterialCommunityIcons
                name="map-marker-outline"
                size={normalize(20)}
                color="#94A3B8"
                style={{ marginTop: normalize(2) }}
              />
              <TextInput
                style={[styles.input, styles.inputMultiline]}
                value={address}
                onChangeText={setAddress}
                placeholder="Masukkan alamat lengkap"
                placeholderTextColor="#CBD5E1"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Photo Picker Modal */}
      <Modal
        visible={showPhotoModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPhotoModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowPhotoModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Foto Profil</Text>

            <TouchableOpacity style={styles.modalOption} onPress={handleTakePhoto}>
              <View style={[styles.modalIconCircle, { backgroundColor: '#DBEAFE' }]}>
                <Ionicons name="camera" size={normalize(22)} color="#0084F4" />
              </View>
              <View style={styles.modalOptionTextWrapper}>
                <Text style={styles.modalOptionTitle}>Ambil Foto</Text>
                <Text style={styles.modalOptionSub}>Gunakan kamera untuk foto baru</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalOption} onPress={handlePickFromGallery}>
              <View style={[styles.modalIconCircle, { backgroundColor: '#DCFCE7' }]}>
                <Ionicons name="images" size={normalize(22)} color="#10B981" />
              </View>
              <View style={styles.modalOptionTextWrapper}>
                <Text style={styles.modalOptionTitle}>Pilih dari Galeri</Text>
                <Text style={styles.modalOptionSub}>Ambil foto dari galeri perangkat</Text>
              </View>
            </TouchableOpacity>

            {photoUri && (
              <TouchableOpacity style={styles.modalOption} onPress={handleRemovePhoto}>
                <View style={[styles.modalIconCircle, { backgroundColor: '#FEE2E2' }]}>
                  <Ionicons name="trash" size={normalize(22)} color="#EF4444" />
                </View>
                <View style={styles.modalOptionTextWrapper}>
                  <Text style={[styles.modalOptionTitle, { color: '#EF4444' }]}>Hapus Foto</Text>
                  <Text style={styles.modalOptionSub}>Kembali ke inisial nama</Text>
                </View>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.modalCancelBtn}
              onPress={() => setShowPhotoModal(false)}
            >
              <Text style={styles.modalCancelText}>Batal</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    width: normalize(40),
    height: normalize(40),
    borderRadius: normalize(12),
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: normalize(17),
    fontWeight: '800',
    color: '#1C1C1E',
  },
  saveBtn: {
    backgroundColor: '#0084F4',
    paddingHorizontal: normalize(18),
    paddingVertical: normalize(10),
    borderRadius: normalize(12),
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveText: {
    color: '#FFFFFF',
    fontSize: normalize(14),
    fontWeight: '700',
  },
  content: {
    paddingBottom: normalize(40),
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: normalize(32),
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: normalize(32),
    borderBottomRightRadius: normalize(32),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarImage: {
    width: normalize(110),
    height: normalize(110),
    borderRadius: normalize(55),
    borderWidth: 4,
    borderColor: '#E0F2FE',
  },
  avatarPlaceholder: {
    width: normalize(110),
    height: normalize(110),
    borderRadius: normalize(55),
    backgroundColor: '#0084F4',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#E0F2FE',
  },
  avatarInitials: {
    fontSize: normalize(36),
    fontWeight: '800',
    color: '#FFFFFF',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: normalize(2),
    right: normalize(2),
    backgroundColor: '#0084F4',
    width: normalize(36),
    height: normalize(36),
    borderRadius: normalize(18),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#0084F4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  changePhotoText: {
    marginTop: normalize(12),
    fontSize: normalize(13),
    fontWeight: '600',
    color: '#0084F4',
  },
  formSection: {
    paddingHorizontal: normalize(20),
    marginTop: normalize(24),
  },
  fieldContainer: {
    marginBottom: normalize(20),
  },
  fieldLabel: {
    fontSize: normalize(13),
    fontWeight: '700',
    color: '#475569',
    marginBottom: normalize(8),
    marginLeft: normalize(4),
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(16),
    paddingHorizontal: normalize(16),
    paddingVertical: Platform.OS === 'ios' ? normalize(14) : normalize(4),
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  inputWrapperMultiline: {
    alignItems: 'flex-start',
    paddingVertical: normalize(14),
  },
  inputDisabled: {
    backgroundColor: '#F8FAFC',
    borderColor: '#F1F5F9',
  },
  input: {
    flex: 1,
    fontSize: normalize(15),
    color: '#1C1C1E',
    fontWeight: '600',
    marginLeft: normalize(12),
  },
  inputMultiline: {
    minHeight: normalize(70),
    textAlignVertical: 'top',
  },
  inputTextDisabled: {
    color: '#94A3B8',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(4),
    borderRadius: normalize(20),
  },
  verifiedText: {
    fontSize: normalize(11),
    fontWeight: '700',
    color: '#10B981',
    marginLeft: normalize(4),
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: normalize(28),
    borderTopRightRadius: normalize(28),
    paddingHorizontal: normalize(24),
    paddingTop: normalize(16),
    paddingBottom: normalize(40),
  },
  modalHandle: {
    width: normalize(40),
    height: normalize(5),
    backgroundColor: '#E2E8F0',
    borderRadius: normalize(3),
    alignSelf: 'center',
    marginBottom: normalize(20),
  },
  modalTitle: {
    fontSize: normalize(18),
    fontWeight: '800',
    color: '#1C1C1E',
    marginBottom: normalize(20),
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: normalize(14),
  },
  modalIconCircle: {
    width: normalize(48),
    height: normalize(48),
    borderRadius: normalize(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOptionTextWrapper: {
    flex: 1,
    marginLeft: normalize(16),
  },
  modalOptionTitle: {
    fontSize: normalize(15),
    fontWeight: '700',
    color: '#1C1C1E',
  },
  modalOptionSub: {
    fontSize: normalize(12),
    color: '#64748B',
    marginTop: normalize(2),
  },
  modalCancelBtn: {
    marginTop: normalize(16),
    paddingVertical: normalize(14),
    borderRadius: normalize(14),
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: normalize(15),
    fontWeight: '700',
    color: '#475569',
  },
});
