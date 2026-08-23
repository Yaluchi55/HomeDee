import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const LoginAndSecurityScreen = ({ navigation }) => {
  const Item = ({ label, screen }) => (
    <TouchableOpacity style={styles.row} onPress={() => navigation.navigate(screen)}>
      <Text style={styles.label}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Item label="Change Password" screen="ChangePassword" />
      <Item label="Update Phone Number" screen="UpdatePhoneNumber" />
      <Item label="Update Email" screen="UpdateEmail" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: { fontSize: 15 },
});

export default LoginAndSecurityScreen;
