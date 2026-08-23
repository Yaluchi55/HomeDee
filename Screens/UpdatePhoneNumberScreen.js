import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import api from '../api';

const UpdatePhoneNumberScreen = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);

  const handleUpdate = async () => {
    if (!phone) {
      Alert.alert('Missing Information', 'Please enter a phone number.');
      return;
    }
    setSaving(true);
    try {
      await api.put('/updateProfile', { phoneNumber: phone });
      Alert.alert('Success', 'Your phone number has been updated.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error('Update phone error:', error?.response?.data || error.message);
      Alert.alert('Error', 'Could not update your phone number.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>New Phone Number</Text>
      <TextInput style={styles.input} keyboardType="phone-pad" value={phone} onChangeText={setPhone} />

      <TouchableOpacity style={styles.saveButton} onPress={handleUpdate} disabled={saving}>
        {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveText}>Update</Text>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6, marginTop: 14 },
  input: { borderWidth: 1, borderColor: '#d3d3d3', borderRadius: 8, padding: 12, fontSize: 15 },
  saveButton: { backgroundColor: 'blue', borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginTop: 30 },
  saveText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default UpdatePhoneNumberScreen;
