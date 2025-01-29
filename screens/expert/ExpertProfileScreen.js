import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

const ExpertProfileScreen = ({ navigation }) => {
  // State to store user details
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState('Sakshi'); // Replace with actual data from signup
  const [email, setEmail] = useState('sakshi@example.com'); // Replace with actual data from signup
  const [companyname, setCompany] = useState('');
  const [designation, setDesignation] = useState('');
  const [domain, setDomain] = useState('');
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('');

  // Function to select an image
  const selectImage = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        setProfileImage(response.assets[0].uri);
      }
    });
  };

  // Function to save details
  const saveProfile = () => {
    Alert.alert('Profile Updated', 'Your details have been saved successfully.');
    console.log({
      name,
      email,
      university,
      designation,
      domain,
      skills,
      profileImage,
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Expert Profile</Text>

      <TouchableOpacity style={styles.profileImageContainer} onPress={selectImage}>
        <Image
          source={profileImage ? { uri: profileImage } : require('../../assets/profile_logo.png')}
          style={styles.profileImage}
        />
        <Text style={styles.uploadText}>Tap to Upload</Text>
      </TouchableOpacity>

      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Name" placeholderTextColor="#6B7280" />
      <TextInput style={styles.input} value={email} editable={false} placeholder="Email/Username" placeholderTextColor="#6B7280" />

      <TextInput style={styles.input} value={companyname} onChangeText={setCompany} placeholder="Company Name" placeholderTextColor="#6B7280" />
      <TextInput style={styles.input} value={designation} onChangeText={setDesignation} placeholder="Designation" placeholderTextColor="#6B7280" />
      <TextInput style={styles.input} value={domain} onChangeText={setDomain} placeholder="Domain" placeholderTextColor="#6B7280" />
      <TextInput style={styles.input} value={skills} onChangeText={setSkills} placeholder="Skills" placeholderTextColor="#6B7280" />
      <TextInput style={styles.input} value={experience} onChangeText={setExperience} placeholder="Experience" placeholderTextColor="#6B7280" />

      <TouchableOpacity style={styles.button} onPress={saveProfile}>
        <Text style={styles.buttonText}>Save Details</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    marginTop: 10,
    marginLeft: -340,
    borderRadius: 10,
  },
  backButtonText: {
    fontSize: 25,  
    color: '#000',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    color: '#1D3557',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#1D3557',
  },
  uploadText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 5,
  },
  input: {
    backgroundColor: '#E9F5E1',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
    width: 380
  },
  button: {
    backgroundColor: '#1D3557',
    paddingVertical: 12,
    borderRadius: 50,
    marginTop: 10,
    width: 170,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ExpertProfileScreen;
