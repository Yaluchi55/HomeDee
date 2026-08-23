import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import api from '../api';

const MessageListScreen = ({ navigation }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = useCallback(async () => {
    try {
      const response = await api.get('/conversations');
      setConversations(response.data.conversations || response.data || []);
    } catch (error) {
      console.error('Failed to fetch conversations:', error?.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchConversations);
    return unsubscribe;
  }, [navigation, fetchConversations]);

  const renderConversation = ({ item }) => (
    <TouchableOpacity
      style={styles.row}
      onPress={() => navigation.navigate('Chat', { user: item.user })}
    >
      <Image
        source={{ uri: item.user?.avatar || 'https://placehold.co/100x100?text=U' }}
        style={styles.avatar}
      />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.user?.name}</Text>
        <Text style={styles.preview} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>
      {item.unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <FlatList
      data={conversations}
      keyExtractor={(item) => item._id || item.id}
      renderItem={renderConversation}
      ListEmptyComponent={<Text style={styles.emptyText}>No conversations yet.</Text>}
      contentContainerStyle={conversations.length === 0 && { flex: 1, justifyContent: 'center' }}
    />
  );
};

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12 },
  textContainer: { flex: 1 },
  name: { fontSize: 16, fontWeight: '600' },
  preview: { fontSize: 13, color: '#777', marginTop: 2 },
  badge: {
    backgroundColor: 'blue',
    borderRadius: 12,
    minWidth: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  emptyText: { textAlign: 'center', color: '#888' },
});

export default MessageListScreen;
