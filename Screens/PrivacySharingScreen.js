import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';

const PrivacySharingScreen = () => {
  const [showProfile, setShowProfile] = useState(true);
  const [showPhone, setShowPhone] = useState(false);
  const [dataSharing, setDataSharing] = useState(true);

  const Row = ({ label, value, onValueChange }) => (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Row label="Show my profile to other users" value={showProfile} onValueChange={setShowProfile} />
      <Row label="Show my phone number on listings" value={showPhone} onValueChange={setShowPhone} />
      <Row label="Allow usage data sharing for improvements" value={dataSharing} onValueChange={setDataSharing} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: { flex: 1, marginRight: 10, fontSize: 15 },
});

export default PrivacySharingScreen;
