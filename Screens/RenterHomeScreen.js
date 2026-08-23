import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../api';

const RenterHomeScreen = ({ navigation }) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchListings = useCallback(async () => {
    try {
      const response = await api.get('/my-listings');
      setListings(response.data.listings || response.data || []);
    } catch (error) {
      console.error('Failed to fetch listings:', error?.response?.data || error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchListings);
    return unsubscribe;
  }, [navigation, fetchListings]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchListings();
  };

  const renderListing = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('AddListing', { listing: item, editing: true })}
    >
      <Image
        source={{ uri: item.images?.[0] || 'https://placehold.co/400x250?text=No+Image' }}
        style={styles.cardImage}
      />
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{item.title || item.address}</Text>
        <Text style={styles.cardPrice}>ZMW {item.price}</Text>
        <Text style={styles.cardStatus}>{item.status || 'Active'}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} size="large" color="blue" />
      ) : (
        <FlatList
          data={listings}
          keyExtractor={(item) => item._id || item.id}
          renderItem={renderListing}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <Text style={styles.emptyText}>You haven't added any listings yet.</Text>
          }
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddListing', { editing: false })}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  card: {
    marginBottom: 18,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#eee',
  },
  cardImage: { width: '100%', height: 160 },
  cardBody: { padding: 12 },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  cardPrice: { fontSize: 15, fontWeight: '700', color: 'blue', marginTop: 4 },
  cardStatus: { fontSize: 12, color: '#4caf50', marginTop: 4, textTransform: 'uppercase' },
  emptyText: { textAlign: 'center', color: '#888', marginTop: 40 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    backgroundColor: 'blue',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
});

export default RenterHomeScreen;
