import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import normalize from 'react-native-normalize';
import { RootStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'UlasanPelanggan'>;

const REVIEWS = [
  { id: '1', customer: 'Rina Wijaya', rating: 5, date: '21 Mar 2026', comment: 'Layanan sangat cepat dan baju rapi sekali. Suka banget!', orderId: 'ORD-092', avatar: 'https://i.pravatar.cc/150?u=Rina' },
  { id: '2', customer: 'Andi Pratama', rating: 4, date: '19 Mar 2026', comment: 'Bersih banget, cuman pengiriman agak telat dikit. Tapi oke lah.', orderId: 'ORD-085', avatar: 'https://i.pravatar.cc/150?u=Andi' },
  { id: '3', customer: 'Siti Aminah', rating: 5, date: '15 Mar 2026', comment: 'Wangi banget laundrynya, gak nyesel langganan di sini.', orderId: 'ORD-077', avatar: 'https://i.pravatar.cc/150?u=Siti' },
  { id: '4', customer: 'Eko Sulistyo', rating: 3, date: '12 Mar 2024', comment: 'Agak kurang rapi lipatannya kali ini, semoga kedepannya lebih baik.', orderId: 'ORD-064', avatar: 'https://i.pravatar.cc/150?u=Eko' },
];

const RatingStars = ({ rating }: { rating: number }) => (
  <View style={styles.starRow}>
    {[1, 2, 3, 4, 5].map((s) => (
      <Ionicons key={s} name={s <= rating ? 'star' : 'star-outline'} size={normalize(14)} color="#F59E0B" style={{ marginRight: 2 }} />
    ))}
  </View>
);

export const UlasanPelangganScreen = ({ navigation }: Props) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={normalize(22)} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ulasan Pelanggan</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Rating Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.ratingInfo}>
            <Text style={styles.averageRating}>4.9</Text>
            <RatingStars rating={5} />
            <Text style={styles.totalReviews}>Berdasarkan 1.2k ulasan</Text>
          </View>
          <View style={styles.ratingBars}>
            {[5, 4, 3, 2, 1].map((s) => (
              <View key={s} style={styles.barItem}>
                <Text style={styles.barLabel}>{s}</Text>
                <View style={styles.barWrapper}>
                  <View style={[styles.barFill, { width: s === 5 ? '85%' : s === 4 ? '10%' : '5%' }]} />
                </View>
              </View>
            ))}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Semua Ulasan</Text>

        {REVIEWS.map((review) => (
          <View key={review.id} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Image source={{ uri: review.avatar }} style={styles.customerAvatar} />
              <View style={styles.customerInfo}>
                <Text style={styles.customerName}>{review.customer}</Text>
                <Text style={styles.orderRef}>Order {review.orderId} • {review.date}</Text>
              </View>
              <RatingStars rating={review.rating} />
            </View>
            <Text style={styles.commentText}>{review.comment}</Text>
            <TouchableOpacity style={styles.replyBtn}>
              <Text style={styles.replyText}>Balas Ulasan</Text>
            </TouchableOpacity>
          </View>
        ))}

        <View style={{ height: normalize(40) }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: normalize(20), paddingVertical: normalize(15), backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  backBtn: { padding: normalize(8) },
  headerTitle: { fontSize: normalize(17), fontWeight: '800', color: '#1C1C1E' },
  content: { padding: normalize(20) },
  summaryCard: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: normalize(24), padding: normalize(24), marginBottom: normalize(32), shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 4 },
  ratingInfo: { alignItems: 'center', justifyContent: 'center', flex: 0.8, borderRightWidth: 1, borderRightColor: '#F1F5F9', paddingRight: normalize(15) },
  averageRating: { fontSize: normalize(42), fontWeight: '900', color: '#1C1C1E', marginBottom: normalize(4) },
  totalReviews: { fontSize: normalize(11), color: '#94A3B8', marginTop: normalize(8), fontWeight: '600' },
  ratingBars: { flex: 1, paddingLeft: normalize(20), justifyContent: 'center' },
  barItem: { flexDirection: 'row', alignItems: 'center', marginBottom: normalize(6) },
  barLabel: { fontSize: normalize(10), fontWeight: '800', color: '#64748B', width: normalize(10) },
  barWrapper: { flex: 1, height: normalize(6), backgroundColor: '#F1F5F9', borderRadius: normalize(3), marginLeft: normalize(8) },
  barFill: { height: '100%', backgroundColor: '#F59E0B', borderRadius: normalize(3) },
  sectionTitle: { fontSize: normalize(16), fontWeight: '800', color: '#1C1C1E', marginBottom: normalize(20), marginLeft: normalize(4) },
  reviewCard: { backgroundColor: '#FFFFFF', borderRadius: normalize(20), padding: normalize(16), marginBottom: normalize(16), borderWidth: 1, borderColor: '#F1F5F9' },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: normalize(12) },
  customerAvatar: { width: normalize(44), height: normalize(44), borderRadius: normalize(22), backgroundColor: '#F1F5F9' },
  customerInfo: { flex: 1, marginLeft: normalize(12) },
  customerName: { fontSize: normalize(14), fontWeight: '700', color: '#1C1C1E' },
  orderRef: { fontSize: normalize(11), color: '#94A3B8', marginTop: 2 },
  starRow: { flexDirection: 'row' },
  commentText: { fontSize: normalize(14), color: '#475569', lineHeight: normalize(22) },
  replyBtn: { alignSelf: 'flex-start', marginTop: normalize(12), paddingVertical: normalize(6), paddingHorizontal: normalize(12), borderRadius: normalize(8), backgroundColor: '#F0F9FF' },
  replyText: { fontSize: normalize(12), color: '#0084F4', fontWeight: '700' },
});
