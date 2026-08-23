import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import api from '../api';

const DEFAULT_REGION = {
  latitude: -15.3875,
  longitude: 28.3228,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
};

// Renamed from the old dual-purpose "NextScreen" — this one is only
// responsible for setting the listing's address + map pin.
const SetLocationScreen = ({ navigation, route }) => {
  const { listingDraft } = route.params || {};
  const [address, setAddress] = useState(listingDraft?.address || '');
  const [marker, setMarker] = useState(
    listingDraft?.latitude
      ? { latitude: listingDraft.latitude, longitude: listingDraft.longitude }
      : null
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!address || !marker) {
      Alert.alert('Missing Information', 'Please enter an address and drop a pin on the map.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...listingDraft,
        address,
        latitude: marker.latitude,
        longitude: marker.longitude,
      };

      // Real endpoint recovered from the app bundle:
      await api.post('/api/listings/submitListing', payload);

      Alert.alert('Listing Saved', 'Your property has been published.', [
        { text: 'OK', onPress: () => navigation.navigate('RenterHome') },
      ]);
    } catch (error) {
      console.error('Save listing error:', error?.response?.data || error.message);
      Alert.alert('Save Failed', 'Something went wrong while saving your listing.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Street address / area"
        value={address}
        onChangeText={setAddress}
      />

      <MapView
        style={styles.map}
        initialRegion={DEFAULT_REGION}
        onPress={(e) => setMarker(e.nativeEvent.coordinate)}
      >
        {marker && <Marker coordinate={marker} />}
      </MapView>
      <Text style={styles.hint}>Tap on the map to drop a pin at the property's location.</Text>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
        {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveText}>Publish Listing</Text>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#d3d3d3',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    marginBottom: 14,
  },
  map: { flex: 1, borderRadius: 10, overflow: 'hidden' },
  hint: { color: '#888', fontSize: 12, marginTop: 8, textAlign: 'center' },
  saveButton: {
    backgroundColor: 'blue',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 14,
  },
  saveText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default SetLocationScreen;
