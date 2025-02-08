import { StyleSheet, Modal, View, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import type { DateData } from 'react-native-calendars';
import { useState } from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import Slider from '@react-native-community/slider';

interface Event {
  title: string;
  description: string;
  date: string;
}

interface HealthCheckIn {
  mood: number;
  stress: number;
  medication: boolean;
  date: string;
}

interface Visit {
  date: string;
  title: string;
  description: string;
  time?: string;
}

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [mood, setMood] = useState(10);
  const [medication, setMedication] = useState(true);
  const [healthCheckIns, setHealthCheckIns] = useState<HealthCheckIn[]>([]);
  
  // Function to get last Friday of a month
  const getLastFriday = (year: number, month: number): string => {
    const lastDay = new Date(year, month + 1, 0);
    const lastFriday = new Date(lastDay);
    
    while (lastFriday.getDay() !== 5) { // 5 is Friday
      lastFriday.setDate(lastFriday.getDate() - 1);
    }

    return lastFriday.toISOString().split('T')[0];
  };

  // Get next 3 months' last Fridays
  const today = new Date();
  const nextThreeMonths = [1, 2, 3].map(i => {
    const date = new Date(today);
    date.setMonth(today.getMonth() + i);
    return getLastFriday(date.getFullYear(), date.getMonth());
  });

  const [events] = useState<Event[]>([
    {
      title: 'Doctor Appointment',
      description: 'Regular checkup',
      date: nextThreeMonths[0]
    },
    {
      title: 'Doctor Appointment',
      description: 'Regular checkup',
      date: nextThreeMonths[1]
    },
    {
      title: 'Doctor Appointment',
      description: 'Regular checkup',
      date: nextThreeMonths[2]
    }
  ]);

  const [upcomingVisits] = useState<Visit[]>([
    {
      date: nextThreeMonths[0],
      title: 'Regular Checkup',
      description: 'Routine health monitoring and medication review',
      time: '10:00 AM'
    },
    {
      date: nextThreeMonths[1],
      title: 'Lab Work',
      description: 'Blood work and viral load testing',
      time: '2:30 PM'
    },
    {
      date: nextThreeMonths[2],
      title: 'Follow-up Visit',
      description: 'Review lab results and adjust treatment if needed',
      time: '11:15 AM'
    },
  ]);

  // Convert events to marked dates format
  const getMarkedDates = () => {
    const marked: { [key: string]: any } = {};
    
    // Add all events as dots
    events.forEach(event => {
      marked[event.date] = {
        marked: true,
        dotColor: '#A1CEDC',
      };
    });

    // Add health check-in markers
    healthCheckIns.forEach(checkIn => {
      marked[checkIn.date] = {
        ...(marked[checkIn.date] || {}),
        selected: true,
        selectedColor: checkIn.medication ? '#4CAF50' : '#FF5252', // Green for taken, red for not taken
        dotColor: marked[checkIn.date]?.dotColor, // Preserve event dots if they exist
        marked: marked[checkIn.date]?.marked // Preserve event dots if they exist
      };
    });

    // Add selected date styling (only if not already colored by medication status)
    if (selectedDate && !marked[selectedDate]?.selectedColor) {
      marked[selectedDate] = {
        ...(marked[selectedDate] || {}),
        selected: true,
        selectedColor: '#A1CEDC'
      };
    }

    return marked;
  };

  // Get events for selected date
  const getEventsForDate = (date: string): Event[] => {
    return events.filter(event => event.date === date);
  };

  const handleDayPress = (day: any) => {
    setSelectedDate(day.dateString);
    setModalVisible(true);
  };

  const handleSaveCheckIn = () => {
    const checkIn: HealthCheckIn = {
      mood,
      stress: 5, // Assuming a default stress level
      medication,
      date: selectedDate
    };
    setHealthCheckIns(prev => {
      // Remove any existing check-in for this date
      const filtered = prev.filter(item => item.date !== selectedDate);
      // Add the new check-in
      return [...filtered, checkIn];
    });
    setModalVisible(false);
  };

  const existingCheckIn = healthCheckIns.find(item => item.date === selectedDate);

  const handleDeleteCheckIn = () => {
    setHealthCheckIns(prev => prev.filter(item => item.date !== selectedDate));
    setModalVisible(false);
  };

  // First, add this helper function near the top of the file
  const getColorForValue = (value: number) => {
    // Create color range from red (0) to green (10)
    const colors = [
      '#FF0000', // 0 - Red
      '#FF3300',
      '#FF6600',
      '#FF9900',
      '#FFCC00',
      '#FFFF00', // 5 - Yellow
      '#CCFF00',
      '#99FF00',
      '#66FF00',
      '#33FF00',
      '#00FF00'  // 10 - Green
    ];
    return colors[value];
  };

  return (
    <ThemedView style={styles.container}>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={getMarkedDates()}
        theme={{
          backgroundColor: 'transparent',
          calendarBackground: 'transparent',
          textSectionTitleColor: '#1D3D47',
          selectedDayBackgroundColor: '#A1CEDC',
          selectedDayTextColor: '#ffffff',
          dayTextColor: '#d9e1e8',
          textDisabledColor: '#2d4150',
          arrowColor: '#A1CEDC',
          dotColor: '#A1CEDC',
          selectedDotColor: '#ffffff',
          todayBackgroundColor: 'rgba(161, 206, 220, 0.2)',
          todayTextColor: '#ffffff',
          todayFontWeight: 'bold',
          todayFontSize: 16,
        }}
      />

      <ThemedView style={styles.visitsSection}>
        <ThemedText type="title" style={styles.sectionTitle}>
          Upcoming Visits
        </ThemedText>
        
        <ScrollView 
          style={styles.visitsScrollView}
          showsVerticalScrollIndicator={false}
        >
          {events
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .filter(event => new Date(event.date) >= new Date()) // Only show future events
            .map((event, index) => (
              <ThemedView key={index} style={styles.visitCard}>
                <ThemedView style={styles.visitHeader}>
                  <ThemedText type="defaultSemiBold">
                    {new Date(event.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </ThemedText>
                </ThemedView>
                
                <ThemedText type="defaultSemiBold" style={styles.visitTitle}>
                  {event.title}
                </ThemedText>
                <ThemedText style={styles.visitDescription}>
                  {event.description}
                </ThemedText>
              </ThemedView>
            ))}
        </ScrollView>
      </ThemedView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <ThemedView style={styles.modalContent}>
            <ThemedText type="title">Daily Check-in</ThemedText>
            <ThemedText type="defaultSemiBold">{selectedDate}</ThemedText>

            <ThemedView style={styles.checkInItem}>
              <ThemedText>How are you feeling? (1-10)</ThemedText>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={10}
                step={1}
                value={mood}
                onValueChange={setMood}
                minimumTrackTintColor="#d9e1e8"
                maximumTrackTintColor="#d9e1e8"
                thumbTintColor={getColorForValue(mood)}
              />
              <ThemedText style={{ color: getColorForValue(mood) }}>{mood}</ThemedText>
            </ThemedView>

            <ThemedView style={styles.checkInItem}>
              <ThemedText>Medication Taken</ThemedText>
              <ThemedView style={styles.toggleContainer}>
                <ThemedView 
                  style={[
                    styles.toggleButton,
                    !medication ? [styles.toggleActive, { backgroundColor: getColorForValue(0) }] : null
                  ]}
                  onTouchEnd={() => setMedication(false)}
                >
                  <ThemedText style={{ color: '#fff' }}>No</ThemedText>
                </ThemedView>
                <ThemedView 
                  style={[
                    styles.toggleButton,
                    medication ? [styles.toggleActive, { backgroundColor: getColorForValue(10) }] : null
                  ]}
                  onTouchEnd={() => setMedication(true)}
                >
                  <ThemedText style={{ color: '#fff' }}>Yes</ThemedText>
                </ThemedView>
              </ThemedView>
            </ThemedView>

            <ThemedView style={styles.buttonContainer}>
              <ThemedView 
                style={styles.button}
                onTouchEnd={() => setModalVisible(false)}
              >
                <ThemedText>Cancel</ThemedText>
              </ThemedView>
              {existingCheckIn && (
                <ThemedView 
                  style={[styles.button, styles.deleteButton]}
                  onTouchEnd={handleDeleteCheckIn}
                >
                  <ThemedText>Delete</ThemedText>
                </ThemedView>
              )}
              <ThemedView 
                style={[styles.button, styles.saveButton]}
                onTouchEnd={handleSaveCheckIn}
              >
                <ThemedText>Save</ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    gap: 15,
  },
  modalText: {
    marginVertical: 10,
    textAlign: 'center',
  },
  closeButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(161, 206, 220, 0.1)',
  },
  eventItem: {
    width: '100%',
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(161, 206, 220, 0.1)',
    marginVertical: 5,
  },
  checkInItem: {
    width: '100%',
    marginVertical: 10,
    alignItems: 'center',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  toggleContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 5,
  },
  toggleButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(0,0,0,0.1)',
    width: 80,
    alignItems: 'center',
  },
  toggleActive: {
    backgroundColor: 'rgba(161, 206, 220, 0.5)',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
    gap: 10,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(0,0,0,0.1)',
    flex: 1,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: 'rgba(161, 206, 220, 0.5)',
  },
  deleteButton: {
    backgroundColor: 'rgba(255, 82, 82, 0.5)',
  },
  visitsSection: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 10,
  },
  visitsScrollView: {
    marginTop: 10,
  },
  sectionTitle: {
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  visitCard: {
    backgroundColor: 'rgba(161, 206, 220, 0.1)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    marginHorizontal: 10,
  },
  visitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  visitTime: {
    color: '#A1CEDC',
  },
  visitTitle: {
    marginBottom: 5,
  },
  visitDescription: {
    fontSize: 14,
    opacity: 0.8,
  },
}); 