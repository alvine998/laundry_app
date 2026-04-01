import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import normalize from 'react-native-normalize';
import { RootStackParamList } from '../types/navigation';
import { Button } from '../components/Button';

const { width } = Dimensions.get('window');

interface Slide {
  id: string;
  title: string;
  description: string;
  illustrationColor: string;
  iconName: string;
}

const SLIDES: Slide[] = [
  {
    id: '1',
    title: 'Welcome to Laundry Now',
    description: 'Cucian bersih harian, kering, dan rapi dalam hitungan jam.',
    illustrationColor: '#E0F2FE',
    iconName: 'washing-machine',
  },
  {
    id: '2',
    title: 'Trusted Partners',
    description: 'Kami bekerja sama dengan mitra laundry profesional di sekitar Anda.',
    illustrationColor: '#F0FDF4',
    iconName: 'handshake-outline',
  },
  {
    id: '3',
    title: 'Express Delivery',
    description: 'Antar jemput cucian langsung ke depan pintu Anda.',
    illustrationColor: '#FEF3C7',
    iconName: 'truck-delivery-outline',
  },
];

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

export const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollOffset / width);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.brandText}>Laundry Now</Text>
        </View>

        {/* Scrollable Carousel */}
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          style={styles.scrollView}
        >
          {SLIDES.map((slide) => (
            <View key={slide.id} style={styles.slideContainer}>
              <View style={[styles.illustration, { backgroundColor: slide.illustrationColor }]}>
                <MaterialCommunityIcons name={slide.iconName} size={normalize(100)} color="#0084F4" />
              </View>
              <View style={styles.textSection}>
                <Text style={styles.slideTitle}>{slide.title}</Text>
                <Text style={styles.slideDescription}>{slide.description}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                activeIndex === index ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>

        {/* Action Buttons Section */}
        <View style={styles.bottomSection}>
          <Text style={styles.chooseText}>Pilih cara masuk Anda</Text>
          <Button
            title="Masuk sebagai Pelanggan"
            variant="primary"
            onPress={() => navigation.navigate('CustomerLogin')}
          />
          <Button
            title="Masuk sebagai Mitra"
            variant="secondary"
            onPress={() => navigation.navigate('PartnerLogin')}
            style={styles.partnerButton}
          />
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
    paddingHorizontal: 0,
  },
  header: {
    marginTop: normalize(40),
    alignItems: 'center',
    paddingHorizontal: normalize(24),
  },
  brandText: {
    fontSize: normalize(24),
    fontWeight: '800',
    color: '#0084F4',
    letterSpacing: -0.5,
  },
  scrollView: {
    flex: 1,
  },
  slideContainer: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: normalize(40),
  },
  illustration: {
    width: normalize(240),
    height: normalize(240),
    borderRadius: normalize(120),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: normalize(40),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  textSection: {
    alignItems: 'center',
  },
  slideTitle: {
    fontSize: normalize(26),
    fontWeight: '800',
    color: '#1C1C1E',
    textAlign: 'center',
    marginBottom: normalize(16),
  },
  slideDescription: {
    fontSize: normalize(16),
    color: '#64748B',
    textAlign: 'center',
    lineHeight: normalize(24),
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: normalize(32),
  },
  dot: {
    height: normalize(8),
    borderRadius: normalize(4),
    marginHorizontal: normalize(4),
  },
  activeDot: {
    width: normalize(24),
    backgroundColor: '#0084F4',
  },
  inactiveDot: {
    width: normalize(8),
    backgroundColor: '#CBD5E1',
  },
  bottomSection: {
    paddingHorizontal: normalize(24),
    paddingBottom: normalize(40),
  },
  chooseText: {
    fontSize: normalize(14),
    fontWeight: '600',
    color: '#64748B',
    marginBottom: normalize(16),
    textAlign: 'center',
  },
  partnerButton: {
    marginTop: normalize(12),
  },
});
