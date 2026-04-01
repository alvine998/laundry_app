import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import normalize from 'react-native-normalize';
import { RootStackParamList } from '../../types/navigation';
import { CustomerTabParamList } from '../../navigation/CustomerTabNavigator';
import { StorageService, ActiveOrder } from '../../services/StorageService';

type Props = CompositeScreenProps<
  BottomTabScreenProps<CustomerTabParamList, 'Pesanan'>,
  NativeStackScreenProps<RootStackParamList>
>;

export const CustomerOrdersScreen = ({ navigation }: Props) => {
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [refreshing, setRefreshing] = useState(false);
  const [activeOrders, setActiveOrders] = useState<ActiveOrder[]>([]);

  const fetchData = async () => {
    const orders = await StorageService.getActiveOrders();
    setActiveOrders(orders);
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData().then(() => setRefreshing(false));
  }, []);

  const orders = activeTab === 'active' 
    ? activeOrders.filter(o => o.status !== 'Selesai') 
    : activeOrders.filter(o => o.status === 'Selesai');

  const renderOrderItem = ({ item }: { item: ActiveOrder }) => (
    <TouchableOpacity 
      style={styles.orderCard}
      onPress={() => navigation.navigate('OrderTracking', { orderId: item.id })}
    >
      <View style={styles.orderHeader}>
        <View style={[styles.iconContainer, { backgroundColor: '#EFF6FF' }]}>
          <MaterialCommunityIcons name="washing-machine" size={normalize(24)} color="#0084F4" />
        </View>
        <View style={styles.orderMainInfo}>
          <Text style={styles.serviceName}>{item.serviceName}</Text>
          <Text style={styles.orderDate}>{item.date}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: '#EFF6FF' }]}>
          <Text style={[styles.statusText, { color: '#0084F4' }]}>{item.status}</Text>
        </View>
      </View>
      
      <View style={styles.orderFooter}>
        <Text style={styles.orderId}>{item.id}</Text>
        <Text style={styles.orderPrice}>Rp {item.totalAmount.toLocaleString('id-ID')}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pesanan Saya</Text>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tabItem, activeTab === 'active' && styles.activeTabItem]}
          onPress={() => setActiveTab('active')}
        >
          <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>Aktif</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabItem, activeTab === 'history' && styles.activeTabItem]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>Riwayat</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0084F4" colors={['#0084F4']} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="clipboard-text-outline" size={normalize(64)} color="#E2E8F0" />
            <Text style={styles.emptyTitle}>Belum ada pesanan</Text>
            <Text style={styles.emptySubtitle}>Ayo mulai laundry bajumu sekarang!</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(15),
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: normalize(20),
    fontWeight: '800',
    color: '#1C1C1E',
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(10),
  },
  tabItem: {
    flex: 1,
    paddingVertical: normalize(10),
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabItem: {
    borderBottomColor: '#0084F4',
  },
  tabText: {
    fontSize: normalize(14),
    color: '#64748B',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#0084F4',
    fontWeight: '700',
  },
  listContainer: {
    padding: normalize(20),
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(16),
    padding: normalize(16),
    marginBottom: normalize(16),
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(16),
  },
  iconContainer: {
    width: normalize(44),
    height: normalize(44),
    borderRadius: normalize(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderMainInfo: {
    flex: 1,
    marginLeft: normalize(12),
  },
  serviceName: {
    fontSize: normalize(15),
    fontWeight: '700',
    color: '#1C1C1E',
  },
  orderDate: {
    fontSize: normalize(12),
    color: '#64748B',
    marginTop: normalize(2),
  },
  statusBadge: {
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(6),
    borderRadius: normalize(8),
  },
  statusText: {
    fontSize: normalize(11),
    fontWeight: '800',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: normalize(12),
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  orderId: {
    fontSize: normalize(12),
    color: '#94A3B8',
    fontWeight: '600',
  },
  orderPrice: {
    fontSize: normalize(15),
    fontWeight: '800',
    color: '#0084F4',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: normalize(100),
  },
  emptyTitle: {
    fontSize: normalize(18),
    fontWeight: '800',
    color: '#1C1C1E',
    marginTop: normalize(16),
  },
  emptySubtitle: {
    fontSize: normalize(14),
    color: '#64748B',
    marginTop: normalize(8),
    textAlign: 'center',
  },
});
