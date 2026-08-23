import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import api from '../api';

const MenuItem = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Ionicons name={icon} size={22} color="#555" style={{ width: 30 }} />
    <Text style={styles.menuLabel}>{label}</Text>
    <Ionicons name="chevron-forward" size={18} color="#ccc" />
  </TouchableOpacity>
);

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/profile');
        setUser(response.data.user || response.data);
      } catch (error) {
        console.error('Failed to fetch profile:', error?.response?.data || error.message);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('userToken');
    Alert.alert('Logged Out', 'You have been logged out.');
    // Root App.js should pick this up via a re-check of auth state / context.
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: user?.avatar || 'https://placehold.co/100x100?text=U' }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user?.name || 'Your Name'}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('EditProfile', { user })}>
          <Text style={styles.editLink}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <MenuItem
        icon="person-outline"
        label="Personal Information"
        onPress={() => navigation.navigate('PersonalInformation', { user })}
      />
      <MenuItem
        icon="lock-closed-outline"
        label="Login and Security"
        onPress={() => navigation.navigate('LoginAndSecurity')}
      />
      <MenuItem
        icon="eye-outline"
        label="Privacy & Sharing"
        onPress={() => navigation.navigate('PrivacySharing')}
      />
      <MenuItem
        icon="accessibility-outline"
        label="Accessibility"
        onPress={() => navigation.navigate('Accessibility')}
      />

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { alignItems: 'center', paddingVertical: 30, borderBottomWidth: 1, borderBottomColor: '#eee' },
  avatar: { width: 90, height: 90, borderRadius: 45, marginBottom: 12 },
  name: { fontSize: 18, fontWeight: '700' },
  email: { color: '#777', marginTop: 2 },
  editLink: { color: 'blue', marginTop: 10, fontWeight: '600' },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
  },
  menuLabel: { flex: 1, fontSize: 15 },
  logoutButton: { margin: 20, paddingVertical: 14, alignItems: 'center' },
  logoutText: { color: 'red', fontWeight: '600', fontSize: 15 },
});

export default ProfileScreen;
