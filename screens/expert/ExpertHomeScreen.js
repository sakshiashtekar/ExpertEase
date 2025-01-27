import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>

      <Text style={styles.title}>Home</Text>

      <View style={styles.profileContainer}>
        <View style={styles.profileImage}></View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.input}>Name of employee</Text>
          
        <Text style={styles.input}>Company name of employee</Text>

        <TouchableOpacity style={styles.containerButton} onPress={() => navigation.navigate('EmployeeDetails')}>
        <Text style={styles.buttonText}>Edit Details</Text>
      </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AttendanceRecord')}>
        <Text style={styles.buttonText}>Mark your attendance</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('MonthlyAttendance')}>
        <Text style={styles.buttonText}>View Monthly Attendance</Text>
      </TouchableOpacity>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    marginTop: -50,
    marginBottom: 50,
    color: '#22577A',
  },
  profileContainer: {
    width: 150,
    height: 150,
    borderRadius: 150,
    backgroundColor: '#E0F5EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 125,
    height: 125,
    borderRadius: 125,
    backgroundColor: '#D9D9D9',
  },
  inputContainer: {
    width: '80%',
    height: '30%',
    backgroundColor: '#E0F5EB',
    borderRadius: 20,
    padding: 25,
    marginBottom: 25,
  },
  input: {
    height: 45,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 30,
    marginTop: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#22577A',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 30,
    marginTop: 30,
    width: 320,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center'
  },
  containerButton: {
    backgroundColor: '#22577A',
    width: 150,
    marginLeft: 70,
    paddingVertical: 15,
    borderRadius: 30,
    marginBottom: 10,
  }
});

export default HomeScreen;
