import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import api from '../api';
import { COLORS, RADIUS, SPACING, TYPE } from '../theme';

// The booker (renting customer) lands here from a house's details page,
// picks a duration, and confirms. On confirm, we generate a QR code
// representing the booking — the property owner (Renter role) scans this
// QR in BarcodeScannerScreen to confirm the booker's stay in person.
const CheckoutScreen = ({ navigation, route }) => {
  const { house } = route.params || {};
  const [billingUnit, setBillingUnit] = useState('days'); // 'days' | 'months'
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [showQrModal, setShowQrModal] = useState(false);

  const pricePerUnit = house?.price || 0;
  const total = useMemo(() => pricePerUnit * quantity, [pricePerUnit, quantity]);

  const decrease = () => setQuantity((q) => Math.max(1, q - 1));
  const increase = () => setQuantity((q) => q + 1);

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      const response = await api.post('/bookings', {
        houseId: house?._id || house?.id,
        billingUnit,
        quantity,
        total,
      });
      const newBookingId = response.data.bookingId || response.data._id || `${Date.now()}`;
      setBookingId(newBookingId);
      setShowQrModal(true);
    } catch (error) {
      console.error('Error submitting booking:', error?.response?.data || error.message);
      Alert.alert('Booking Failed', 'Something went wrong while confirming your booking.');
    } finally {
      setSubmitting(false);
    }
  };

  // The QR payload the landlord's scanner reads to confirm this stay.
  const qrPayload = JSON.stringify({
    type: 'zedcribs-booking',
    bookingId,
    houseId: house?._id || house?.id,
    billingUnit,
    quantity,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Checkout</Text>

      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleButton, billingUnit === 'days' && styles.toggleButtonActive]}
          onPress={() => setBillingUnit('days')}
        >
          <Text style={[styles.toggleText, billingUnit === 'days' && styles.toggleTextActive]}>DAYS</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, billingUnit === 'months' && styles.toggleButtonActive]}
          onPress={() => setBillingUnit('months')}
        >
          <Text style={[styles.toggleText, billingUnit === 'months' && styles.toggleTextActive]}>MONTHS</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>How many {billingUnit}?</Text>
      <View style={styles.stepperRow}>
        <TouchableOpacity style={styles.stepperButton} onPress={decrease}>
          <Text style={styles.stepperButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.stepperValue}>{quantity}</Text>
        <TouchableOpacity style={styles.stepperButton} onPress={increase}>
          <Text style={styles.stepperButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.totalLabel}>Total</Text>
      <Text style={styles.totalValue}>K{total}</Text>
      <Text style={styles.includesNote}>Includes booking fee</Text>

      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm} disabled={submitting}>
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.confirmText}>Confirm Booking</Text>
        )}
      </TouchableOpacity>

      <Modal visible={showQrModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Booking Confirmation</Text>
            <View style={styles.qrWrapper}>
              <QRCode value={qrPayload} size={220} />
            </View>
            <Text style={styles.modalCaption}>Scan this QR code to confirm your booking.</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setShowQrModal(false);
                navigation.popToTop();
              }}
            >
              <Text style={styles.closeButtonText}>CLOSE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface, padding: SPACING.lg },
  heading: { ...TYPE.h2, marginBottom: SPACING.lg },
  toggleRow: { flexDirection: 'row', marginBottom: SPACING.lg },
  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.border,
    marginRight: 10,
  },
  toggleButtonActive: { backgroundColor: COLORS.primary },
  toggleText: { color: '#333', fontWeight: '700', fontSize: 13 },
  toggleTextActive: { color: '#fff' },
  label: { fontSize: 16, color: COLORS.text, marginBottom: SPACING.md },
  stepperRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.lg },
  stepperButton: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperButtonText: { color: '#fff', fontSize: 22, fontWeight: '700' },
  stepperValue: { fontSize: 20, fontWeight: '700', marginHorizontal: 24, minWidth: 30, textAlign: 'center' },
  totalLabel: { color: COLORS.textMuted, fontSize: 14, marginTop: SPACING.md },
  totalValue: { fontSize: 28, fontWeight: '800', color: COLORS.text, marginTop: 4 },
  includesNote: { color: COLORS.textMuted, fontSize: 12, marginTop: 4, marginBottom: SPACING.lg },
  confirmButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.sm,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 'auto',
  },
  confirmText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    width: '85%',
  },
  modalTitle: { ...TYPE.h3, marginBottom: SPACING.md },
  qrWrapper: { padding: SPACING.md },
  modalCaption: { textAlign: 'center', color: COLORS.text, marginTop: SPACING.sm, marginBottom: SPACING.md },
  closeButton: { backgroundColor: '#2196F3', borderRadius: RADIUS.sm, paddingVertical: 12, paddingHorizontal: 32 },
  closeButtonText: { color: '#fff', fontWeight: '700' },
});

export default CheckoutScreen;
