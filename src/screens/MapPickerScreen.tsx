import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { WebView } from 'react-native-webview';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import normalize from 'react-native-normalize';
import { RootStackParamList } from '../types/navigation';
import { LocationService } from '../services/LocationService';

type Props = NativeStackScreenProps<RootStackParamList, 'MapPicker'>;

const INITIAL_REGION = {
  latitude: -6.2088,
  longitude: 106.8456,
};

export const MapPickerScreen = ({ navigation, route }: Props) => {
  const { onSelect } = route.params;
  const [address, setAddress] = useState('Sedang mencari alamat...');
  const [isLoading, setIsLoading] = useState(false);
  const webViewRef = useRef<WebView>(null);

  useEffect(() => {
    handleAutoLocate();
  }, []);

  const handleAutoLocate = async () => {
    const hasPermission = await LocationService.requestPermission();
    if (hasPermission) {
      try {
        const position = await LocationService.getCurrentPosition();
        // Move Leaflet map
        const js = `
          if (window.map) {
            window.map.setView([${position.latitude}, ${position.longitude}], 16);
          }
        `;
        webViewRef.current?.injectJavaScript(js);
      } catch (error) {
        console.error('Failed to get current location', error);
      }
    }
  };

  const handleRegionChangeComplete = async (lat: number, lon: number) => {
    setIsLoading(true);
    try {
      const newAddress = await LocationService.getAddressFromCoordinates(lat, lon);
      setAddress(newAddress);
    } catch (error) {
      console.error('Error fetching address:', error);
      setAddress('Gagal memuat alamat');
    } finally {
      setIsLoading(false);
    }
  };

  const onMessage = (event: any) => {
    const data = JSON.parse(event.nativeEvent.data);
    if (data.type === 'MOVE_END') {
      handleRegionChangeComplete(data.lat, data.lng);
    }
  };

  const leafletHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          body { margin: 0; padding: 0; }
          #map { height: 100vh; width: 100vw; }
          .leaflet-control-attribution { display: none !important; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          const map = L.map('map', {
            zoomControl: false
          }).setView([${INITIAL_REGION.latitude}, ${INITIAL_REGION.longitude}], 15);
          window.map = map;

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
          }).addTo(map);

          map.on('moveend', function() {
            const center = map.getCenter();
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'MOVE_END',
              lat: center.lat,
              lng: center.lng
            }));
          });

          // Send initial center
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'MOVE_END',
            lat: ${INITIAL_REGION.latitude},
            lng: ${INITIAL_REGION.longitude}
          }));
        </script>
      </body>
    </html>
  `;

  const handleConfirm = () => {
    onSelect(address);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: leafletHtml }}
        style={styles.map}
        onMessage={onMessage}
        scrollEnabled={false}
      />

      {/* Center Marker Pin */}
      <View style={styles.markerFixed} pointerEvents="none">
        <Ionicons name="location" size={normalize(45)} color="#EF4444" />
        <View style={styles.markerShadow} />
      </View>

      {/* Floating My Location Button */}
      <TouchableOpacity 
        style={styles.myLocationBtn} 
        onPress={handleAutoLocate}
        activeOpacity={0.8}
      >
        <Ionicons name="locate" size={normalize(24)} color="#1C1C1E" />
      </TouchableOpacity>

      {/* Header */}
      <SafeAreaView style={styles.headerOverlay}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={normalize(24)} color="#1C1C1E" />
          </TouchableOpacity>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={normalize(18)} color="#94A3B8" />
            <Text style={styles.searchText}>Cari lokasi atau area...</Text>
          </View>
        </View>
      </SafeAreaView>

      {/* Bottom Selection Card */}
      <View style={styles.bottomCard}>
        <View style={styles.addressSection}>
          <View style={styles.addressHeader}>
            <Ionicons name="navigate" size={normalize(18)} color="#0084F4" />
            <Text style={styles.addressLabel}>Lokasi Terpilih</Text>
          </View>
          {isLoading ? (
            <ActivityIndicator size="small" color="#0084F4" style={styles.loader} />
          ) : (
            <Text style={styles.addressValue} numberOfLines={2}>
              {address}
            </Text>
          )}
        </View>

        <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
          <Text style={styles.confirmText}>Gunakan Lokasi Ini</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  map: {
    flex: 1,
  },
  markerFixed: {
    left: '50%',
    marginLeft: normalize(-22.5),
    marginTop: normalize(-45),
    position: 'absolute',
    top: '50%',
    alignItems: 'center',
    zIndex: 10,
  },
  markerShadow: {
    width: normalize(10),
    height: normalize(4),
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: normalize(5),
    marginTop: normalize(-5),
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: normalize(20),
    paddingTop: normalize(10),
  },
  backBtn: {
    backgroundColor: '#FFFFFF',
    width: normalize(44),
    height: normalize(44),
    borderRadius: normalize(12),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchBar: {
    flex: 1,
    height: normalize(44),
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(12),
    marginLeft: normalize(12),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: normalize(15),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchText: {
    marginLeft: normalize(10),
    color: '#94A3B8',
    fontSize: normalize(14),
    fontWeight: '500',
  },
  bottomCard: {
    position: 'absolute',
    bottom: normalize(30),
    left: normalize(20),
    right: normalize(20),
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(24),
    padding: normalize(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    zIndex: 20,
  },
  addressSection: {
    marginBottom: normalize(20),
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(8),
  },
  addressLabel: {
    fontSize: normalize(12),
    fontWeight: '700',
    color: '#0084F4',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginLeft: normalize(6),
  },
  addressValue: {
    fontSize: normalize(15),
    fontWeight: '700',
    color: '#1C1C1E',
    lineHeight: normalize(22),
  },
  loader: {
    alignSelf: 'flex-start',
    marginVertical: normalize(10),
  },
  confirmBtn: {
    backgroundColor: '#0084F4',
    paddingVertical: normalize(16),
    borderRadius: normalize(16),
    alignItems: 'center',
  },
  confirmText: {
    color: '#FFFFFF',
    fontSize: normalize(16),
    fontWeight: '800',
  },
  myLocationBtn: {
    position: 'absolute',
    bottom: normalize(200),
    right: normalize(20),
    backgroundColor: '#FFFFFF',
    width: normalize(48),
    height: normalize(48),
    borderRadius: normalize(24),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 20,
  },
});
