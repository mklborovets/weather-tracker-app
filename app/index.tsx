import React from 'react';
import { Keyboard, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { CitySearch } from '@/components/weather/CitySearch';

export default function HomeScreen() {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Weather Tracker</Text>
          <Text style={styles.subtitle}>Search for a city or view your saved favorites</Text>
        </View>

        <CitySearch placeholder="Search city (e.g. Kyiv, London)..." />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#0f172a',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#94a3b8',
  },
});
