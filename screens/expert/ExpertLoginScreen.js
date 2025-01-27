import React from 'react';
import { View, TextInput, Button, StyleSheet, TouchableOpacity, Text } from 'react-native';

const LoginScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>

      <Text style={styles.title}>LogIn to Your Account</Text>
      <Text style={styles.signInText4}>Enter your credentials below or LogIn with your Google account</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput placeholder="example@gmail.com" style={styles.input} />

      <Text style={styles.label}>Password</Text>
      <TextInput placeholder="**********" style={styles.input} secureTextEntry />

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ExpertHome')}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      <Text style={styles.signInText3}>or login with</Text>

      <TouchableOpacity style={styles.googleButton}>
        <Text style={styles.googleButtonText}>Login In with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('ExpertSignUp')}>
       <Text style={styles.signInText}>Don't have an account ? 
        <Text style={styles.signInText2}>  Sign Up</Text>
       </Text>      
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    marginBottom:-15,
    textAlign: 'center',
    color: '#1D3557',
    fontWeight:'900'
  },
  label: {
    fontSize: 15,
    marginBottom: 2,
    marginLeft: 5,
    fontWeight: 'bold'
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#1D3557',
    padding: 15,
    borderRadius: 30,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900'
  },
  googleButton: {
    backgroundColor: '#ffff',
    borderColor: '#ccc',
    borderWidth: 3,
    padding: 15,
    borderRadius: 30,
    marginBottom: 10,
    alignItems: 'center',
  },
  googleButtonText: {
    color: '#1D3557',
    fontWeight: 'bold',
    fontSize: 16,
  },
  signInText: {
    marginTop: 20,
    color: '#000',
    textAlign: 'center',
    fontWeight:'bold'
  },
  signInText2: {
    color: 'grey',
    paddingLeft: 100
  },
  signInText3: {
    color: 'grey',
    fontWeight:'bold',
    paddingStart: 150,
    paddingVertical: 10
  },
  signInText4: {
    color: 'grey',
    fontWeight:'bold',
    paddingStart: 0,
    textAlign: 'center',
    paddingVertical: 30
  }
});

export default LoginScreen;
