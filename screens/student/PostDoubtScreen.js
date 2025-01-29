import React, { useState, useEffect } from 'react'; 
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';

const PostDoubtScreen = () => {
  const navigation = useNavigation();
  const [image, setImage] = useState(null);

  // Request media library permission
  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to make this work!');
      }
    };

    requestPermissions();
  }, []);

  // Function to pick an image from the gallery
  const pickImage = async () => {
    try {
      console.log('Opening image picker...');  // Debugging: Log when the picker is triggered

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,  // Correct way to specify media type
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      console.log('Image picker result: ', result);  // Debugging: Log the result after picking

      if (!result.canceled) {
        setImage(result.assets[0].uri);  // Update state with selected image URI
      } else {
        console.log('No image selected');  // Debugging: Log if no image was selected
      }
    } catch (error) {
      console.error('Error picking image:', error);  // Debugging: Log errors if any
    }
  };

  const handleGoBack = () => {
    navigation.navigate('StudentDrawer', { screen: 'StudentHome' });
  };  
  

  return (
    <View style={styles.container}>
     <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Post Doubt</Text>

      <TextInput style={styles.input} placeholder="Doubt Title" placeholderTextColor="#7E7E7E" />

      <TextInput
        style={[styles.input, styles.descriptionInput]}
        placeholder="Doubt Description"
        placeholderTextColor="#7E7E7E"
        multiline
      />

      <TouchableOpacity style={styles.imageUpload} onPress={pickImage}>
        <Icon name="image" size={24} color="#457B9D" />
        <Text style={styles.imageText}>Upload Doubt Photo (if any)</Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image }} style={styles.uploadedImage} />}

      <TouchableOpacity style={styles.postButton}>
        <Text style={styles.postButtonText}>Post Doubt</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  backButton: {
    marginTop: 25,
    marginLeft: -340,
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
    marginTop: 20,
    color: '#1D3557',
  },
  input: {
    width: '90%',
    height: 50,
    backgroundColor: '#F1FAEE',
    borderRadius: 20,
    paddingHorizontal: 20,
    marginBottom: 15,
    fontSize: 16,
  },
  descriptionInput: {
    height: 200,
    textAlignVertical: 'top',
  },
  imageUpload: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    padding: 10,
    marginBottom: 10,
  },
  imageText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#457B9D',
  },
  uploadedImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  postButton: {
    width: '90%',
    backgroundColor: '#1D3557',
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
  },
  postButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PostDoubtScreen;
