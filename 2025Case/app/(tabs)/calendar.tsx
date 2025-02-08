import { StyleSheet, Modal, View, ScrollView, TextInput, Pressable, ViewStyle } from 'react-native';
import { Calendar } from 'react-native-calendars';
import type { DateData } from 'react-native-calendars';
import { useState } from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';

interface Event {
  title: string;
  description: string;
  date: string;
}

interface HealthCheckIn {
  mood: number;
  medication: boolean;
  date: string;
  symptoms: {
    fatigue: boolean;
    fever: boolean;
    nausea: boolean;
    headache: boolean;
  };
  otherSymptoms?: string;
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
  const [symptoms, setSymptoms] = useState({
    fatigue: false,
    fever: false,
    nausea: false,
    headache: false,
  });
  const [otherSymptoms, setOtherSymptoms] = useState('');
  
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
      medication,
      date: selectedDate,
      symptoms,
      otherSymptoms: otherSymptoms.trim(),
    };
    setHealthCheckIns(prev => {
      const filtered = prev.filter(item => item.date !== selectedDate);
      return [...filtered, checkIn];
    });
    setModalVisible(false);
    // Reset symptoms for next check-in
    setSymptoms({
      fatigue: false,
      fever: false,
      nausea: false,
      headache: false,
    });
    setOtherSymptoms('');
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

  const toggleSymptom = (symptom: keyof typeof symptoms) => {
    setSymptoms(prev => ({
      ...prev,
      [symptom]: !prev[symptom]
    }));
  };

  return (
    <ThemedView style={styles.container}>
      {/* Add Legend */}
      <ThemedView style={styles.legendContainer}>
        <ThemedView style={styles.legendItem}>
          <ThemedView style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} />
          <ThemedText style={styles.legendText}>Daily Medication Taken</ThemedText>
        </ThemedView>
        <ThemedView style={styles.legendItem}>
          <ThemedView style={[styles.legendDot, { backgroundColor: '#FF5252' }]} />
          <ThemedText style={styles.legendText}>Daily Medication Missed</ThemedText>
        </ThemedView>
      </ThemedView>

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
          monthTextColor: '#ffffff',
          textMonthFontSize: 16,
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
                
                <ThemedView style={styles.visitContent}>
                  <ThemedView style={styles.visitInfo}>
                    <ThemedText type="defaultSemiBold" style={styles.visitTitle}>
                      {event.title}
                    </ThemedText>
                    <ThemedText style={styles.visitDescription}>
                      {event.description}
                    </ThemedText>
                  </ThemedView>

                  <Pressable style={styles.calendarButton}>
                    <Ionicons name="calendar-outline" size={24} color="#A1CEDC" />
                    <ThemedText style={styles.calendarButtonText}>
                      Add to Calendar
                    </ThemedText>
                  </Pressable>
                </ThemedView>
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

            <ThemedView style={styles.symptomsContainer}>
              <ThemedText type="defaultSemiBold">Symptoms</ThemedText>
              <ThemedView style={styles.symptomsGrid}>
                {Object.entries(symptoms).map(([key, value]) => (
                  <ThemedView key={key} style={styles.symptomContainer}>
                    <ThemedView 
                      style={[
                        styles.symptomBox, 
                        value && styles.symptomActive
                      ]}
                      onTouchEnd={() => toggleSymptom(key as keyof typeof symptoms)}
                    >
                      <ThemedText>{key.charAt(0).toUpperCase() + key.slice(1)}</ThemedText>
                    </ThemedView>
                  </ThemedView>
                ))}
              </ThemedView>
              
              <ThemedView style={styles.otherSymptomsContainer}>
                <ThemedText>Other Symptoms:</ThemedText>
                <TextInput
                  style={styles.otherSymptomsInput}
                  value={otherSymptoms}
                  onChangeText={setOtherSymptoms}
                  placeholder="Enter any other symptoms..."
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  multiline
                  numberOfLines={2}
                />
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
    paddingTop: 30,
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
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
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
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
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
    backgroundColor: 'rgba(161, 206, 220, 0.05)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 15,
    marginHorizontal: -20,
    paddingBottom: 20,
  },
  visitsScrollView: {
    marginTop: 10,
  },
  sectionTitle: {
    marginBottom: 15,
    paddingHorizontal: 30,
  },
  visitCard: {
    backgroundColor: 'rgba(29, 61, 71, 0.3)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    marginHorizontal: 30,
  },
  visitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    backgroundColor: 'transparent',
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
  textInput: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 5,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  symptomsContainer: {
    width: '100%',
    marginTop: 15,
    gap: 5,
  },
  symptomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    marginTop: 5,
  },
  symptomContainer: {
    width: '45%',
    alignItems: 'center',
  },
  symptomBox: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  symptomActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  otherSymptomsContainer: {
    width: '100%',
    marginTop: 5,
  },
  otherSymptomsInput: {
    width: '100%',
    marginTop: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 8,
    padding: 10,
    color: '#fff',
    minHeight: 60,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 5,
    marginBottom: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  } as ViewStyle,
  legendText: {
    fontSize: 12,
  },
  visitContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
  },
  visitInfo: {
    flex: 1,
    marginRight: 10,
    backgroundColor: 'transparent',
  },
  calendarButton: {
    alignItems: 'center',
    paddingLeft: 10,
    backgroundColor: 'transparent',
  },
  calendarButtonText: {
    fontSize: 10,
    color: '#A1CEDC',
    marginTop: 4,
    textAlign: 'center',
  },
}); 