import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image, Modal, TextInput, Platform, BackHandler
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import * as MailComposer from 'expo-mail-composer';

const SpecificDoubtScreen = ({ route }) => {
  const { doubt } = route.params;
  const navigation = useNavigation();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedCharge, setSelectedCharge] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [customCharge, setCustomCharge] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('ExpertDrawer', { screen: 'ExpertHome' });
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );

  const handleScheduleMeet = () => {
    console.log('Meeting scheduled for:', doubt.title);
    console.log('Charge:', selectedCharge || customCharge);
    console.log('Time:', selectedTime);
    setIsModalVisible(false);

    // Trigger email after 3 seconds
    setTimeout(() => {
      MailComposer.composeAsync({
        recipients: ['sakshiashtekar245@gmail.com'],
        subject: `Reminder: ${doubt.title}`,
        body: `This is a reminder for your meeting.\n\nTitle: ${doubt.title}\nCharge: ₹${selectedCharge || customCharge}\nTime: ${selectedTime}`,
      });
      console.log("Email composer triggered after 3 seconds");
    }, 3000);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date();
    setShowDatePicker(Platform.OS === 'ios');
    const formattedDate = currentDate.toISOString().split('T')[0];
    setMeetingDate(formattedDate);
  };

  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || new Date();
    setShowTimePicker(Platform.OS === 'ios');
    const hours = currentTime.getHours().toString().padStart(2, '0');
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');
    setMeetingTime(`${hours}:${minutes}`);
  };

  const handleOpenCalendar = () => {
    if (!meetingTitle || !meetingDate || !meetingTime) {
      alert('Please fill in all fields');
      return;
    }

    const formattedDate = meetingDate.replace(/-/g, '');
    const formattedTime = meetingTime.replace(/:/g, '');
    const startDateTime = `${formattedDate}T${formattedTime}00`;
    const endDateTime = `${formattedDate}T${formattedTime}00`;
    const timezone = "Asia/Kolkata";
    const guests = "someone@example.com,another@example.com";

    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(meetingTitle)}&dates=${startDateTime}/${endDateTime}&ctz=${timezone}&add=${guests}`;

    Linking.openURL(calendarUrl);
    console.log('Calendar URL:', calendarUrl);
    setIsModalVisible(false);
  };

  const handleGoBack = () => {
    navigation.navigate('ExpertDrawer', { screen: 'ExpertHome' });
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Specific doubt</Text>
      <Text style={styles.Text}>Title:</Text>
      <Text style={styles.detail}>{doubt.title}</Text>
      <Text style={styles.Text}>Domain:</Text>
      <Text style={styles.detail}>{doubt.domain}</Text>
      <Text style={styles.Text}>Description of the doubt:</Text>
      <Text style={styles.detail}>{doubt.description || 'No description available.'}</Text>
      <Text style={styles.Text}>Doubt Photo:</Text>
      <Text style={styles.detail}>{doubt.doubt_photo}</Text>
      <Text style={styles.Text}>Email:</Text>
      <Text style={styles.detail}>{doubt.email}</Text>
      <Text style={styles.Text}>Instruction:</Text>
      <Text style={styles.detail}>While scheduling the meeting, please use the following format for the Meeting Title: Doubt Title - Expert Name</Text>

      <TouchableOpacity style={styles.button} onPress={() => setIsModalVisible(true)}>
        <Image source={require('../../assets/google_logo.png')} style={styles.logo} />
        <Text style={styles.buttonText}>Schedule a Meet</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Meeting Details</Text>

            <TextInput
              placeholder="Meeting Title"
              style={styles.dateInput}
              value={meetingTitle}
              onChangeText={setMeetingTitle}
            />

            <View style={styles.dateInputContainer}>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowDatePicker(true)}
              >
                <TextInput
                  placeholder="Date (YYYY-MM-DD)"
                  value={meetingDate}
                  editable={false}
                />
                <Ionicons name="calendar" size={24} color="#457B9D" style={styles.calendarIcon} />
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={meetingDate ? new Date(meetingDate) : new Date()}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                />
              )}
            </View>

            <View style={styles.dateInputContainer}>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowTimePicker(true)}
              >
                <TextInput
                  placeholder="Time (HH:MM)"
                  value={meetingTime}
                  editable={false}
                />
                <Ionicons name="time" size={24} color="#457B9D" style={styles.calendarIcon} />
              </TouchableOpacity>

              {showTimePicker && (
                <DateTimePicker
                  value={new Date()}
                  mode="time"
                  display="default"
                  onChange={onTimeChange}
                />
              )}
            </View>

            <View style={styles.modalButtonRow}>
              <TouchableOpacity style={styles.modalButton} onPress={handleOpenCalendar}>
                <View style={styles.modalButtonRowInner}>
                  <Image source={require('../../assets/google_logo.png')} style={styles.logo} />
                  <Text style={styles.modalButtonText}>Schedule</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.modalButton} onPress={() => setIsModalVisible(false)}>
                <Text style={styles.modalButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  dateInputContainer: { 
    width: '100%' 
  },
  dateInput: {
    height: 50,
    borderColor: "#F1FAEE",
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
    borderRadius: 10,
    backgroundColor: "#F1FAEE",
    width: '100%',
  },
  calendarIcon: { 
    position: 'absolute', 
    right: 12, 
    top: 10 
  },
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: '#FFFFFF' 
  },
  backButton: { 
    marginTop: 15, 
    marginLeft: 10, 
    borderRadius: 10 
  },
  backButtonText: { 
    fontSize: 45, 
    color: '#000', 
    fontWeight: 'bold' 
  },
  title: { 
    fontSize: 25, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    textAlign: 'center', 
    color: '#1D3557', 
    marginTop: 10 
  },
  Text: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#457B9D', 
    marginBottom: 5, 
    marginLeft: 20 
  },
  detail: { 
    fontSize: 18, 
    marginBottom: 20, 
    marginLeft: 20 
  },
  button: {
    flexDirection: 'row',
    paddingVertical: 10,
    marginTop: 40,
    backgroundColor: '#1D3557',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 50,
  },
  logo: { 
    width: 20, 
    height: 20, 
    marginRight: 10 
  },
  buttonText: { 
    color: 'white', 
    fontSize: 18, 
    fontWeight: 'bold'
  },
  modalContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#fff' 
  },
  modalContent: {
    backgroundColor: '#A8DADC',
    padding: 20,
    borderRadius: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 15 
  },
  modalButton: {
    backgroundColor: '#1D3557',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginBottom: 15,
    marginRight: 5,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonText: { 
    color: 'white', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  modalButtonRow: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    width: '100%' 
  },
  modalButtonRowInner: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
});

export default SpecificDoubtScreen;
