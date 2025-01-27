import React from 'react';
import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

const SignupScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>

      <Text style={styles.title}>Create Account</Text>

      <Text style={styles.signInText4}>
      Fill your information below or SignIn with your Google account
      </Text>
      
      <Text style={styles.label}>Email</Text>
      <TextInput placeholder="example@gmail.com" style={styles.input} />

      <Text style={styles.label}>Password</Text>
      <TextInput placeholder="**********" style={styles.input} secureTextEntry />

      <Text style={styles.label}>Confirm Password</Text>
      <TextInput placeholder="**********" style={styles.input} secureTextEntry />
      
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ExpertLogin')}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <Text style={styles.signInText3}>or sign up with</Text>

      <TouchableOpacity style={styles.googleButton}>
      <Image 
          source={require('../../assets/google.png')} 
          style={styles.googleLogo}
      />
      <Text style={styles.googleButtonText}>Sign up with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('ExpertLogin')}>
        <Text style={styles.signInText}>Already have an account ? 
        <Text style={styles.signInText2}>  Log In</Text>
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
    borderColor: '#F1FAEE',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
    borderRadius: 10,
    backgroundColor: '#F1FAEE'
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
    flexDirection: 'row',
    justifyContent: 'center',
  },
  googleLogo: {
    width: 24, 
    height: 24,
    marginRight: 10, 
  },
  googleButtonText: {
    color: '#1D3557',
    fontSize: 16,
    fontWeight:'bold'
  },
  signInText: {
    marginTop: 20,
    color: '#000',
    textAlign: 'center',
    fontWeight:'bold'
  },
  signInText2: {
    color: '#457B9D',
    paddingLeft: 100
  },
  signInText3: {
    color: '#457B9D',
    fontWeight:'bold',
    paddingStart: 150,
    paddingVertical: 10
  },
  signInText4: {
    color: '#457B9D',
    fontWeight:'bold',
    paddingStart: 0,
    textAlign: 'center',
    paddingVertical: 30
  }
});

export default SignupScreen;
