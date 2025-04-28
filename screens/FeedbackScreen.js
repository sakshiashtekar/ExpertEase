import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native'; // Import navigation hook
import { supabase } from '../screens/supabase'; // Ensure this path is correct for your project

const FeedbackForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0); // Default 0 stars selected
  const navigation = useNavigation(); // Use navigation hook

  const handleSubmit = async () => {
    if (!name || !email || !feedback || rating === 0) {
      Alert.alert('Please complete all fields and select a star rating.');
      return;
    }

    const { data, error } = await supabase.from('feedback').insert([
      {
        user_name: name,
        email: email,
        feedback_description: feedback,
        rating: parseInt(rating),
      },
    ]);

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


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Feedback Form</Text>

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
  heading: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 40,
    textAlign: 'center',
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
    fontWeight: "900",
    textAlign: 'center',
  },
});
