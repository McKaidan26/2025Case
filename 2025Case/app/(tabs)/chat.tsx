import { StyleSheet, Pressable, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserProfile } from '@/firebase/utils';
import ChatInterface from '../../components/ChatInterface';

type ChatMode = 'medications' | 'sideEffects' | 'resources' | null;

export default function ChatScreen() {
  const { user } = useAuth();
  const [chatMode, setChatMode] = useState<ChatMode>(null);
  const [firstName, setFirstName] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUserName = async () => {
      if (user) {
        const profile = await getUserProfile(user.uid);
        setFirstName(profile.firstName);
      }
    };
    fetchUserName();
  }, [user]);

  const handleSend = () => {
    if (message.trim()) {
      setMessage('');
    }
  };

  if (!user) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.loginMessageContainer}>
          <ThemedText style={styles.loginMessage}>
            Please log in to access the chat features
          </ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

  if (chatMode) {
    return <ChatInterface mode={chatMode} onBack={() => setChatMode(null)} />;
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.mainContent}>
        {/* Welcome Message Bubble */}
        <ThemedView style={styles.welcomeContainer}>
          <ThemedView style={styles.welcomeBubble}>
            <ThemedText style={styles.welcomeText}>
              Hello, {firstName || 'John'}! How can I help?
            </ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Chat Option Bubbles */}
        <ThemedView style={styles.optionsContainer}>
          <Pressable onPress={() => setChatMode('medications')}>
            <ThemedView style={styles.optionBubble}>
              <ThemedText style={styles.optionText}>
                Questions about medications 💊
              </ThemedText>
            </ThemedView>
          </Pressable>

          <Pressable onPress={() => setChatMode('sideEffects')}>
            <ThemedView style={styles.optionBubble}>
              <ThemedText style={styles.optionText}>
                Questions about side effects 🏥
              </ThemedText>
            </ThemedView>
          </Pressable>

          <Pressable onPress={() => setChatMode('resources')}>
            <ThemedView style={styles.optionBubble}>
              <ThemedText style={styles.optionText}>
                Questions about HIV resources ℹ️
              </ThemedText>
            </ThemedView>
          </Pressable>
        </ThemedView>
      </ThemedView>

      {/* Centered Input Bar */}
      <ThemedView style={styles.inputBar}>
        <TextInput
          style={styles.textInput}
          placeholder="Type a message..."
          placeholderTextColor="#A1CEDC"
          value={message}
          onChangeText={setMessage}
        />
        <Pressable onPress={handleSend}>
          <ThemedView style={styles.sendButton}>
            <ThemedText style={styles.sendButtonText}>Send</ThemedText>
          </ThemedView>
        </Pressable>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    padding: 20,
  },
  welcomeContainer: {
    marginTop: 40,
    marginBottom: 40,
  },
  welcomeBubble: {
    backgroundColor: '#A1CEDC',
    padding: 15,
    borderRadius: 20,
    maxWidth: '80%',
    alignSelf: 'flex-start',
  },
  welcomeText: {
    color: '#1D3D47',
    fontSize: 18,
  },
  optionsContainer: {
    gap: 15,
    alignItems: 'flex-end',
  },
  optionBubble: {
    backgroundColor: 'rgba(161, 206, 220, 0.2)',
    padding: 15,
    borderRadius: 20,
    maxWidth: '80%',
  },
  optionText: {
    color: '#A1CEDC',
    fontSize: 16,
  },
  loginMessageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: -100,
  },
  loginMessage: {
    fontSize: 20,
    textAlign: 'center',
    color: 'rgba(161, 206, 220, 0.8)',
    fontWeight: '500',
  },
  inputBar: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 2,
    borderTopColor: '#A1CEDC',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1D3D47',
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  textInput: {
    flex: 1,
    height: 40,
    borderWidth: 2,
    borderColor: '#A1CEDC',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
    color: '#fff',
    maxWidth: '70%',
    backgroundColor: 'rgba(161, 206, 220, 0.1)',
  },
  sendButton: {
    backgroundColor: '#A1CEDC',
    padding: 10,
    borderRadius: 20,
    paddingHorizontal: 20,
  },
  sendButtonText: {
    color: '#1D3D47',
    fontWeight: 'bold',
  },
}); 