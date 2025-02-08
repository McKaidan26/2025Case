import { Modal, StyleSheet, TextInput, Pressable } from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserProfile, updateMedications } from '@/firebase/utils';
import { UserProfile } from '@/types';

interface ProfileModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function ProfileModal({ visible, onClose }: ProfileModalProps) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [medications, setMedications] = useState({
    baseDrug: '',
    integraseInhibitor: '',
    nnrti: '',
    proteaseInhibitor: ''
  });

  useEffect(() => {
    if (user && visible) {
      loadProfile();
    }
  }, [user, visible]);

  const loadProfile = async () => {
    if (!user) return;
    const userProfile = await getUserProfile(user.uid);
    setProfile(userProfile);
    if (userProfile.medications) {
      setMedications(userProfile.medications);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    await updateMedications(user.uid, medications);
    onClose();
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
          <ThemedText style={styles.title} type="title">Profile</ThemedText>
          
          <ThemedText style={styles.label}>Base Drug</ThemedText>
          <TextInput
            style={styles.input}
            value={medications.baseDrug}
            onChangeText={(text) => setMedications(prev => ({ ...prev, baseDrug: text }))}
            placeholder="Enter base drug"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
          />

          <ThemedText style={styles.label}>Integrase Inhibitor</ThemedText>
          <TextInput
            style={styles.input}
            value={medications.integraseInhibitor}
            onChangeText={(text) => setMedications(prev => ({ ...prev, integraseInhibitor: text }))}
            placeholder="Enter integrase inhibitor"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
          />

          <ThemedText style={styles.label}>NNRTI</ThemedText>
          <TextInput
            style={styles.input}
            value={medications.nnrti}
            onChangeText={(text) => setMedications(prev => ({ ...prev, nnrti: text }))}
            placeholder="Enter NNRTI"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
          />

          <ThemedText style={styles.label}>Protease Inhibitor</ThemedText>
          <TextInput
            style={styles.input}
            value={medications.proteaseInhibitor}
            onChangeText={(text) => setMedications(prev => ({ ...prev, proteaseInhibitor: text }))}
            placeholder="Enter protease inhibitor"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
          />

          <ThemedView style={styles.buttonContainer}>
            <ThemedView style={styles.button} onTouchEnd={handleSave}>
              <ThemedText>Save</ThemedText>
            </ThemedView>
          </ThemedView>
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
  label: {
    color: '#A1CEDC',
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  title: {
    color: '#A1CEDC',
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
  },
  button: {
    width: '100%',
    backgroundColor: '#A1CEDC',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  }
}); 