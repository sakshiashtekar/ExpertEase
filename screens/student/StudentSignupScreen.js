"use client"

import { useState, useEffect } from "react"
import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native"
import { useAuthRequest, exchangeCodeForToken, setUserRole, logout } from "../../authService"

const StudentSignupScreen = ({ navigation }) => {
  // State for form fields
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Use our centralized Auth0 request hook
  const [request, response, promptAsync] = useAuthRequest()

  // Handle Auth0 response
  useEffect(() => {
    if (response) {
      console.log("Auth response type:", response.type)

      if (response.type === "success") {
        const { code } = response.params
        handleAuthCode(code)
      } else if (response.type === "error") {
        setIsLoading(false)
        console.error("Auth error:", response.error)

        Alert.alert(
          "Authentication Error",
          response.params?.error_description || "Failed to authenticate with Google. Please try again.",
        )
      } else {
        setIsLoading(false)
      }
    }
  }, [response])

  // Process authorization code
  const handleAuthCode = async (code) => {
    try {
      const result = await exchangeCodeForToken(code, request)

      if (result.success) {
        
        await setUserRole("student")

        setIsLoading(false)
        Alert.alert("Signup Success", "You've successfully signed up with Google", [
          {
            text: "OK",
            onPress: () => {
              
              navigation.reset({
                index: 0,
                routes: [{ name: "StudentDrawer" }],
              })
            },
          },
        ])
      } else {
        setIsLoading(false)
        Alert.alert("Signup Error", result.error)
      }
    } catch (error) {
      setIsLoading(false)
      console.error("Error processing auth code:", error)
      Alert.alert("Authentication Error", "Failed to complete authentication")
    }
  }

  // Handle Google sign-in
  const handleGoogleLogin = async () => {
    console.log("Starting Google Sign-Up process")

    if (!request) {
      console.error("Auth request is not ready")
      Alert.alert("Error", "Authentication service is not ready. Please try again later.")
      return
    }

    setIsLoading(true)

    try {
      // First logout to ensure a clean session
      // await logout()

      // Then prompt for login
      await promptAsync({ useProxy: true })
      // Result will be handled in the useEffect with the response
    } catch (error) {
      setIsLoading(false)
      console.error("Google signup error:", error)
      Alert.alert("Error", `Authentication failed: ${error.message}`)
    }
  }

  // Handle email/password sign-up
  const handleSignUp = () => {
    // Validate inputs
    if (!email || !password || !confirmPassword) {
      return Alert.alert("Error", "Please fill in all fields")
    }

    if (password !== confirmPassword) {
      return Alert.alert("Error", "Passwords do not match")
    }

    // Here you would typically call your Auth0 signup endpoint
    // For now, simulate a successful signup
    Alert.alert("Sign Up", "Account created successfully!", [
      {
        text: "OK",
        onPress: () => {
          
          navigation.reset({
            index: 0,
            routes: [{ name: "StudentDrawer" }],
          })
        },
      },
    ])
  }

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#1D3557" />
        </View>
      )}

      <Text style={styles.title}>Create Account</Text>

      <Text style={styles.signInText4}>Fill your information below or SignIn with your Google account</Text>

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

      <Text style={styles.label}>Confirm Password</Text>
      <TextInput
        placeholder="**********"
        style={styles.input}
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        editable={!isLoading}
      />

      <TouchableOpacity
        style={[styles.button, isLoading && styles.disabledButton]}
        onPress={handleSignUp}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <Text style={styles.signInText3}>or sign up with</Text>

      <TouchableOpacity
        style={[styles.googleButton, isLoading && styles.disabledButton]}
        onPress={handleGoogleLogin}
        disabled={isLoading}
      >
        <Image source={require("../../assets/google_logo.png")} style={styles.googleLogo} />
        <Text style={styles.googleButtonText}>Sign up with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("StudentLogin")} disabled={isLoading}>
        <Text style={styles.signInText}>
          Already have an account?
          <Text style={styles.signInText2}> Log In</Text>
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  title: {
    fontSize: 30,
    marginBottom: -15,
    textAlign: "center",
    color: "#1D3557",
    fontWeight: "900",
  },
  label: {
    fontSize: 15,
    marginBottom: 2,
    marginLeft: 5,
    fontWeight: "bold",
  },
  input: {
    height: 50,
    borderColor: "#F1FAEE",
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
    borderRadius: 10,
    backgroundColor: "#F1FAEE",
  },
  button: {
    backgroundColor: "#1D3557",
    padding: 15,
    borderRadius: 30,
    marginBottom: 10,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900",
  },
  googleButton: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 3,
    padding: 15,
    borderRadius: 30,
    marginBottom: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  googleLogo: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  googleButtonText: {
    color: "#1D3557",
    fontSize: 16,
    fontWeight: "bold",
  },
  signInText: {
    marginTop: 20,
    color: "#000",
    textAlign: "center",
    fontWeight: "bold",
  },
  signInText2: {
    color: "#457B9D",
    paddingLeft: 100,
  },
  signInText3: {
    color: "#457B9D",
    fontWeight: "bold",
    paddingStart: 150,
    paddingVertical: 10,
  },
  signInText4: {
    color: "#457B9D",
    fontWeight: "bold",
    paddingStart: 0,
    textAlign: "center",
    paddingVertical: 30,
  },
});

export default StudentSignupScreen;
