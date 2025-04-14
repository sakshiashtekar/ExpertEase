import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import { auth0Domain, auth0ClientId } from '../../authService';

// Define the redirect URI with proper configuration
const redirectUri = AuthSession.makeRedirectUri({
  useProxy: true,
});
// Add this right after you define the redirectUri
console.log("REDIRECT URI:", redirectUri);

const StudentLoginScreen = ({ navigation }) => {
  // State for form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Setup Auth0 discovery
  const discovery = {
    authorizationEndpoint: `https://${auth0Domain}/authorize`,
    tokenEndpoint: `https://${auth0Domain}/oauth/token`,
    revocationEndpoint: `https://${auth0Domain}/oauth/revoke`,
  };

  // Setup Auth0 request with minimal configuration
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: auth0ClientId,
      redirectUri,
      responseType: 'code',
      scopes: ['openid', 'profile', 'email'],
      // Simplified configuration
      extraParams: {
        connection: 'google-oauth2',
      },
    },
    discovery
  );

  // Handle Auth0 response with improved logging
  useEffect(() => {
    if (response) {
      console.log("Auth response type:", response.type);
      console.log("Auth response params:", response.params);
      
      if (response.type === 'success') {
        const { code } = response.params;
        console.log("Authorization Code:", code);
        
        setIsLoading(false);
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
                  routes: [{ name: 'StudentDrawer' }],
                });
              }
            }
          ]
        );
      } else if (response.type === 'error') {
        setIsLoading(false);
        console.error("Auth error details:", {
          error: response.error,
          errorDescription: response.params?.error_description,
          errorUri: response.params?.error_uri
        });
        
        Alert.alert(
          "Authentication Error", 
          response.params?.error_description || 
          "Failed to authenticate with Google. Please try again later."
        );
      } else {
        setIsLoading(false);
        console.log("Auth response not handled:", response.type);
      }
    }
  }, [response, navigation]);

  // Handle Google sign-in with better error handling
  const handleGoogleLogin = async () => {
    console.log("Starting Google Sign-In process");
    
    if (!request) {
      console.error("Auth request is not ready");
      Alert.alert("Error", "Authentication service is not ready. Please try again later.");
      return;
    }
    
    console.log("Auth request configuration:", {
      url: request.url,
      codeChallenge: request.codeChallenge ? '[present]' : '[not present]',
      state: request.state ? '[present]' : '[not present]',
    });
    
    setIsLoading(true);
    
    try {
      const result = await promptAsync({ useProxy: true });
      console.log("promptAsync completed with result type:", result.type);
      
      // Note: We don't need to handle success here as it's handled in the useEffect
      if (result.type !== 'success') {
        setIsLoading(false);
        console.log("promptAsync did not succeed:", result);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Google login error:", error);
      console.error("Error stack:", error.stack);
      Alert.alert("Error", `Authentication failed: ${error.message}`);
    }
  };

  // Handle email/password login
  const handleLogin = () => {
    // Validate inputs
    if (!email || !password) {
      return Alert.alert("Error", "Please enter both email and password");
    }
    
    setIsLoading(true);
    
    // Simulate authentication process
    setTimeout(() => {
      setIsLoading(false);
      
      // Here you would typically call your Auth0 login endpoint
      // For now, simulate a successful login
      Alert.alert(
        "Login Successful", 
        "You've successfully logged in!",
        [
          {
            text: "OK",
            onPress: () => {
              // Navigate to ExpertDrawer which contains ExpertHome
              navigation.reset({
                index: 0,
                routes: [{ name: 'StudentDrawer' }],
              });
            }
          }
        ]
      );
    }, 1000);
  };

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#1D3557" />
        </View>
      )}
      
      <Text style={styles.title}>Login to Your Account</Text>
      <Text style={styles.signInText4}>Enter your credentials below or Login with your Google account</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput 
        placeholder="example@gmail.com" 
        style={styles.input} 
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!isLoading}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput 
        placeholder="**********" 
        style={styles.input} 
        secureTextEntry 
        value={password}
        onChangeText={setPassword}
        editable={!isLoading}
      />

      <TouchableOpacity 
        style={[styles.button, isLoading && styles.disabledButton]} 
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <Text style={styles.signInText3}>or login with</Text>

      <TouchableOpacity 
        style={[styles.googleButton, isLoading && styles.disabledButton]} 
        onPress={handleGoogleLogin}
        disabled={isLoading}
      >
        <Image
          source={require('../../assets/google_logo.png')}
          style={styles.googleLogo}
        />
        <Text style={styles.googleButtonText}>Login with Google</Text>    
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => navigation.navigate('StudentSignup')}
        disabled={isLoading}
      >
        <Text style={styles.signInText}>
          Don't have an account?
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
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
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
  disabledButton: {
    opacity: 0.7,
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
    fontWeight: 'bold',
    fontSize: 16,
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

export default StudentLoginScreen;