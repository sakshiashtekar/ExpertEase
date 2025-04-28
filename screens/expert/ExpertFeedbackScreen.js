import React, { useState, useEffect } from 'react';    
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  BackHandler,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native'; // Import navigation hook
import { supabase } from '../supabase'; // Ensure this path is correct for your project

const FeedbackForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0); // Default 0 stars selected
  const navigation = useNavigation(); // Use navigation hook

  const userType = 'expert'; // Can be 'expert' or 'student'

  const handleSubmit = async () => {
    if (!name || !email || !feedback || rating === 0) {
      Alert.alert('Please complete all fields and select a star rating.');
      return;
    }

    const { data, error } = await supabase.from('feedback').insert([{
      user_name: name,
      email: email,
      feedback_description: feedback,
      rating: parseInt(rating),
    }]);

    console.log("Supabase response:", { data, error }); // <-- ADD THIS

    if (error) {
      console.error('Supabase insert error:', error);
      Alert.alert('Error', 'Failed to submit feedback. Please try again.');
      return;
    }

    Alert.alert(
      'Feedback Submitted',
      'Thank you for your feedback!',
      [
        {
          text: 'OK',
          onPress: () => {
            setName('');
            setEmail('');
            setFeedback('');
            setRating(0);
            navigation.goBack();
          },
        },
      ],
      { cancelable: false }
    );
  };

  // Handle back navigation on device back button
  const handleBackButtonPress = () => {
    // Navigate to StudentHome if userType is 'student'
    if (userType === 'expert') {
      navigation.navigate('ExpertDrawer', {
        screen: 'ExpertHome', // Assuming the home screen is named 'ExpertHome' in the ExpertDrawer
      });
    }
    return true; // Prevent default back action (e.g., exiting app)
  };

  useEffect(() => {
    // Listen for the hardware back button press
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButtonPress);

    // Clean up the event listener when the component is unmounted
    return () => {
      backHandler.remove();
    };
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back Button in Top Left Corner */}
      <TouchableOpacity style={styles.backButton} onPress={handleBackButtonPress}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>
      <View style={styles.header}>
        <Text style={styles.heading}>Feedback Form</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Your Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Your Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Your Feedback"
        value={feedback}
        onChangeText={setFeedback}
        multiline={true}
        numberOfLines={4}
      />

      <Text style={styles.label}>Rate Us:</Text>
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <Ionicons
              name={star <= rating ? 'star' : 'star-outline'}
              size={36}
              color="#FFD700"
              style={styles.starIcon}
            />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Feedback</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default FeedbackForm;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',  // Ensures the button stays fixed in the top-left corner
    top: 40,               // Adjust the distance from the top of the screen
    left: 20,              // Adjust the distance from the left of the screen
    zIndex: 10,            // Make sure the button is above other elements
  },
  backButtonText: {
    fontSize: 45,
    color: '#000',
    fontWeight: 'bold',
  },
  heading: {
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 40,
    textAlign: 'center',
    color: '#1D3557',
    marginLeft: 80,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  label: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  starIcon: {
    marginHorizontal: 5,
  },
  button: {
    backgroundColor: "#1D3557",
    paddingHorizontal: 70,
    paddingVertical: 10,
    borderRadius: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
});
