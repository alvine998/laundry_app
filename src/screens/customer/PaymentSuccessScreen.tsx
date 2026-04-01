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
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import normalize from 'react-native-normalize';
import { RootStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentSuccess'>;

const { width } = Dimensions.get('window');

export const PaymentSuccessScreen = ({ navigation, route }: Props) => {
  const { order } = route.params;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.successIconContainer}>
            <MaterialCommunityIcons name="check-circle" size={normalize(100)} color="#10B981" />
          </View>
          
          <Text style={styles.successTitle}>Pembayaran Berhasil!</Text>
          <Text style={styles.successSubtitle}>
            Pesanan kamu telah diteruskan ke {order.partnerName}
          </Text>

          <View style={styles.pointsEarnedCard}>
            <MaterialCommunityIcons name="star-circle" size={normalize(24)} color="#F59E0B" />
            <Text style={styles.pointsEarnedText}>Kamu mendapat +{order.estimatedPoints} Poin!</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.trackBtn}
            onPress={() => navigation.navigate('OrderTracking', { orderId: order.id })}
          >
            <Text style={styles.trackBtnText}>Lacak Pesanan</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.homeBtn}
            onPress={() => navigation.getParent()?.navigate('CustomerHome')}
          >
            <Text style={styles.homeBtnText}>Ke Beranda</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    padding: normalize(20),
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    marginBottom: normalize(40),
  },
  successIconContainer: {
    marginBottom: normalize(24),
  },
  successTitle: {
    fontSize: normalize(24),
    fontWeight: '900',
    color: '#1C1C1E',
    marginBottom: normalize(12),
  },
  successSubtitle: {
    fontSize: normalize(15),
    color: '#64748B',
    textAlign: 'center',
    lineHeight: normalize(22),
    paddingHorizontal: normalize(20),
  },
  pointsEarnedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(12),
    borderRadius: normalize(16),
    marginTop: normalize(32),
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  pointsEarnedText: {
    marginLeft: normalize(10),
    fontSize: normalize(14),
    fontWeight: '800',
    color: '#D97706',
  },
  footer: {
    width: '100%',
  },
  trackBtn: {
    backgroundColor: '#0084F4',
    paddingVertical: normalize(16),
    borderRadius: normalize(16),
    alignItems: 'center',
    marginBottom: normalize(12),
  },
  trackBtnText: {
    color: '#FFFFFF',
    fontSize: normalize(16),
    fontWeight: '800',
  },
  homeBtn: {
    backgroundColor: '#F1F5F9',
    paddingVertical: normalize(16),
    borderRadius: normalize(16),
    alignItems: 'center',
  },
  homeBtnText: {
    color: '#64748B',
    fontSize: normalize(16),
    fontWeight: '800',
  },
});
