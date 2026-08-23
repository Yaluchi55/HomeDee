import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../api';
import { COLORS, RADIUS, SPACING, TYPE } from '../theme';

const HomeScreen = ({ navigation }) => {
  const [houses, setHouses] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHouses = useCallback(async () => {
    try {
      const response = await api.get('/houses', { params: { search } });
      setHouses(response.data.houses || response.data || []);
    } catch (error) {
      console.error('Error fetching houses:', error?.response?.data || error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [search]);

  useEffect(() => {
    fetchHouses();
  }, [fetchHouses]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHouses();
  };

  const renderHouse = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => navigation.navigate('HouseDetails', { house: item })}
    >
      {item.images?.[0] ? (
        <Image source={{ uri: item.images[0] }} style={styles.cardImage} />
      ) : (
        <View style={styles.cardImagePlaceholder} />
      )}
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{item.title || item.address}</Text>
        <Text style={styles.cardSubtitle}>{item.location}</Text>
        <Text style={styles.cardPrice}>
          K{item.price} {item.priceType === 'monthly' ? 'per month' : 'per night'}
        </Text>
        {!!item.bedrooms && (
          <Text style={styles.cardMeta}>{item.bedrooms}-bedroom {item.propertyType || 'Property'}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color="#888" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by area, e.g. Kabulonga"
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={fetchHouses}
          />
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={() => navigation.navigate('Filter')}>
          <Ionicons name="options-outline" size={22} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} size="large" color={COLORS.primary} />
      ) : (
        <FlatList
          data={houses}
          keyExtractor={(item) => item._id || item.id}
          renderItem={renderHouse}
          contentContainerStyle={{ padding: SPACING.md }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No properties found. Try adjusting your search.</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  searchRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingTop: 12 },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 10,
    height: 44,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 15 },
  filterButton: { marginLeft: 10, padding: 8 },
  card: {
    marginBottom: 20,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    backgroundColor: COLORS.card,
    // subtle elevation instead of a hard border, per the design pass
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  cardImage: { width: '100%', height: 200 },
  cardImagePlaceholder: { width: '100%', height: 200, backgroundColor: COLORS.placeholder },
  cardBody: { padding: 14 },
  cardTitle: { ...TYPE.h3, color: COLORS.text },
  cardSubtitle: { ...TYPE.caption, color: COLORS.textMuted, marginTop: 3 },
  cardPrice: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginTop: 8 },
  cardMeta: { ...TYPE.caption, color: COLORS.textMuted, marginTop: 2 },
  emptyText: { textAlign: 'center', color: COLORS.textMuted, marginTop: 40 },
});

export default HomeScreen;
