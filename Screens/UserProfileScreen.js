import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const UserProfileScreen = ({ route }) => {
  const { user } = route.params || {};

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: user?.avatar || 'https://placehold.co/150x150?text=U' }}
        style={styles.avatar}
      />
      <Text style={styles.name}>{user?.name}</Text>
      {user?.bio ? <Text style={styles.bio}>{user.bio}</Text> : null}
      {user?.phone ? <Text style={styles.detail}>📞 {user.phone}</Text> : null}
      {user?.email ? <Text style={styles.detail}>✉️ {user.email}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingTop: 40, backgroundColor: '#fff' },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 16 },
  name: { fontSize: 20, fontWeight: '700' },
  bio: { color: '#666', marginTop: 8, textAlign: 'center', paddingHorizontal: 30 },
  detail: { color: '#444', marginTop: 10 },
});

export default UserProfileScreen;
