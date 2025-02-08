import { StyleSheet, TextInput, Pressable, ScrollView } from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';

interface ChatInterfaceProps {
  mode: 'medications' | 'sideEffects' | 'resources';
  onBack: () => void;
}

export default function ChatInterface({ mode, onBack }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Array<{text: string, isUser: boolean}>>([
    { text: getInitialMessage(mode), isUser: false }
  ]);
  const [input, setInput] = useState('');

  function getInitialMessage(mode: string) {
    switch (mode) {
      case 'medications':
        return "What would you like to know about your medications? I can help with dosage, timing, and general information.";
      case 'sideEffects':
        return "I can provide information about common side effects and when you should contact your healthcare provider.";
      case 'resources':
        return "I can help you find local support groups, educational materials, and healthcare providers.";
      default:
        return "How can I help you today?";
    }
  }

  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { text: input, isUser: true }]);
    setInput('');
    
    // Add bot response based on mode
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: `This is a response from the ${mode} chatbot.`, 
        isUser: false 
      }]);
    }, 500);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={24} color="#A1CEDC" />
        </Pressable>
        <ThemedText style={styles.title}>
          {mode === 'medications' && 'Medication Questions'}
          {mode === 'sideEffects' && 'Side Effects Support'}
          {mode === 'resources' && 'HIV Resources'}
        </ThemedText>
      </ThemedView>

      <ScrollView style={styles.messagesContainer}>
        {messages.map((message, index) => (
          <ThemedView
            key={index}
            style={[
              styles.messageBubble,
              message.isUser ? styles.userMessage : styles.botMessage
            ]}
          >
            <ThemedText style={message.isUser ? styles.userText : styles.botText}>
              {message.text}
            </ThemedText>
          </ThemedView>
        ))}
      </ScrollView>

      <ThemedView style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type your message..."
          placeholderTextColor="rgba(255,255,255,0.5)"
          onSubmitEditing={handleSend}
        />
        <Pressable onPress={handleSend} style={styles.sendButton}>
          <FontAwesome name="send" size={20} color="#A1CEDC" />
        </Pressable>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(161, 206, 220, 0.3)',
  },
  backButton: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    marginLeft: 10,
  },
  messagesContainer: {
    flex: 1,
    padding: 15,
  },
  messageBubble: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 15,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(161, 206, 220, 0.2)',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#A1CEDC',
  },
  userText: {
    color: '#A1CEDC',
  },
  botText: {
    color: '#1D3D47',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(161, 206, 220, 0.3)',
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
    color: 'white',
  },
  sendButton: {
    padding: 10,
  },
});