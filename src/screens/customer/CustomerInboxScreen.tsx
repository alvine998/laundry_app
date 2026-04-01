import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import normalize from 'react-native-normalize';
import { RootStackParamList } from '../../types/navigation';
import { CustomerTabParamList } from '../../navigation/CustomerTabNavigator';

type Props = CompositeScreenProps<
  BottomTabScreenProps<CustomerTabParamList, 'Inbox'>,
  NativeStackScreenProps<RootStackParamList>
>;

const MOCK_MESSAGES = [
  {
    id: '1',
    type: 'order',
    title: 'Pesanan Selesai!',
    message: 'Hore! Pesanan ORD-2026-000 sudah selesai dan siap diantar.',
    time: 'Baru saja',
    isUnread: true,
    icon: 'check-circle-outline',
    iconColor: '#10B981',
  },
  {
    id: '2',
    type: 'promo',
    title: 'Voucher Spesial 50%',
    message: 'Khusus buat kamu! Gunakan kode LAUNDRYKECE untuk diskon 50%.',
    time: '2 jam yang lalu',
    isUnread: true,
    icon: 'ticket-percent-outline',
    iconColor: '#0084F4',
  },
  {
    id: '3',
    type: 'order',
    title: 'Kurir Menuju Lokasi',
    message: 'Kurir kami sedang menuju lokasi untuk menjemput pakaianmu.',
    time: '5 jam yang lalu',
    isUnread: false,
    icon: 'truck-delivery-outline',
    iconColor: '#F59E0B',
  },
  {
    id: '4',
    type: 'system',
    title: 'Update Keamanan',
    message: 'Kami telah memperbarui kebijakan privasi kami. Silakan cek di sini.',
    time: 'Kemarin',
    isUnread: false,
    icon: 'shield-check-outline',
    iconColor: '#64748B',
  },
];

export const CustomerInboxScreen = ({ navigation }: Props) => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  const renderMessageItem = ({ item }: { item: typeof MOCK_MESSAGES[0] }) => (
    <TouchableOpacity
      style={[styles.messageItem, item.isUnread && styles.unreadItem]}
      onPress={() => navigation.navigate('InboxDetail', {
        id: item.id,
        type: item.type,
        title: item.title,
        message: item.message,
        time: item.time,
        icon: item.icon,
        iconColor: item.iconColor,
      })}
    >
      <View style={[styles.iconContainer, { backgroundColor: item.iconColor + '15' }]}>
        <MaterialCommunityIcons name={item.icon as any} size={normalize(24)} color={item.iconColor} />
      </View>
      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <Text style={[styles.messageTitle, item.isUnread && styles.unreadTitle]}>{item.title}</Text>
          <Text style={styles.messageTime}>{item.time}</Text>
        </View>
        <Text style={styles.messageSnippet} numberOfLines={2}>
          {item.message}
        </Text>
      </View>
      {item.isUnread && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Inbox</Text>
        <TouchableOpacity>
          <Text style={styles.markReadText}>Tandai dibaca</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={MOCK_MESSAGES}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0084F4" colors={['#0084F4']} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="email-outline" size={normalize(64)} color="#E2E8F0" />
            <Text style={styles.emptyTitle}>Belum ada pesan</Text>
            <Text style={styles.emptySubtitle}>Pesan dan notifikasi akan muncul di sini</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  markReadText: {
    fontSize: normalize(14),
    fontWeight: '700',
    color: '#0084F4',
  },
  listContainer: {
    paddingVertical: normalize(10),
  },
  messageItem: {
    flexDirection: 'row',
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(16),
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
    alignItems: 'center',
    position: 'relative',
  },
  unreadItem: {
    backgroundColor: '#F8FAFC',
  },
  iconContainer: {
    width: normalize(48),
    height: normalize(48),
    borderRadius: normalize(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageContent: {
    flex: 1,
    marginLeft: normalize(15),
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(4),
  },
  messageTitle: {
    fontSize: normalize(15),
    fontWeight: '700',
    color: '#475569',
  },
  unreadTitle: {
    color: '#1C1C1E',
  },
  messageTime: {
    fontSize: normalize(11),
    color: '#94A3B8',
    fontWeight: '600',
  },
  messageSnippet: {
    fontSize: normalize(13),
    color: '#64748B',
    lineHeight: normalize(18),
  },
  unreadDot: {
    width: normalize(8),
    height: normalize(8),
    borderRadius: normalize(4),
    backgroundColor: '#0084F4',
    position: 'absolute',
    top: normalize(16),
    right: normalize(20),
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
