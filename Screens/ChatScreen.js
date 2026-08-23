import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../api';

const ChatScreen = ({ navigation, route }) => {
  const { user } = route.params || {};
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const listRef = useRef(null);

  const fetchMessages = useCallback(async () => {
    try {
      const response = await api.get(`/conversations/${user?._id || user?.id}/messages`);
      setMessages(response.data.messages || response.data || []);
    } catch (error) {
      console.error('Failed to fetch messages:', error?.response?.data || error.message);
    }
  }, [user]);

  useEffect(() => {
    fetchMessages();
    // Polling as a simple stand-in for websockets/push if you don't
    // already have real-time messaging wired up on the backend.
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    const outgoing = { _id: Date.now().toString(), text, fromMe: true, createdAt: new Date().toISOString() };
    setMessages((prev) => [...prev, outgoing]);
    setText('');

    try {
      await api.post(`/conversations/${user?._id || user?.id}/messages`, { text: outgoing.text });
    } catch (error) {
      console.error('Failed to send message:', error?.response?.data || error.message);
    }
  };

  const renderMessage = ({ item }) => (
    <View style={[styles.bubble, item.fromMe ? styles.bubbleMe : styles.bubbleThem]}>
      <Text style={item.fromMe ? styles.bubbleTextMe : styles.bubbleTextThem}>{item.text}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <TouchableOpacity
        style={styles.header}
        onPress={() => navigation.navigate('UserProfile', { user })}
      >
        <Text style={styles.headerText}>{user?.name}</Text>
      </TouchableOpacity>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={renderMessage}
        contentContainerStyle={{ padding: 12 }}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
      />

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Message..."
          value={text}
          onChangeText={setText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerText: { fontWeight: '600', color: 'blue' },
  bubble: { maxWidth: '75%', borderRadius: 14, padding: 10, marginBottom: 8 },
  bubbleMe: { backgroundColor: 'blue', alignSelf: 'flex-end' },
  bubbleThem: { backgroundColor: '#f0f0f0', alignSelf: 'flex-start' },
  bubbleTextMe: { color: '#fff' },
  bubbleTextThem: { color: '#333' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d3d3d3',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: 'blue',
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ChatScreen;
