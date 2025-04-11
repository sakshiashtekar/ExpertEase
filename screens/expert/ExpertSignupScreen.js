import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import { auth0Domain, auth0ClientId } from '../../authConfig';

// Define the redirect URI with proper configuration
const redirectUri = AuthSession.makeRedirectUri({
  useProxy: true,
});
// Add this right after you define the redirectUri
console.log("REDIRECT URI:", redirectUri);

const ExpertSignupScreen = ({ navigation }) => {
  // State for form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Setup Auth0 discovery
  const discovery = {
    authorizationEndpoint: `https://${auth0Domain}/authorize`,
    tokenEndpoint: `https://${auth0Domain}/oauth/token`,
    revocationEndpoint: `https://${auth0Domain}/oauth/revoke`,
  };

  // Setup Auth0 request
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: auth0ClientId,
      redirectUri,
      responseType: 'code',
      scopes: ['openid', 'profile', 'email'],
      extraParams: {
        audience: `https://${auth0Domain}/userinfo`,
        connection: 'google-oauth2',
      },
    },
    discovery
  );

  // Handle Auth0 response
  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      console.log("Authorization Code:", code);
      
      // Here you would typically exchange the code for tokens
      // and then navigate to the next screen or update user state
      Alert.alert(
        "Login Success", 
        "You've successfully signed in with Google",
        [
          {
            text: "OK",
            onPress: () => {
              // Navigate to ExpertDrawer which contains ExpertHome
              navigation.reset({
                index: 0,
                routes: [{ name: 'ExpertDrawer' }],
              });
            }
          }
        ]
      );
    } else if (response?.type === 'error') {
      Alert.alert(
        "Authentication Error", 
        response.error?.description || "Failed to authenticate with Google"
      );
      console.error("Auth error:", response.error);
    }
  }, [response, navigation]);

  // Handle Google sign-in
  const handleGoogleLogin = async () => {
    console.log("Starting Google Sign-In process");
    try {
      await promptAsync({ useProxy: true });
    } catch (error) {
      console.error("Google login error:", error);
      Alert.alert("Error", "Failed to start the authentication process");
    }
  };

  // Handle email/password sign-up
  const handleSignUp = () => {
    // Validate inputs
    if (!email || !password || !confirmPassword) {
      return Alert.alert("Error", "Please fill in all fields");
    }
    
    if (password !== confirmPassword) {
      return Alert.alert("Error", "Passwords do not match");
    }
    
    // Here you would typically call your Auth0 signup endpoint
    // For now, simulate a successful signup
    Alert.alert(
      "Sign Up", 
      "Account created successfully!",
      [
        {
          text: "OK",
          onPress: () => {
            // Navigate to ExpertDrawer which contains ExpertHome
            navigation.reset({
              index: 0,
              routes: [{ name: 'ExpertDrawer' }],
            });
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <Text style={styles.signInText4}>
        Fill your information below or SignIn with your Google account
      </Text>

      <Text style={styles.label}>Email</Text>
      <TextInput 
        placeholder="example@gmail.com" 
        style={styles.input} 
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput 
        placeholder="**********" 
        style={styles.input} 
        secureTextEntry 
        value={password}
        onChangeText={setPassword}
      />

      <Text style={styles.label}>Confirm Password</Text>
      <TextInput 
        placeholder="**********" 
        style={styles.input} 
        secureTextEntry 
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <Text style={styles.signInText3}>or sign up with</Text>

      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
        <Image
          source={require('../../assets/google_logo.png')}
          style={styles.googleLogo}
        />
        <Text style={styles.googleButtonText}>Sign up with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('ExpertLogin')}>
        <Text style={styles.signInText}>
          Already have an account?
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
    marginBottom: -15,
    textAlign: 'center',
    color: '#1D3557',
    fontWeight: '900'
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
    backgroundColor: '#fff',
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
    fontWeight: 'bold'
  },
  signInText: {
    marginTop: 20,
    color: '#000',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  signInText2: {
    color: '#457B9D',
    paddingLeft: 100
  },
  signInText3: {
    color: '#457B9D',
    fontWeight: 'bold',
    paddingStart: 150,
    paddingVertical: 10
  },
  signInText4: {
    color: '#457B9D',
    fontWeight: 'bold',
    paddingStart: 0,
    textAlign: 'center',
    paddingVertical: 30
  }
});

export default ExpertSignupScreen;