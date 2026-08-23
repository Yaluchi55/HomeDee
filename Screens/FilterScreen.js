import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const bedroomOptions = ['Any', '1', '2', '3', '4+'];
const typeOptions = ['Any', 'House', 'Apartment', 'Cottage', 'Room'];

const FilterScreen = ({ navigation, route }) => {
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('Any');
  const [propertyType, setPropertyType] = useState('Any');

  const applyFilters = () => {
    const filters = { minPrice, maxPrice, bedrooms, propertyType };
    route.params?.onApply?.(filters);
    navigation.goBack();
  };

  const OptionRow = ({ options, selected, onSelect }) => (
    <View style={styles.optionRow}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt}
          style={[styles.optionChip, selected === opt && styles.optionChipActive]}
          onPress={() => onSelect(opt)}
        >
          <Text style={[styles.optionText, selected === opt && styles.optionTextActive]}>{opt}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.sectionLabel}>Price Range (ZMW)</Text>
      <View style={styles.priceRow}>
        <TextInput
          style={styles.priceInput}
          placeholder="Min"
          keyboardType="numeric"
          value={minPrice}
          onChangeText={setMinPrice}
        />
        <Text style={{ marginHorizontal: 10 }}>—</Text>
        <TextInput
          style={styles.priceInput}
          placeholder="Max"
          keyboardType="numeric"
          value={maxPrice}
          onChangeText={setMaxPrice}
        />
      </View>

      <Text style={styles.sectionLabel}>Bedrooms</Text>
      <OptionRow options={bedroomOptions} selected={bedrooms} onSelect={setBedrooms} />

      <Text style={styles.sectionLabel}>Property Type</Text>
      <OptionRow options={typeOptions} selected={propertyType} onSelect={setPropertyType} />

      <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
        <Text style={styles.applyText}>Apply Filters</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  sectionLabel: { fontSize: 16, fontWeight: '600', marginTop: 20, marginBottom: 10 },
  priceRow: { flexDirection: 'row', alignItems: 'center' },
  priceInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d3d3d3',
    borderRadius: 8,
    padding: 10,
  },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap' },
  optionChip: {
    borderWidth: 1,
    borderColor: '#d3d3d3',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  optionChipActive: { backgroundColor: 'blue', borderColor: 'blue' },
  optionText: { color: '#333' },
  optionTextActive: { color: '#fff', fontWeight: '600' },
  applyButton: {
    backgroundColor: 'blue',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 30,
  },
  applyText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default FilterScreen;
