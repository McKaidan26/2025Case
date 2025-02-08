import { Modal, StyleSheet, TextInput, Pressable } from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { useState } from 'react';
import { auth } from '@/firebase/config';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { createUserProfile } from '@/firebase/utils';

interface LoginModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function LoginModal({ visible, onClose }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');

  const handleAuth = async () => {
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await createUserProfile(userCredential.user.uid, email, 'New', 'User');
      }
      onClose();
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modalContent} onPress={e => e.stopPropagation()}>
          <ThemedText style={{ color: '#A1CEDC' }} type="title">
            {isLogin ? 'Login' : 'Sign Up'}
          </ThemedText>
          
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}

          <ThemedView style={styles.button} onTouchEnd={handleAuth}>
            <ThemedText style={{ color: '#1D3D47', fontWeight: 'bold' }}>
              {isLogin ? 'Login' : 'Sign Up'}
            </ThemedText>
          </ThemedView>

          <ThemedText 
            style={styles.toggle}
            onPress={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Need an account? Sign up' : 'Have an account? Login'}
          </ThemedText>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#1D3D47',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(161, 206, 220, 0.3)',
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    color: 'white',
    borderWidth: 1,
    borderColor: 'rgba(161, 206, 220, 0.2)',
  },
  button: {
    width: '100%',
    backgroundColor: '#A1CEDC',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  error: {
    color: '#FF6B6B',
    marginTop: 10,
  },
  toggle: {
    marginTop: 20,
    color: '#A1CEDC',
  },
}); 