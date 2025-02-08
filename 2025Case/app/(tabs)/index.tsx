import { Image, StyleSheet, Dimensions, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/contexts/AuthContext';

export default function HomeScreen() {
  const { user } = useAuth();
  const healthScore = user ? 85 : '--';
  const medicationScore = user ? 90 : '--';
  const lastAppointment = "1/28";
  const labelHeight = 65; // Fixed height for label container

  return (
    <ThemedView style={styles.container}>
      {/* Health Status Section */}
      <ThemedView style={styles.healthSection}>
        <View style={styles.circularContainer}>
          <ThemedText style={styles.healthScore}>{healthScore}{user ? '%' : ''}</ThemedText>
          <View style={styles.labelGroup}>
            <ThemedText style={styles.mainLabel}>Suppression</ThemedText>
            {user && (
              <ThemedText style={styles.subLabel}>
                (as of your last appointment {lastAppointment})
              </ThemedText>
            )}
          </View>
          <View style={[styles.progressContainer, !user && styles.disabledProgress]}>
            <View style={styles.progressRingBase} />
            <View style={[styles.progressRingBase, styles.greenSection]} />
            <View style={[styles.progressRingBase, styles.yellowSection]} />
            <View style={[styles.progressRingBase, styles.orangeSection]} />
            <View style={[styles.progressRingBase, styles.redSection]} />
          </View>
        </View>

        {/* Medication Adherence Ring */}
        <View style={[styles.circularContainer, styles.medicationContainer]}>
          <ThemedText style={styles.healthScore}>{medicationScore}{user ? '%' : ''}</ThemedText>
          <View style={styles.labelGroup}>
            <ThemedText style={styles.mainLabel}>Daily Medicine</ThemedText>
            {user && (
              <ThemedText style={styles.subLabel}>
                (based on the last 7 days)
              </ThemedText>
            )}
          </View>
          <View style={[styles.progressContainer, !user && styles.disabledProgress]}>
            <View style={styles.progressRingBase} />
            <View style={[styles.progressRingBase, styles.greenSection]} />
            <View style={[styles.progressRingBase, styles.yellowSection]} />
            <View style={[styles.progressRingBase, styles.orangeSection]} />
            <View style={[styles.progressRingBase, styles.redSection]} />
          </View>
        </View>
      </ThemedView>

      {/* Notifications Section */}
      <ThemedView style={styles.notificationsSection}>
        <ThemedText type="title">Recent Notifications</ThemedText>
        <ThemedView style={styles.notificationsList}>
          {user ? (
            <>
              <ThemedView style={styles.notificationItem}>
                <ThemedText type="defaultSemiBold">System Update</ThemedText>
                <ThemedText>New features available</ThemedText>
                <ThemedText style={styles.timestamp}>2 hours ago</ThemedText>
              </ThemedView>
              <ThemedView style={styles.notificationItem}>
                <ThemedText type="defaultSemiBold">Health Alert</ThemedText>
                <ThemedText>Weekly health report ready</ThemedText>
                <ThemedText style={styles.timestamp}>5 hours ago</ThemedText>
              </ThemedView>
              <ThemedView style={styles.notificationItem}>
                <ThemedText type="defaultSemiBold">Maintenance</ThemedText>
                <ThemedText>Scheduled maintenance completed</ThemedText>
                <ThemedText style={styles.timestamp}>1 day ago</ThemedText>
              </ThemedView>
            </>
          ) : (
            <ThemedView style={styles.notificationItem}>
              <ThemedText type="defaultSemiBold">Welcome</ThemedText>
              <ThemedText>Please log in to view your notifications</ThemedText>
            </ThemedView>
          )}
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  healthSection: {
    height: '40%',
    backgroundColor: 'rgba(161, 206, 220, 0.1)',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    padding: 10,
    paddingTop: 0,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 20,
  },
  circularContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  progressContainer: {
    position: 'absolute',
    width: 160,
    height: 160,
    zIndex: 1,
    transform: [{ rotate: '-110deg' }],
  },
  progressRingBase: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 100,
    borderWidth: 15,
    borderColor: 'transparent',
  },
  greenSection: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 100,
    borderWidth: 15,
    borderColor: '#4CAF50',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    transform: [{ rotate: '135deg' }],
    zIndex: 4,
  },
  yellowSection: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 100,
    borderWidth: 15,
    borderColor: '#FFD700',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    transform: [{ rotate: '90deg' }],
    zIndex: 3,
  },
  orangeSection: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 100,
    borderWidth: 15,
    borderColor: '#FFA500',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    transform: [{ rotate: '45deg' }],
    zIndex: 2,
  },
  redSection: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 100,
    borderWidth: 15,
    borderColor: '#FF4444',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    transform: [{ rotate: '0deg' }],
    zIndex: 1,
  },
  healthScore: {
    position: 'absolute',
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFFFFF',
    width: 140,
    textAlign: 'center',
    zIndex: 10,
    top: '35%',
    left: '15%',
    transform: [{ translateY: 5 }],
    padding: 20,
  },
  labelGroup: {
    position: 'absolute',
    bottom: -50,
    width: '100%',
    alignItems: 'center',
  },
  mainLabel: {
    fontSize: 16,
    color: '#8FA5AE',
    textAlign: 'center',
    marginBottom: 4,
  },
  subLabel: {
    fontSize: 12,
    color: '#8FA5AE',
    textAlign: 'center',
  },
  notificationsSection: {
    flex: 1,
    padding: 20,
  },
  notificationsList: {
    marginTop: 10,
  },
  notificationItem: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginBottom: 10,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  medicationContainer: {
  },
  labelContainer: {
    position: 'absolute',
    height: 65,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    transform: [{ translateY: -80 }],
    backgroundColor: 'transparent',
    width: 140,
  },
  scoreLabel: {
    position: 'absolute',
    fontSize: 14,
    color: '#8FA5AE',
    zIndex: 10,
    transform: [{ translateY: 25 }],
    backgroundColor: 'transparent',
    width: 140,
    textAlign: 'center',
  },
  dateLabel: {
    fontSize: 12,
    color: '#8FA5AE',
    textAlign: 'center',
    marginTop: 4,
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
  disabledProgress: {
    opacity: 0.3,
  },
  titleLabel: {
    position: 'absolute',
    fontSize: 14,
    color: '#8FA5AE',
    textAlign: 'center',
    top: 20,
    width: 140,
  },
});
