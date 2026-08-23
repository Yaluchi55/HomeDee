import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Camera } from 'expo-camera'; // used only for the permission prompt
import { Camera as VisionCamera, useCameraDevices } from 'react-native-vision-camera';
import { useScanBarcodes, BarcodeFormat } from 'vision-camera-code-scanner';

const BarcodeScannerScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const devices = useCameraDevices();
  const device = devices.back;

  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE]);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    if (barcodes.length > 0) {
      const barcode = barcodes[0];
      if (barcode) {
        Alert.alert('QR Code Scanned', `Data: ${barcode.displayValue}`);
        navigation.navigate('ScannedDataScreen', { scannedData: barcode.displayValue });
      }
    }
  }, [barcodes]);

  if (hasPermission === null) {
    return (
      <View style={styles.centered}>
        <Text>Requesting for camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.centered}>
        <Text>No access to camera.</Text>
      </View>
    );
  }

  if (!device) {
    return <Text>Loading camera...</Text>;
  }

  return (
    <View style={styles.container}>
      <VisionCamera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        frameProcessor={frameProcessor}
        frameProcessorFps={5}
      />
      <View style={styles.scanAgainButtonContainer}>
        <TouchableOpacity style={styles.scanAgainButton} onPress={() => navigation.replace('BarcodeScannerScreen')}>
          <Text style={styles.scanAgainText}>Scan Again</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scanAgainButtonContainer: { position: 'absolute', bottom: 20 },
  scanAgainButton: { backgroundColor: '#0084ff', padding: 12, borderRadius: 8 },
  scanAgainText: { color: '#fff', fontSize: 16 },
});

export default BarcodeScannerScreen;
