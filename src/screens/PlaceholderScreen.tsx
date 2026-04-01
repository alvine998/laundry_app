import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import normalize from 'react-native-normalize';

export const PlaceholderScreen = (title: string) => {
  return () => (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>Bagian ini sedang dalam pengembangan.</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: normalize(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: normalize(24),
    fontWeight: '800',
    color: '#1C1C1E',
    marginBottom: normalize(8),
  },
  subtitle: {
    fontSize: normalize(16),
    color: '#64748B',
    textAlign: 'center',
  },
});
