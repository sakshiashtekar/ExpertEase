"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, Pressable, ActivityIndicator } from "react-native"
import { RadioButton } from "react-native-paper"
import { useAuth } from "../authContext"

const WelcomeScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  const { isAuthenticated, isLoading, userRole } = useAuth()

  // Check if user is already authenticated
  useEffect(() => {
    if (isAuthenticated && userRole) {
      // Navigate based on user role
      if (userRole === "student") {
        navigation.reset({
          index: 0,
          routes: [{ name: "StudentDrawer" }],
        })
      } else if (userRole === "expert") {
        navigation.reset({
          index: 0,
          routes: [{ name: "ExpertDrawer" }],
        })
      }
    }
  }, [isAuthenticated, userRole, navigation])

  const handleNavigation = () => {
    if (selectedOption === "Student") {
      navigation.navigate("StudentSignUp")
    } else if (selectedOption === "Expert") {
      navigation.navigate("ExpertSignUp")
    }
    setModalVisible(false)
  }


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <Image source={require("../assets/expertease_logo.png")} style={styles.image} />

      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Let's go</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Student or Expert?</Text>
            <RadioButton.Group onValueChange={(value) => setSelectedOption(value)} value={selectedOption}>
              <View style={styles.radioOption}>
                <RadioButton value="Student" color="#1D3557" />
                <Text style={styles.radioText}>Student</Text>
              </View>
              <View style={styles.radioOption}>
                <RadioButton value="Expert" color="#1D3557" />
                <Text style={styles.radioText}>Expert</Text>
              </View>
            </RadioButton.Group>
            <View style={styles.modalButtons}>
              <Pressable style={styles.modalButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.modalButton} onPress={handleNavigation}>
                <Text style={styles.modalButtonText}>Continue</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#1D3557",
  },
  title: {
    fontSize: 35,
    fontWeight: "700",
    color: "#1D3557",
  },
  button: {
    backgroundColor: "#1D3557",
    paddingHorizontal: 70,
    paddingVertical: 15,
    borderRadius: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "900",
  },
  image: {
    width: 400,
    height: 390,
    resizeMode: "contain",
    marginBottom: 50,
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#A8DADC",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1D3557",
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  radioText: {
    fontSize: 16,
    color: "#1D3557",
  },
  modalButtons: {
    flexDirection: "row",
    marginTop: 20,
  },
  modalButton: {
    backgroundColor: "#1D3557",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default WelcomeScreen
