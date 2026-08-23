import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import api from '../api';
import { COLORS, RADIUS, SPACING, TYPE } from '../theme';

const LoginScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Booker'); // 'Booker' or 'Renter'
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!phoneNumber || !password) {
      Alert.alert('Missing Information', 'Please enter your phone number and password.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/api/login', { phoneNumber, password, role });
      const { token, isRenter } = response.data;

      if (!token) {
        throw new Error('No token returned from server');
      }

      await SecureStore.setItemAsync('userToken', token);
      await SecureStore.setItemAsync('isRenter', JSON.stringify(!!isRenter));

      navigation.reset({ index: 0, routes: [{ name: 'HomeStack' }] });
    } catch (error) {
      console.error('handleLogin Error:', error?.response?.data || error.message);
      Alert.alert(
        'Login Failed',
        error?.response?.data?.message || 'Invalid phone number or password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        placeholderTextColor="#888"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <View style={styles.roleRow}>
        <TouchableOpacity
          style={[styles.roleButton, role === 'Booker' && styles.roleButtonActive]}
          onPress={() => setRole('Booker')}
        >
          <Text style={[styles.roleText, role === 'Booker' && styles.roleTextActive]}>Booker</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.roleButton, role === 'Renter' && styles.roleButtonActive]}
          onPress={() => setRole('Renter')}
        >
          <Text style={[styles.roleText, role === 'Renter' && styles.roleTextActive]}>Renter</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginButtonText}>Log In</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.link}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: SPACING.lg, backgroundColor: COLORS.background },
  title: { ...TYPE.h1, textAlign: 'center', color: COLORS.text, marginBottom: SPACING.xl },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: SPACING.md,
    fontSize: 16,
  },
  roleRow: { flexDirection: 'row', justifyContent: 'center', marginTop: SPACING.sm, marginBottom: SPACING.lg },
  roleButton: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    paddingVertical: 14,
    paddingHorizontal: 40,
    marginHorizontal: 6,
  },
  roleButtonActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  roleText: { fontWeight: '700', fontSize: 15, color: COLORS.text },
  roleTextActive: { color: '#fff' },
  loginButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.sm,
    paddingVertical: 16,
    alignItems: 'center',
  },
  loginButtonText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  link: { color: COLORS.primary, textAlign: 'center', marginTop: SPACING.lg },
});

export default LoginScreen;
