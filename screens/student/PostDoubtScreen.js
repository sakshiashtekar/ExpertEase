import React, { useState, useEffect } from 'react'; 
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../supabase'; // Ensure this path is correct for your project

const PostDoubtScreen = () => {
  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [domain, setDomain] = useState(''); // Added domain field to match database

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
      console.log('Opening image picker...');

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      console.log('Image picker result: ', result);

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      } else {
        console.log('No image selected');
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handleGoBack = () => {
    navigation.navigate('StudentDrawer', { screen: 'StudentHome' });
  };  
  
  // Function to upload image to Supabase Storage
  const uploadImage = async () => {
    if (!image) return null;
    
    try {
      const fileExt = image.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `doubt_images/${fileName}`;
      
      // Convert URI to Blob
      const response = await fetch(image);
      const blob = await response.blob();
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('doubt_images')
        .upload(filePath, blob);
        
      if (error) {
        console.error('Error uploading image:', error);
        return null;
      }
      
      // Get public URL for the uploaded image
      const { data: urlData } = supabase.storage
        .from('doubt_images')
        .getPublicUrl(filePath);
        
      return urlData.publicUrl;
    } catch (error) {
      console.error('Error in image upload process:', error);
      return null;
    }
  };

  // Function to fetch student_id using email
  const getStudentId = async (email) => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('student_id')
        .eq('email', email)
        .single();
        
      if (error) {
        console.error('Error fetching student ID:', error);
        return null;
      }
      
      return data?.student_id;
    } catch (error) {
      console.error('Error in getStudentId function:', error);
      return null;
    }
  };

  // Function to post doubt to Supabase
  const postDoubt = async () => {
    if (!email || !title || !description || !domain) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }
    
    setLoading(true);
    
    try {
      // Get student_id based on email
      const studentId = await getStudentId(email);
      
      if (!studentId) {
        Alert.alert('Error', 'Email not found in our records. Please check your email address.');
        setLoading(false);
        return;
      }
      
      // Upload image if selected
      const imageUrl = image ? await uploadImage() : null;
      
      // Insert doubt into database
      const { data, error } = await supabase
        .from('doubts')
        .insert([
          {
            student_id: studentId,
            title: title,
            description: description,
            domain: domain,
            status: 'pending', // Default status for new doubts
            posted_by: email, // This references email from students table
            created_at: new Date().toISOString(),
            image_url: imageUrl
          }
        ]);
      
      if (error) {
        console.error('Error posting doubt:', error);
        Alert.alert('Error', 'Failed to post doubt. Please try again.');
        setLoading(false);
        return;
      }
      
      Alert.alert('Success', 'Your doubt has been posted successfully!');
      // Reset form
      setEmail('');
      setTitle('');
      setDescription('');
      setDomain('');
      setImage(null);
      
      // Navigate back
      navigation.navigate('StudentDrawer', { screen: 'StudentHome' });
      
    } catch (error) {
      console.error('Error in posting doubt:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
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
      
      {/* Added domain input field */}
      <TextInput 
        style={styles.input} 
        placeholder="Doubt Domain (e.g., Math, Physics)" 
        placeholderTextColor="#7E7E7E" 
        value={domain}
        onChangeText={setDomain}
      />

      <TouchableOpacity style={styles.imageUpload} onPress={pickImage}>
        <Icon name="image" size={24} color="#457B9D" />
        <Text style={styles.imageText}>Upload Doubt Photo (if any)</Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image }} style={styles.uploadedImage} />}

      <TouchableOpacity 
        style={[styles.postButton, loading && styles.disabledButton]} 
        onPress={postDoubt}
        disabled={loading}
      >
        <Text style={styles.postButtonText}>
          {loading ? 'Posting...' : 'Post Doubt'}
        </Text>
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
    fontSize: 45, 
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
    paddingTop: 15,
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
  disabledButton: {
    backgroundColor: '#7E7E7E',
  }
});

export default PostDoubtScreen;