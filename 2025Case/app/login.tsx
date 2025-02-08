import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { TextInput } from 'react-native';
import { auth } from '@/firebase/config';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { createUserProfile } from '@/firebase/utils';

export default function LoginScreen() {
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
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">{isLogin ? 'Login' : 'Sign Up'}</ThemedText>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}

      <ThemedView style={styles.button} onTouchEnd={handleAuth}>
        <ThemedText>{isLogin ? 'Login' : 'Sign Up'}</ThemedText>
      </ThemedView>

      <ThemedText 
        style={styles.toggle}
        onPress={() => setIsLogin(!isLogin)}
      >
        {isLogin ? 'Need an account? Sign up' : 'Have an account? Login'}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  button: {
    backgroundColor: 'rgba(161, 206, 220, 0.5)',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  error: {
    color: '#FF4444',
    marginTop: 10,
  },
  toggle: {
    marginTop: 20,
    textAlign: 'center',
  },
}); 