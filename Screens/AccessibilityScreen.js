import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';

const AccessibilityScreen = () => {
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const Row = ({ label, value, onValueChange }) => (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Row label="Larger Text" value={largeText} onValueChange={setLargeText} />
      <Row label="High Contrast" value={highContrast} onValueChange={setHighContrast} />
      <Row label="Reduce Motion" value={reduceMotion} onValueChange={setReduceMotion} />
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

export default AccessibilityScreen;
