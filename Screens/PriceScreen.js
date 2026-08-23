import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const PriceScreen = ({ navigation, route }) => {
  const { listingDraft } = route.params || {};
  const [price, setPrice] = useState(listingDraft?.price?.toString() || '');
  const [priceType, setPriceType] = useState(listingDraft?.priceType || 'monthly');

  const handleNext = () => {
    if (!price) {
      Alert.alert('Missing Information', 'Please set a price.');
      return;
    }
    navigation.navigate('SetLocation', {
      listingDraft: { ...listingDraft, price: Number(price), priceType },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Price (ZMW)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="e.g. 8000"
        value={price}
        onChangeText={setPrice}
      />

      <Text style={styles.label}>Billing</Text>
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleButton, priceType === 'nightly' && styles.toggleButtonActive]}
          onPress={() => setPriceType('nightly')}
        >
          <Text style={priceType === 'nightly' ? styles.toggleTextActive : styles.toggleText}>
            Per Night
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, priceType === 'monthly' && styles.toggleButtonActive]}
          onPress={() => setPriceType('monthly')}
        >
          <Text style={priceType === 'monthly' ? styles.toggleTextActive : styles.toggleText}>
            Per Month
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextText}>Next: Set Location</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6, marginTop: 14 },
  input: {
    borderWidth: 1,
    borderColor: '#d3d3d3',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
  },
  toggleRow: { flexDirection: 'row' },
  toggleButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d3d3d3',
    paddingVertical: 12,
    alignItems: 'center',
  },
  toggleButtonActive: { backgroundColor: 'blue', borderColor: 'blue' },
  toggleText: { color: '#333' },
  toggleTextActive: { color: '#fff', fontWeight: '600' },
  nextButton: {
    backgroundColor: 'blue',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 30,
  },
  nextText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default PriceScreen;
