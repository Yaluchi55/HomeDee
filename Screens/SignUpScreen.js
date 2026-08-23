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

const SignUpScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Booker'); // 'Booker' or 'Renter'
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!phoneNumber || !password) {
      Alert.alert('Missing Information', 'Please enter your phone number and password.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/api/signup', { phoneNumber, password, role });
      const { token } = response.data;

      if (token) {
        await SecureStore.setItemAsync('userToken', token);
        await SecureStore.setItemAsync('isRenter', JSON.stringify(role === 'Renter'));
      }

      Alert.alert('Welcome to ZedCribs', 'Your account has been created.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (error) {
      console.error('Sign up error:', error?.response?.data || error.message);
      Alert.alert(
        'Sign Up Failed',
        error?.response?.data?.message || 'Something went wrong. Please try again.'
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
      <Text style={styles.title}>Sign Up</Text>

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

      <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.signUpButtonText}>Sign Up as {role}</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Log In</Text>
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
  signUpButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.sm,
    paddingVertical: 16,
    alignItems: 'center',
  },
  signUpButtonText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  link: { color: COLORS.primary, textAlign: 'center', marginTop: SPACING.lg },
});

export default SignUpScreen;
