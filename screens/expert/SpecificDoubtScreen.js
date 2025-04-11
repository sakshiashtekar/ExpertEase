import React, { useState } from 'react';  
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const SpecificDoubtScreen = ({ route, navigation }) => {
  const { doubt } = route.params;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCharge, setSelectedCharge] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [customCharge, setCustomCharge] = useState('');

  const handleScheduleMeet = () => {
    console.log('Meeting scheduled for:', doubt.title);
    console.log('Charge:', selectedCharge || customCharge);
    console.log('Time:', selectedTime);
    setIsModalVisible(false); 
  };

  const handleGoBack = () => {
    navigation.navigate('ExpertDrawer', { screen: 'ExpertHome' });
  };  
  
  const handleChargeChange = (itemValue) => {
    setSelectedCharge(itemValue);
    setCustomCharge(''); 
  };

  const handleTimeChange = (itemValue) => {
    setSelectedTime(itemValue);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Specific doubt</Text>
      <Text style={styles.Text}>Title:</Text>
      <Text style={styles.detail}>{doubt.title}</Text>
      <Text style={styles.Text}>Domain:</Text>
      <Text style={styles.detail}>{doubt.domain}</Text>
      <Text style={styles.Text}>Description of the doubt: </Text>
      <Text style={styles.detail}>{doubt.description || 'No description available.'}</Text>
      <Text style={styles.Text}>Doubt Photo:</Text>
      <Text style={styles.detail}>{doubt.doubt_photo}</Text>
      <Text style={styles.Text}>Email:</Text>
      <Text style={styles.detail}>{doubt.posted_by}</Text>
      <Text style={styles.Text}>Instruction:</Text>
      <Text style = {styles.detail}>While scheduling the meeting, please use the following format for the Meeting Title: Doubt Title - Expert Name</Text>
      <TouchableOpacity style={styles.button} onPress={() => setIsModalVisible(true)}>
        <Image source={require('../../assets/google_logo.png')} style={styles.logo} />
        <Text style={styles.buttonText}>Schedule a Meet</Text>
      </TouchableOpacity>

      {/* Modal for selecting charge */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Charges</Text>

            {/* Charge Picker */}
            <Picker
              selectedValue={selectedCharge}
              onValueChange={handleChargeChange}
              style={styles.picker}
            >
              <Picker.Item label="Select a Charge" value="" />
              <Picker.Item label="50" value="50" />
              <Picker.Item label="75" value="75" />
              <Picker.Item label="100" value="100" />
            </Picker>

            {/* Time Picker */}
            <Picker
              selectedValue={selectedTime}
              onValueChange={handleTimeChange}
              style={styles.picker}
            >
              <Picker.Item label="Select a Time" value="" />
              <Picker.Item label="5pm" value="5pm" />
              <Picker.Item label="7pm" value="7pm" />
              <Picker.Item label="10pm" value="10pm" />
            </Picker>

            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleScheduleMeet}
                disabled={!selectedCharge && !customCharge || !selectedTime}
              >
                <View style={styles.modalButtonRowInner}>
                  <Image source={require('../../assets/google_logo.png')} style={styles.logo} />
                  <Text style={styles.modalButtonText}>Schedule</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setIsModalVisible(false)}
              >
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
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    marginTop: 25,
    marginLeft: 10,
    borderRadius: 10,
  },
  backButtonText: {
    fontSize: 45,
    color: '#000',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1D3557',
    marginTop: 10,
  },
  Text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#457B9D',
    marginBottom: 5,
    marginLeft: 20,
  },
  detail: {
    fontSize: 18,
    marginBottom: 20,
    marginLeft: 20,
  },
  button: {
    flexDirection: 'row',
    paddingVertical: 10,
    marginTop: 20,
    backgroundColor: '#1D3557',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 50,
    marginRight: 50,
  },
  logo: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
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
    marginBottom: 15,
  },
  picker: {
    width: '100%',
    height: 60,
    marginBottom: 15,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 10,
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
    fontWeight: 'bold',
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  modalButtonRowInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SpecificDoubtScreen;
