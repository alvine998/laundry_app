import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { Config } from '../constants/Config';

export const LocationService = {
  /**
   * Requests location permissions based on the platform.
   */
  async requestPermission(): Promise<boolean> {
    if (Platform.OS === 'ios') {
      // Geolocation.requestAuthorization() is typically handled via Info.plist
      // For RN community geolocation, it might automatically prompt or you may need manual check.
      return true; 
    }

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Izin Lokasi',
          message: 'Laundry Now membutuhkan akses ke lokasi Anda untuk mempermudah penjemputan.',
          buttonNeutral: 'Tanya Nanti',
          buttonNegative: 'Batal',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  },

  /**
   * Retrieves the current GPS coordinates.
   */
  getCurrentPosition(): Promise<{ latitude: number; longitude: number }> {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    });
  },

  /**
   * Performs reverse geocoding via OpenStreetMap (Nominatim) API.
   */
  async getAddressFromCoordinates(latitude: number, longitude: number): Promise<string> {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'LaundryApp/1.0', // Required by Nominatim policy
        },
      });
      const data = await response.json();

      if (data && data.display_name) {
        return data.display_name;
      } else {
        console.warn('Nominatim Geocoding error:', data);
        return 'Alamat tidak ditemukan';
      }
    } catch (error) {
      console.error('Network error during geocoding:', error);
      return 'Gagal memuat alamat';
    }
  },
};
