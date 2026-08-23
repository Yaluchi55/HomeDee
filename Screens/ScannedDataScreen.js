import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import api from '../api';
import { COLORS, RADIUS, SPACING, TYPE } from '../theme';

// Reached after the landlord (Renter role) scans a booker's QR code from
// their CheckoutScreen. Lets the landlord confirm the guest's booking.
const ScannedDataScreen = ({ navigation, route }) => {
  const { scannedData } = route.params || {};
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  let booking = null;
  try {
    booking = JSON.parse(scannedData);
  } catch {
    booking = null;
  }

  const handleConfirmGuest = async () => {
    if (!booking?.bookingId) return;
    setConfirming(true);
    try {
      // Endpoint guessed — verify against your real /api/my-guests routes.
      await api.put(`/api/my-guests/${booking.bookingId}/confirm`);
      setConfirmed(true);
    } catch (error) {
      console.error('Error confirming guest:', error?.response?.data || error.message);
      Alert.alert('Confirmation Failed', 'Could not confirm this guest. Please try again.');
    } finally {
      setConfirming(false);
    }
  };

  return (
    <View style={styles.container}>
      {booking?.type === 'zedcribs-booking' ? (
        <>
          <Text style={styles.label}>Booking Details</Text>
          <View style={styles.dataBox}>
            <Text style={styles.row}>Booking ID: {booking.bookingId}</Text>
            <Text style={styles.row}>Duration: {booking.quantity} {booking.billingUnit}</Text>
          </View>

          {confirmed ? (
            <Text style={styles.successText}>Guest confirmed ✓</Text>
          ) : (
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmGuest} disabled={confirming}>
              {confirming ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.confirmText}>Confirm Guest</Text>
              )}
            </TouchableOpacity>
          )}
        </>
      ) : (
        <>
          <Text style={styles.label}>Scanned Content</Text>
          <View style={styles.dataBox}>
            <Text style={styles.dataText}>{scannedData || 'No data captured.'}</Text>
          </View>
        </>
      )}

      <TouchableOpacity style={styles.rescanLink} onPress={() => navigation.navigate('BarcodeScannerScreen')}>
        <Text style={styles.rescanText}>Scan Another Code</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface, padding: SPACING.lg },
  label: { ...TYPE.h3, color: COLORS.textMuted, marginBottom: 10 },
  dataBox: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    padding: 16,
    minHeight: 80,
  },
  dataText: { fontSize: 15 },
  row: { fontSize: 15, marginBottom: 6, color: COLORS.text },
  confirmButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.sm,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  confirmText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  successText: { color: COLORS.success, fontWeight: '700', fontSize: 16, textAlign: 'center', marginTop: SPACING.lg },
  rescanLink: { marginTop: SPACING.lg, alignItems: 'center' },
  rescanText: { color: COLORS.primary, fontWeight: '600' },
});

export default ScannedDataScreen;
