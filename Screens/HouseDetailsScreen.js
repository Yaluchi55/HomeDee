import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../api';
import { COLORS, RADIUS, SPACING, TYPE } from '../theme';

const HouseDetailsScreen = ({ navigation, route }) => {
  const { house } = route.params || {};
  const [similarHouses, setSimilarHouses] = useState([]);

  useEffect(() => {
    const fetchSimilar = async () => {
      const id = house?._id || house?.id;
      if (!id) return;
      try {
        const response = await api.get(`/houses/similar/${id}`);
        setSimilarHouses(response.data.houses || response.data || []);
      } catch (error) {
        console.error('Error fetching similar houses:', error?.response?.data || error.message);
      }
    };
    fetchSimilar();
  }, [house]);

  if (!house) {
    return (
      <View style={styles.centered}>
        <Text>No property data was passed to this screen.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {house.images?.[0] ? (
        <Image source={{ uri: house.images[0] }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder} />
      )}
      <View style={styles.body}>
        <Text style={styles.title}>{house.title || house.address}</Text>
        <Text style={styles.location}>{house.location}</Text>
        <Text style={styles.price}>
          K{house.price} {house.priceType === 'monthly' ? 'per month' : 'per night'}
        </Text>

        <View style={styles.featureRow}>
          <View style={styles.featureItem}>
            <Ionicons name="bed-outline" size={20} color="#555" />
            <Text style={styles.featureText}>{house.bedrooms ?? '—'} beds</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="water-outline" size={20} color="#555" />
            <Text style={styles.featureText}>{house.bathrooms ?? '—'} baths</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="resize-outline" size={20} color="#555" />
            <Text style={styles.featureText}>{house.size ? `${house.size} m²` : '—'}</Text>
          </View>
        </View>

        <Text style={styles.sectionHeader}>Description</Text>
        <Text style={styles.description}>{house.description || 'No description provided.'}</Text>

        {!!house.amenities?.length && (
          <>
            <Text style={styles.sectionHeader}>Amenities</Text>
            <View style={styles.amenitiesRow}>
              {house.amenities.map((a) => (
                <View key={a} style={styles.amenityChip}>
                  <Text style={styles.amenityText}>{a}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => navigation.navigate('Next', { house })}
        >
          <Text style={styles.bookButtonText}>Continue to Checkout</Text>
        </TouchableOpacity>
      </View>

      {similarHouses.length > 0 && (
        <View style={styles.similarSection}>
          <Text style={styles.sectionHeader}>Similar Houses</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.similarHousesContainer}>
            {similarHouses.map((sh) => (
              <TouchableOpacity
                key={sh._id || sh.id}
                style={styles.similarHouseBox}
                onPress={() => navigation.push('HouseDetails', { house: sh })}
              >
                {sh.images?.[0] ? (
                  <Image source={{ uri: sh.images[0] }} style={styles.similarHouseImage} />
                ) : (
                  <View style={styles.similarHouseImagePlaceholder} />
                )}
                <Text style={styles.similarHouseTitle} numberOfLines={1}>{sh.title || sh.address}</Text>
                <Text style={styles.similarHouseLocation} numberOfLines={1}>{sh.location}</Text>
                <Text style={styles.similarHousePrice}>K{sh.price}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  image: { width: '100%', height: 260 },
  imagePlaceholder: { width: '100%', height: 260, backgroundColor: COLORS.placeholder },
  body: { padding: SPACING.lg },
  title: { ...TYPE.h2, color: COLORS.text },
  location: { ...TYPE.caption, color: COLORS.textMuted, marginTop: 4 },
  price: { fontSize: 20, fontWeight: '700', color: COLORS.primary, marginTop: 10 },
  featureRow: { flexDirection: 'row', marginTop: 16 },
  featureItem: { flexDirection: 'row', alignItems: 'center', marginRight: 20 },
  featureText: { marginLeft: 6, color: '#555' },
  sectionHeader: { ...TYPE.h3, marginTop: 22, marginBottom: 8, marginLeft: 0 },
  description: { color: '#444', lineHeight: 20 },
  amenitiesRow: { flexDirection: 'row', flexWrap: 'wrap' },
  amenityChip: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.pill,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  amenityText: { fontSize: 13, color: COLORS.text },
  bookButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.sm,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 30,
  },
  bookButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  similarSection: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xl },
  similarHousesContainer: { flexDirection: 'row' },
  similarHouseBox: { width: 150, marginRight: 12 },
  similarHouseImage: { width: 150, height: 110, borderRadius: RADIUS.sm },
  similarHouseImagePlaceholder: { width: 150, height: 110, borderRadius: RADIUS.sm, backgroundColor: COLORS.placeholder },
  similarHouseTitle: { fontSize: 13, fontWeight: '600', marginTop: 6, color: COLORS.text },
  similarHouseLocation: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  similarHousePrice: { fontSize: 13, fontWeight: '700', color: COLORS.primary, marginTop: 2 },
});

export default HouseDetailsScreen;
