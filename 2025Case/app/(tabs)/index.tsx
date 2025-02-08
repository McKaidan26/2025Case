import { Image, StyleSheet, Dimensions, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const { user } = useAuth();
  const healthScore = user ? 85 : '--';
  const medicationScore = user ? 90 : '--';
  const lastAppointment = "1/28";
  const labelHeight = 65; // Fixed height for label container

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.healthSection}>
        <View style={styles.leftSquare}>
          <View style={styles.streakContainer}>
            <ThemedText style={styles.congratsText}>Congrats John!</ThemedText>
            <Ionicons name="flame" size={40} color="#FFA500" />
            <ThemedText style={styles.streakCount}>157</ThemedText>
            <ThemedText style={styles.streakLabel}>Day Streak</ThemedText>
          </View>
        </View>
        <View style={styles.circularContainer}>
          <View style={styles.appointmentSquare}>
            <Ionicons 
              name="calendar" 
              size={80} 
              color="rgba(139, 92, 246, 0.3)" 
              style={styles.calendarIcon} 
            />
          </View>
          <View style={styles.appointmentLabelGroup}>
            <ThemedText style={styles.mainLabel}>Next Appointment</ThemedText>
          </View>
          <ThemedText style={styles.healthScore}>2/28</ThemedText>
          {user && (
            <View style={styles.subtitleGroup}>
              <ThemedText style={styles.subLabel}>In 2 weeks</ThemedText>
            </View>
          )}
        </View>

        {/* Medication Adherence Ring */}
        <View style={[styles.circularContainer, styles.medicationContainer]}>
          <View style={styles.labelGroup}>
            <ThemedText style={styles.mainLabel}>Untransmittable</ThemedText>
          </View>
          <ThemedText style={styles.healthScore}>{medicationScore}{user ? '%' : ''}</ThemedText>
          {user && (
            <View style={styles.subtitleGroup}>
              <ThemedText style={styles.subLabel}>(as of {lastAppointment})</ThemedText>
            </View>
          )}
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
                <ThemedText style={styles.notificationTitle}>Achievement! 🌟</ThemedText>
                <ThemedText style={styles.notificationText}>5 days perfect streak!</ThemedText>
                <ThemedText style={styles.timestamp}>2 hours ago</ThemedText>
              </ThemedView>
              <ThemedView style={styles.notificationItem}>
                <ThemedText type="defaultSemiBold">Appointment Scheduled 📅</ThemedText>
                <ThemedText>Your next visit is confirmed for 2/28</ThemedText>
                <ThemedText style={styles.timestamp}>3 hours ago</ThemedText>
              </ThemedView>
              <ThemedView style={styles.notificationItem}>
                <ThemedText type="defaultSemiBold">Great Progress! 💪</ThemedText>
                <ThemedText>You're maintaining a healthy status!</ThemedText>
                <ThemedText style={styles.timestamp}>1 day ago</ThemedText>
              </ThemedView>
              <ThemedView style={styles.notificationItem}>
                <ThemedText type="defaultSemiBold">Reminder 📅</ThemedText>
                <ThemedText>Your next checkup is in 2 weeks</ThemedText>
                <ThemedText style={styles.timestamp}>2 days ago</ThemedText>
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
    backgroundColor: '#151718',
  },
  healthSection: {
    height: '45%',
    backgroundColor: 'rgba(161, 206, 220, 0.05)',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    padding: 10,
    marginTop: -20,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    flexDirection: 'row',
    paddingRight: 20,
    paddingLeft: 20,
    gap: 20,
  },
  circularContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  progressContainer: {
    position: 'absolute',
    width: 100,
    height: 100,
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f1f0f3',
    width: 100,
    textAlign: 'center',
    zIndex: 10,
    top: '35%',
    left: '10%',
    transform: [{ translateY: 5 }],
    padding: 10,
  },
  labelGroup: {
    position: 'absolute',
    top: -15,
    width: '100%',
    alignItems: 'center',
  },
  mainLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f1f0f3',
    textAlign: 'center',
  },
  subtitleGroup: {
    position: 'absolute',
    top: 80,
    width: '100%',
    alignItems: 'center',
    gap: 3,
    zIndex: 20,
  },
  subLabel: {
    fontSize: 10,
    color: '#f1f0f3',
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
    backgroundColor: 'rgba(29, 61, 71, 0.3)',
    marginBottom: 10,
  },
  timestamp: {
    fontSize: 12,
    color: '#f1f0f3',
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
    position: 'absolute',
    right: 20,
    top: '25%',
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
    color: '#333333',
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
  notificationTitle: {
    color: '#f1f0f3',
    fontWeight: '600',
  },
  notificationText: {
    color: '#f1f0f3',
  },
  leftSquare: {
    flex: 1,
    height: '85%',
    backgroundColor: 'rgba(29, 61, 71, 0.3)',
    borderRadius: 20,
    marginTop: 40,
    marginBottom: 15,
  },
  streakContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  streakCount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#f1f0f3',
    marginTop: 15,
    paddingTop: 10,
  },
  streakLabel: {
    fontSize: 16,
    color: '#f1f0f3',
    opacity: 0.8,
    marginTop: 5,
  },
  appointmentSquare: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarIcon: {
    position: 'absolute',
    opacity: 0.8,
  },
  congratsText: {
    fontSize: 18,
    color: '#f1f0f3',
    fontWeight: '600',
    marginBottom: 20,
  },
  appointmentLabelGroup: {
    position: 'absolute',
    top: -5,
    width: '100%',
    alignItems: 'center',
  },
});
