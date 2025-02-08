import { StyleSheet, Pressable, ScrollView } from 'react-native';
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

  useEffect(() => {
    const fetchUserName = async () => {
      if (user) {
        const profile = await getUserProfile(user.uid);
        setFirstName(profile.firstName);
      }
    };
    fetchUserName();
  }, [user]);

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
      {/* Welcome Message Bubble */}
      <ThemedView style={styles.welcomeContainer}>
        <ThemedView style={styles.welcomeBubble}>
          <ThemedText style={styles.welcomeText}>
            Hello, {firstName}! How can I help?
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
  );
}

const styles = StyleSheet.create({
  container: {
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
}); 