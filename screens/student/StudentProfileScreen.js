import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { supabase } from '../supabase'; // adjust path if needed

const StudentProfileScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('shubham@gmail.com'); // static for now
  const [university, setUniversity] = useState('');
  const [domain, setDomain] = useState(''); 
  const [skills, setSkills] = useState('');
  const [loading, setLoading] = useState(false);
  const [studentId, setStudentId] = useState(null);

  // Fetch student data
  const fetchStudentDetails = async () => {
    setLoading(true);
    try {
      const { data: user, error: userError } = await supabase.auth.getUser();

      if (userError) {
        console.error('Error getting current user:', userError);
        setLoading(false);
        return;
      }

      const userEmail = user?.user?.email;

      if (!userEmail) {
        console.error('User email not found');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('email', userEmail)
        .single();
  // Fetch student data from Supabase
  useEffect(() => {
    const fetchStudent = async () => {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('New user, no profile yet');
          setEmail(userEmail); // Set the email from auth
        } else {
          console.error('Error fetching student details:', error);
        }
      } else if (data) {
        setStudentId(data.student_id);
        setName(data.name || '');
        setEmail(data.email || '');
        setUniversity(data.university_name || '');  // Updated to match DB column name
        setDomain(data.domain || '');
        setSkills(data.skills || '');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

    fetchStudent();
  }, []);

  const saveProfile = async () => {
    setLoading(true);
    try {
      // Validate inputs
      if (!name.trim() || !email.trim()) {
        Alert.alert('Error', 'Name and email are required');
        setLoading(false);
        return;
      }

      const profileData = {
        name,
        email,
        university_name: university,  // Match column name in DB
        domain,
        skills
      };

      let result;
      
      if (studentId) {
        // Update existing record
        result = await supabase
          .from('students')
          .update(profileData)
          .eq('student_id', studentId);
  const selectImage = () => {
    const options = { mediaType: 'photo', quality: 1 };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        // Insert new record
        result = await supabase
          .from('students')
          .insert([profileData]);
      }

      const { error } = result;

      if (error) {
        console.error('Error saving profile:', error);
        Alert.alert('Error', 'Failed to save profile. Please try again.');
      } else {
        Alert.alert('Success', 'Your profile has been saved successfully.');
        // Refresh student details to get the ID if it was a new record
        fetchStudentDetails();
      }
    } catch (error) {
      console.error('Unexpected error during save:', error);
      Alert.alert('Error', 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Student Profile</Text>

      <View style={styles.profileImageContainer}>
        <Image
          source={require('../../assets/profile_logo.png')}
          style={styles.profileImage}
        />
        <Text style={styles.uploadText}>Profile Picture</Text>
      </View>

      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Name" placeholderTextColor="#6B7280" />
      <TextInput style={styles.input} value={email} editable={false} placeholder="Email/Username" placeholderTextColor="#6B7280" />
      
      <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email/Username" placeholderTextColor="#6B7280" />
      <TextInput style={styles.input} value={university} onChangeText={setUniversity} placeholder="University Name" placeholderTextColor="#6B7280" />
      <TextInput style={styles.input} value={domain} onChangeText={setDomain} placeholder="Domain" placeholderTextColor="#6B7280" />
      <TextInput 
        style={[styles.input, styles.multilineInput]} 
        value={skills} 
        onChangeText={setSkills} 
        placeholder="Skills (e.g., Python, Machine Learning, Data Analysis)" 
        placeholderTextColor="#6B7280"
        multiline
      />

      <TouchableOpacity 
        style={[styles.button, loading && styles.disabledButton]} 
        onPress={saveProfile}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Saving...' : 'Save Details'}</Text>
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
    marginTop: -90,
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
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
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
  disabledButton: {
    backgroundColor: '#9AA5B1',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default StudentProfileScreen;