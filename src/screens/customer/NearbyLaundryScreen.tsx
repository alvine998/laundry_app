import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import normalize from 'react-native-normalize';
import { RootStackParamList } from '../../types/navigation';
import { LocationService } from '../../services/LocationService';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;
const CARD_SPACING = normalize(10);

type Props = NativeStackScreenProps<RootStackParamList, 'NearbyLaundry'>;

const MOCK_NEARBY = [
  { id: 'L-001', name: 'Clean & Fresh Laundry', rating: 4.8, distance: '0.5 km', price: 'Rp 7k/kg', lat: -6.2146, lng: 106.8451, image: 'https://images.unsplash.com/photo-1545173153-5dd9a66d939a?q=80&w=2671' },
  { id: 'L-002', name: 'Super Wash Express', rating: 4.7, distance: '0.8 km', price: 'Rp 10k/kg', lat: -6.2088, lng: 106.8456, image: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?q=80&w=2670' },
  { id: 'L-003', name: 'Baba Laundry', rating: 4.9, distance: '1.2 km', price: 'Rp 6k/kg', lat: -6.2100, lng: 106.8500, image: 'https://images.unsplash.com/photo-1604335399105-a0c5e5ad3127?q=80&w=2670' },
  { id: 'L-004', name: 'Excel Clean', rating: 4.6, distance: '1.5 km', price: 'Rp 8k/kg', lat: -6.2050, lng: 106.8400, image: 'https://images.unsplash.com/photo-1521656693084-38385eb66914?q=80&w=2574' },
];

export const NearbyLaundryScreen = ({ navigation }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const webViewRef = useRef<WebView>(null);
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    // Center map on first item on mount
    if (webViewRef.current) {
      setTimeout(() => centerMap(MOCK_NEARBY[0].lat, MOCK_NEARBY[0].lng), 2000);
    }
  }, []);

  const centerMap = (lat: number, lng: number) => {
    const js = `
      if (window.map) {
        window.map.setView([${lat}, ${lng}], 16);
      }
    `;
    webViewRef.current?.injectJavaScript(js);
  };

  const handleScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / (CARD_WIDTH + CARD_SPACING));
    if (index !== activeIndex && index >= 0 && index < MOCK_NEARBY.length) {
      setActiveIndex(index);
      centerMap(MOCK_NEARBY[index].lat, MOCK_NEARBY[index].lng);
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
          .custom-marker {
            background-color: #0084F4;
            border: 3px solid white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          const map = L.map('map', {
            zoomControl: false
          }).setView([-6.2088, 106.8456], 15);
          window.map = map;

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
          }).addTo(map);

          const stores = ${JSON.stringify(MOCK_NEARBY)};
          stores.forEach(store => {
            L.marker([store.lat, store.lng]).addTo(map)
              .bindPopup('<b>' + store.name + '</b><br>' + store.price);
          });
        </script>
      </body>
    </html>
  `;

  const renderShopItem = ({ item }: { item: typeof MOCK_NEARBY[0] }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.9}>
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.shopName} numberOfLines={1}>{item.name}</Text>
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={normalize(12)} color="#F59E0B" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>
        <View style={styles.cardFooter}>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="map-marker-distance" size={normalize(14)} color="#64748B" />
            <Text style={styles.infoText}>{item.distance}</Text>
          </View>
          <Text style={styles.priceText}>{item.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: leafletHtml }}
        style={styles.map}
      />

      <SafeAreaView style={styles.headerOverlay}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={normalize(24)} color="#1C1C1E" />
        </TouchableOpacity>
      </SafeAreaView>

      <View style={styles.bottomOverlay}>
        <FlatList
          ref={listRef}
          data={MOCK_NEARBY}
          renderItem={renderShopItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + CARD_SPACING}
          decelerationRate="fast"
          contentContainerStyle={styles.listContainer}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          keyExtractor={(item) => item.id}
        />
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
  headerOverlay: {
    position: 'absolute',
    top: normalize(10),
    left: normalize(20),
    zIndex: 10,
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
  bottomOverlay: {
    position: 'absolute',
    bottom: normalize(30),
    left: 0,
    right: 0,
    zIndex: 10,
  },
  listContainer: {
    paddingHorizontal: normalize(20),
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(20),
    marginRight: CARD_SPACING,
    flexDirection: 'row',
    padding: normalize(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  cardImage: {
    width: normalize(80),
    height: normalize(80),
    borderRadius: normalize(12),
    backgroundColor: '#F1F5F9',
  },
  cardContent: {
    flex: 1,
    marginLeft: normalize(12),
    justifyContent: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(4),
  },
  shopName: {
    flex: 1,
    fontSize: normalize(15),
    fontWeight: '800',
    color: '#1C1C1E',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: normalize(6),
    paddingVertical: normalize(2),
    borderRadius: normalize(6),
    marginLeft: normalize(6),
  },
  ratingText: {
    fontSize: normalize(11),
    fontWeight: '700',
    color: '#F59E0B',
    marginLeft: normalize(2),
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: normalize(4),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: normalize(12),
    color: '#64748B',
    fontWeight: '500',
    marginLeft: normalize(4),
  },
  priceText: {
    fontSize: normalize(13),
    fontWeight: '700',
    color: '#0084F4',
  },
});
