import { StyleSheet, Pressable, View } from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from '@/components/LoginModal';
import { FontAwesome } from '@expo/vector-icons';
import ProfileModal from '@/components/ProfileModal';

export default function TopBar() {
  const { user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleProfilePress = () => {
    if (user) {
      setShowProfileModal(true);
    } else {
      setShowLoginModal(true);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Your Portal</ThemedText>
      
      <Pressable 
        style={styles.avatarContainer} 
        onPress={handleProfilePress}
      >
        <View style={[
          styles.avatarRing,
          user ? styles.loggedInRing : styles.loggedOutRing
        ]}>
          <FontAwesome 
            name="user-circle" 
            size={35} 
            color={user ? '#A1CEDC' : 'rgba(161, 206, 220, 0.5)'}
          />
        </View>
      </Pressable>

      <LoginModal 
        visible={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
      
      <ProfileModal
        visible={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(161, 206, 220, 0.3)',
  },
  avatarContainer: {
    padding: 5,  // Add some padding for better touch area
  },
  avatarRing: {
    padding: 3,
    borderRadius: 25,
    borderWidth: 2,
  },
  loggedInRing: {
    borderColor: '#4CAF50',  // Green
  },
  loggedOutRing: {
    borderColor: '#FF4444',  // Red
  },
}); 