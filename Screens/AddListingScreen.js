import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, TYPE } from '../theme';

// Amenity list recovered from the compiled app bundle — these are the
// real options your build offers, tuned for the Zambian market
// (Generator/Solar for load-shedding, etc.)
const amenitiesList = [
  { key: 'Wheelchair Accessible', icon: 'accessibility-outline' },
  { key: 'Washing Machine', icon: 'water-outline' },
  { key: 'Air Conditioning', icon: 'snow-outline' },
  { key: 'Fully Furnished', icon: 'bed-outline' },
  { key: 'Generator', icon: 'flash-outline' },
  { key: 'Solar', icon: 'sunny-outline' },
  { key: 'Parking', icon: 'car-outline' },
  { key: 'Security', icon: 'shield-checkmark-outline' },
  { key: 'Gym', icon: 'barbell-outline' },
];

const AddListingScreen = ({ navigation, route }) => {
  const existing = route.params?.listing;
  const [title, setTitle] = useState(existing?.title || '');
  const [description, setDescription] = useState(existing?.description || '');
  const [bedrooms, setBedrooms] = useState(existing?.bedrooms?.toString() || '');
  const [bathrooms, setBathrooms] = useState(existing?.bathrooms?.toString() || '');
  const [selectedAmenities, setSelectedAmenities] = useState(existing?.amenities || []);

  const toggleAmenity = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleNext = () => {
    if (!title || !bedrooms) {
      Alert.alert('Missing Information', 'Please add at least a title and number of bedrooms.');
      return;
    }
    navigation.navigate('PriceScreen', {
      listingDraft: {
        ...existing,
        title,
        description,
        bedrooms,
        bathrooms,
        amenities: selectedAmenities,
      },
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: SPACING.lg }}>
      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 3-Bedroom House in Kabulonga"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Enter House Address</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Describe the property..."
        multiline
        value={description}
        onChangeText={setDescription}
      />

      <View style={styles.row}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <Text style={styles.label}>Bedrooms</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={bedrooms}
            onChangeText={setBedrooms}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Bathrooms</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={bathrooms}
            onChangeText={setBathrooms}
          />
        </View>
      </View>

      <Text style={styles.label}>Amenities</Text>
      <View style={styles.amenitiesGrid}>
        {amenitiesList.map(({ key, icon }) => {
          const active = selectedAmenities.includes(key);
          return (
            <TouchableOpacity
              key={key}
              style={[styles.amenityTile, active && styles.amenityTileActive]}
              onPress={() => toggleAmenity(key)}
            >
              <Ionicons name={icon} size={20} color={active ? '#fff' : COLORS.primary} />
              <Text style={[styles.amenityLabel, active && styles.amenityLabelActive]}>{key}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextText}>Next: Set Price</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  label: { ...TYPE.h3, fontSize: 14, marginBottom: 6, marginTop: 14, color: COLORS.text },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    padding: 12,
    fontSize: 15,
    backgroundColor: COLORS.background,
  },
  row: { flexDirection: 'row' },
  amenitiesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  amenityTile: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  amenityTileActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  amenityLabel: { marginLeft: 8, fontSize: 13, color: COLORS.text, flexShrink: 1 },
  amenityLabelActive: { color: '#fff' },
  nextButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.sm,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  nextText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

export default AddListingScreen;
