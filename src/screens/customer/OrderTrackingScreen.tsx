import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import normalize from 'react-native-normalize';
import { RootStackParamList } from '../../types/navigation';
import { StorageService, ActiveOrder } from '../../services/StorageService';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderTracking'>;

const TRACKING_STEPS = [
  { id: 'Pesanan Diterima', title: 'Pesanan Diterima', desc: 'Partner telah menerima pesananmu', icon: 'file-document-outline' },
  { id: 'Penjemputan', title: 'Penjemputan', desc: 'Kurir sedang menuju lokasimu', icon: 'truck-delivery-outline' },
  { id: 'Proses', title: 'Sedang Proses', desc: 'Laundry sedang dikerjakan', icon: 'washing-machine' },
  { id: 'Pengantaran', title: 'Dalam Pengantaran', desc: 'Pesananmu sedang diantar kembali', icon: 'moped-outline' },
  { id: 'Selesai', title: 'Selesai', desc: 'Nikmati pakaian bersihmu!', icon: 'check-decagram-outline' },
];

export const OrderTrackingScreen = ({ navigation, route }: Props) => {
  const { orderId } = route.params;
  const [order, setOrder] = useState<ActiveOrder | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const orders = await StorageService.getActiveOrders();
      const foundOrder = orders.find(o => o.id === orderId);
      if (foundOrder) {
        setOrder(foundOrder);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (!order) return null;

  const currentStepIndex = TRACKING_STEPS.findIndex(step => step.id === order.status);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={normalize(24)} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lacak Pesanan</Text>
        <View style={{ width: normalize(44) }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Order Info Card */}
        <View style={styles.orderCard}>
          <View style={styles.orderHeader}>
            <View>
              <Text style={styles.orderIdText}>ID Pesanan: {order.id}</Text>
              <Text style={styles.orderDateText}>{order.date}</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{order.status}</Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.partnerRow}>
            <View style={styles.partnerIcon}>
              <MaterialCommunityIcons name="storefront-outline" size={normalize(24)} color="#0084F4" />
            </View>
            <View>
              <Text style={styles.partnerNameText}>{order.partnerName}</Text>
              <Text style={styles.serviceNameText}>{order.serviceName}</Text>
            </View>
          </View>
        </View>

        {/* Tracking Stepper */}
        <View style={styles.trackingContainer}>
          <Text style={styles.trackingTitle}>Status Pengiriman</Text>
          
          {TRACKING_STEPS.map((step, index) => {
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const isLast = index === TRACKING_STEPS.length - 1;

            return (
              <View key={step.id} style={styles.stepItem}>
                <View style={styles.stepLeftPane}>
                  <View style={[
                    styles.stepDot,
                    isCompleted ? styles.stepDotCompleted : styles.stepDotPending
                  ]}>
                    <MaterialCommunityIcons 
                      name={step.icon as any} 
                      size={normalize(18)} 
                      color={isCompleted ? "#FFFFFF" : "#94A3B8"} 
                    />
                  </View>
                  {!isLast && (
                    <View style={[
                      styles.stepLine,
                      index < currentStepIndex ? styles.stepLineCompleted : styles.stepLinePending
                    ]} />
                  )}
                </View>
                
                <View style={styles.stepRightPane}>
                  <Text style={[
                    styles.stepTitle,
                    isCompleted ? styles.stepTitleCompleted : styles.stepTitlePending,
                    isCurrent && styles.stepTitleCurrent
                  ]}>
                    {step.title}
                  </Text>
                  <Text style={styles.stepDesc}>{step.desc}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
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
    width: normalize(44),
    height: normalize(44),
    borderRadius: normalize(12),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: normalize(18),
    fontWeight: '800',
    color: '#1C1C1E',
  },
  scrollContent: {
    padding: normalize(20),
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(24),
    padding: normalize(20),
    marginBottom: normalize(25),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: normalize(15),
  },
  orderIdText: {
    fontSize: normalize(14),
    fontWeight: '800',
    color: '#1C1C1E',
  },
  orderDateText: {
    fontSize: normalize(12),
    color: '#94A3B8',
    marginTop: normalize(2),
  },
  statusBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(6),
    borderRadius: normalize(20),
  },
  statusText: {
    fontSize: normalize(12),
    fontWeight: '700',
    color: '#0084F4',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: normalize(15),
  },
  partnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  partnerIcon: {
    width: normalize(44),
    height: normalize(44),
    borderRadius: normalize(12),
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalize(15),
  },
  partnerNameText: {
    fontSize: normalize(15),
    fontWeight: '800',
    color: '#1C1C1E',
  },
  serviceNameText: {
    fontSize: normalize(13),
    color: '#64748B',
    marginTop: normalize(2),
  },
  trackingContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(24),
    padding: normalize(24),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  trackingTitle: {
    fontSize: normalize(16),
    fontWeight: '800',
    color: '#1C1C1E',
    marginBottom: normalize(24),
  },
  stepItem: {
    flexDirection: 'row',
    minHeight: normalize(70),
  },
  stepLeftPane: {
    alignItems: 'center',
    width: normalize(40),
  },
  stepDot: {
    width: normalize(32),
    height: normalize(32),
    borderRadius: normalize(16),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  stepDotCompleted: {
    backgroundColor: '#0084F4',
  },
  stepDotPending: {
    backgroundColor: '#E2E8F0',
  },
  stepLine: {
    width: 2,
    flex: 1,
    marginVertical: normalize(-2),
  },
  stepLineCompleted: {
    backgroundColor: '#0084F4',
  },
  stepLinePending: {
    backgroundColor: '#E2E8F0',
  },
  stepRightPane: {
    flex: 1,
    marginLeft: normalize(15),
    paddingBottom: normalize(20),
  },
  stepTitle: {
    fontSize: normalize(14),
    fontWeight: '800',
  },
  stepTitleCompleted: {
    color: '#1C1C1E',
  },
  stepTitlePending: {
    color: '#94A3B8',
  },
  stepTitleCurrent: {
    color: '#0084F4',
  },
  stepDesc: {
    fontSize: normalize(12),
    color: '#64748B',
    marginTop: normalize(4),
  },
});
