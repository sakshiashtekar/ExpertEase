"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert, ScrollView } from "react-native"
import { useNavigation } from "@react-navigation/native"
import Icon from "react-native-vector-icons/FontAwesome"
import * as ImagePicker from "expo-image-picker"

const PostDoubtScreen = () => {
  const navigation = useNavigation()
  const [image, setImage] = useState(null)
  const [email, setEmail] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isFormValid, setIsFormValid] = useState(false)

  // Validate form
  useEffect(() => {
    setIsFormValid(email.trim() !== "" && title.trim() !== "" && description.trim() !== "")
  }, [email, title, description])

  // Request media library permission
  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== "granted") {
        Alert.alert("Permission Required", "Sorry, we need camera roll permissions to make this work!")
      }
    }

    requestPermissions()
  }, [])

  // Function to pick an image from the gallery
  const pickImage = async () => {
    try {
      console.log("Opening image picker...")

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      })

      console.log("Image picker result: ", result)

      if (!result.canceled) {
        setImage(result.assets[0].uri)
      } else {
        console.log("No image selected")
      }
    } catch (error) {
      console.error("Error picking image:", error)
    }
  }

  const handleGoBack = () => {
    navigation.navigate("StudentDrawer", { screen: "StudentHome" })
  }

  const handlePostDoubt = () => {
    if (!isFormValid) {
      Alert.alert("Missing Information", "Please fill in all required fields")
      return
    }

    // Create doubt object to pass to payment screen
    const doubtData = {
      email,
      title,
      description,
      image,
      timestamp: new Date().toISOString(),
    }

    // Navigate to payment screen with doubt data
    navigation.navigate("PaymentScreen", { doubtData })
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Post Doubt</Text>

        <TextInput
          placeholder="Enter your email id"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Doubt Title"
          placeholderTextColor="#7E7E7E"
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={[styles.input, styles.descriptionInput]}
          placeholder="Doubt Description"
          placeholderTextColor="#7E7E7E"
          multiline
          value={description}
          onChangeText={setDescription}
        />

        <TouchableOpacity style={styles.imageUpload} onPress={pickImage}>
          <Icon name="image" size={24} color="#457B9D" />
          <Text style={styles.imageText}>Upload Doubt Photo (if any)</Text>
        </TouchableOpacity>

        {image && <Image source={{ uri: image }} style={styles.uploadedImage} />}

        <TouchableOpacity
          style={[styles.postButton, !isFormValid && styles.disabledButton]}
          onPress={handlePostDoubt}
          disabled={!isFormValid}
        >
          <Text style={styles.postButtonText}>Proceed to Payment</Text>
        </TouchableOpacity>

        <Text style={styles.paymentNote}>
          Note: A small fee is required to post your doubt and get expert assistance
        </Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 25,
    left: 16,
    zIndex: 10,
  },
  backButtonText: {
    fontSize: 25,
    color: "#000",
    fontWeight: "bold",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 60,
    color: "#1D3557",
  },
  input: {
    width: "90%",
    height: 50,
    backgroundColor: "#F1FAEE",
    borderRadius: 20,
    paddingHorizontal: 20,
    marginBottom: 15,
    fontSize: 16,
  },
  descriptionInput: {
    height: 200,
    textAlignVertical: "top",
    paddingTop: 15,
  },
  imageUpload: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    padding: 10,
    marginBottom: 10,
  },
  imageText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#457B9D",
  },
  uploadedImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  postButton: {
    width: "90%",
    backgroundColor: "#1D3557",
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: "#A0AEC0",
  },
  postButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  paymentNote: {
    marginTop: 15,
    fontSize: 14,
    color: "#457B9D",
    textAlign: "center",
    paddingHorizontal: 20,
  },
})

export default PostDoubtScreen
