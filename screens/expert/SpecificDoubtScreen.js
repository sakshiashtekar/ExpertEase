import React from 'react';         
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const SpecificDoubtScreen = ({ route, navigation }) => {
  const { doubt } = route.params;

  const handleScheduleMeet = () => {
    // Code to schedule a meeting (e.g., navigate to a scheduling screen or open a modal)
    console.log('Meeting scheduled for:', doubt.title);
  };

  const handleGoBack = () => {
    navigation.goBack();
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
      <Text style={styles.Text}>Timeslot:</Text>
      <Text style={styles.detail}>{doubt.timeslot}</Text>
      <Text style={styles.Text}>Charges:</Text>
      <Text style={styles.detail}>{doubt.charges}</Text>
      <Text style={styles.Text}>Description of the doubt: </Text>
      <Text style={styles.detail}>{doubt.description || 'No description available.'}</Text>

      <TouchableOpacity style={styles.button} onPress={handleScheduleMeet}>
        <Image
          source={require('../../assets/google_logo.png')} 
          style={styles.logo}
        />
        <Text style={styles.buttonText}>Schedule a Meet</Text>
      </TouchableOpacity>
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
    fontSize: 25,  
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
  description: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
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
});

export default SpecificDoubtScreen;
