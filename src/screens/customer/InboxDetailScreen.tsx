import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import normalize from 'react-native-normalize';
import { RootStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'InboxDetail'>;

export const InboxDetailScreen = ({ navigation, route }: Props) => {
  const { title, message, time, icon, iconColor, type } = route.params;

  const getTypeLabel = () => {
    switch (type) {
      case 'order':
        return 'Pesanan';
      case 'promo':
        return 'Promosi';
      case 'system':
        return 'Sistem';
      default:
        return 'Notifikasi';
    }
  };

  const getTypeBgColor = () => {
    switch (type) {
      case 'order':
        return '#DCFCE7';
      case 'promo':
        return '#DBEAFE';
      case 'system':
        return '#F1F5F9';
      default:
        return '#F1F5F9';
    }
  };

  const getTypeTextColor = () => {
    switch (type) {
      case 'order':
        return '#10B981';
      case 'promo':
        return '#0084F4';
      case 'system':
        return '#64748B';
      default:
        return '#64748B';
    }
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
        <Text style={styles.headerTitle}>Detail Pesan</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Icon + Type Badge */}
        <View style={styles.topSection}>
          <View style={[styles.iconCircle, { backgroundColor: iconColor + '15' }]}>
            <MaterialCommunityIcons
              name={icon as any}
              size={normalize(40)}
              color={iconColor}
            />
          </View>
          <View style={[styles.typeBadge, { backgroundColor: getTypeBgColor() }]}>
            <Text style={[styles.typeText, { color: getTypeTextColor() }]}>
              {getTypeLabel()}
            </Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>{title}</Text>

        {/* Time */}
        <View style={styles.timeRow}>
          <Ionicons name="time-outline" size={normalize(14)} color="#94A3B8" />
          <Text style={styles.timeText}>{time}</Text>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Message Body */}
        <Text style={styles.body}>{message}</Text>
      </ScrollView>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(15),
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
  headerSpacer: {
    width: normalize(40),
  },
  content: {
    padding: normalize(24),
  },
  topSection: {
    alignItems: 'center',
    marginBottom: normalize(24),
  },
  iconCircle: {
    width: normalize(80),
    height: normalize(80),
    borderRadius: normalize(24),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: normalize(16),
  },
  typeBadge: {
    paddingHorizontal: normalize(14),
    paddingVertical: normalize(6),
    borderRadius: normalize(20),
  },
  typeText: {
    fontSize: normalize(12),
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: normalize(22),
    fontWeight: '900',
    color: '#1C1C1E',
    textAlign: 'center',
    marginBottom: normalize(8),
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: normalize(24),
  },
  timeText: {
    fontSize: normalize(13),
    color: '#94A3B8',
    fontWeight: '600',
    marginLeft: normalize(6),
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: normalize(24),
  },
  body: {
    fontSize: normalize(15),
    color: '#475569',
    lineHeight: normalize(24),
    fontWeight: '500',
  },
});
