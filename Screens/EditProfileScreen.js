import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import api from '../api';

const EditProfileScreen = ({ navigation, route }) => {
  const { user } = route.params || {};
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/updateProfile', { name, bio });
      Alert.alert('Saved', 'Your profile has been updated.');
      navigation.goBack();
    } catch (error) {
      console.error('Failed to update profile:', error?.response?.data || error.message);
      Alert.alert('Error', 'Could not save your changes.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Bio</Text>
      <TextInput
        style={[styles.input, { height: 90 }]}
        multiline
        value={bio}
        onChangeText={setBio}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
        {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveText}>Save Changes</Text>}
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

export default EditProfileScreen;
