import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import api from '../api';

const DEFAULT_REGION = {
  // Lusaka, Zambia
  latitude: -15.3875,
  longitude: 28.3228,
  latitudeDelta: 0.15,
  longitudeDelta: 0.15,
};

const MapScreen = ({ navigation }) => {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const response = await api.get('/houses');
        setHouses(response.data.houses || response.data || []);
      } catch (error) {
        console.error('Failed to fetch houses for map:', error?.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHouses();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={DEFAULT_REGION}>
        {houses
          .filter((h) => h.latitude && h.longitude)
          .map((house) => (
            <Marker
              key={house._id || house.id}
              coordinate={{ latitude: house.latitude, longitude: house.longitude }}
              title={house.title || house.address}
              description={`ZMW ${house.price}`}
              onCalloutPress={() => navigation.navigate('HouseDetails', { house })}
            />
          ))}
      </MapView>
      {houses.filter((h) => h.latitude && h.longitude).length === 0 && (
        <View style={styles.overlayNote}>
          <Text style={styles.overlayText}>No listings have location data yet.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  overlayNote: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    elevation: 3,
  },
  overlayText: { textAlign: 'center', color: '#666' },
});

export default MapScreen;
