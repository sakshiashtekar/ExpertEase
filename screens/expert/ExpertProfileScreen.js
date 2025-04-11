import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { supabase } from '../supabase'; // adjust path if needed

const ExpertProfileScreen = ({ navigation }) => {
  // State to store user details
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [designation, setDesignation] = useState('');
  const [domain, setDomain] = useState('');
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [availability, setAvailability] = useState(true);
  const [loading, setLoading] = useState(false);
  const [expertId, setExpertId] = useState(null);

  // Fetch expert data
  const fetchExpertDetails = async () => {
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
        .from('experts')
        .select('*')
        .eq('email', userEmail)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('New user, no profile yet');
          setEmail(userEmail); // Set the email from auth
        } else {
          console.error('Error fetching expert details:', error);
        }
      } else if (data) {
        setExpertId(data.expert_id);
        setName(data.name || '');
        setEmail(data.email || '');
        setCompanyName(data.company_name || '');
        setDesignation(data.designation || '');
        setDomain(data.domain_expertise || '');
        setSkills(data.skills || '');
        setExperience(data.experience ? data.experience.toString() : '');
        setHourlyRate(data.hourly_rate ? data.hourly_rate.toString() : '');
        setAvailability(data.availability !== false);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpertDetails();
  }, []);

  // Function to save details
  const saveProfile = async () => {
    setLoading(true);
    try {
      // Validate inputs
      if (!name.trim() || !email.trim()) {
        Alert.alert('Error', 'Name and email are required');
        setLoading(false);
        return;
      }

      // Parse numeric fields
      const parsedExperience = experience ? parseInt(experience) : 0;
      const parsedHourlyRate = hourlyRate ? parseFloat(hourlyRate) : 0;

      const profileData = {
        name,
        email,
        company_name: companyName,
        designation,
        domain_expertise: domain,
        skills,
        experience: parsedExperience,
        hourly_rate: parsedHourlyRate,
        availability: availability
      };

      let result;
      
      if (expertId) {
        // Update existing record
        result = await supabase
          .from('experts')
          .update(profileData)
          .eq('expert_id', expertId);
      } else {
        // Insert new record
        result = await supabase
          .from('experts')
          .insert([profileData]);
      }

      const { error } = result;

      if (error) {
        console.error('Error saving profile:', error);
        Alert.alert('Error', 'Failed to save profile. Please try again.');
      } else {
        Alert.alert('Success', 'Your profile has been saved successfully.');
        // Refresh expert details to get the ID if it was a new record
        fetchExpertDetails();
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

      <Text style={styles.title}>Expert Profile</Text>

      <View style={styles.profileImageContainer}>
        <Image
          source={require('../../assets/profile_logo.png')}
          style={styles.profileImage}
        />
        <Text style={styles.uploadText}>Profile Picture</Text>
      </View>

      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Name" placeholderTextColor="#6B7280" />
      <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email/Username" placeholderTextColor="#6B7280" />
      <TextInput style={styles.input} value={companyName} onChangeText={setCompanyName} placeholder="Company Name" placeholderTextColor="#6B7280" />
      <TextInput style={styles.input} value={designation} onChangeText={setDesignation} placeholder="Designation" placeholderTextColor="#6B7280" />
      <TextInput style={styles.input} value={domain} onChangeText={setDomain} placeholder="Domain Expertise" placeholderTextColor="#6B7280" />
      <TextInput 
        style={styles.input} 
        value={skills} 
        onChangeText={setSkills} 
        placeholder="Skills" 
        placeholderTextColor="#6B7280"
      />
      <TextInput 
        style={styles.input} 
        value={experience} 
        onChangeText={setExperience} 
        placeholder="Experience (in years)" 
        placeholderTextColor="#6B7280"
        keyboardType="numeric"
      />
      <TextInput 
        style={styles.input} 
        value={hourlyRate} 
        onChangeText={setHourlyRate} 
        placeholder="Hourly Rate" 
        placeholderTextColor="#6B7280"
        keyboardType="numeric"
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
  disabledButton: {
    backgroundColor: '#9AA5B1',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ExpertProfileScreen;