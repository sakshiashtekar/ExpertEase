import React, { useState, useEffect } from 'react'; 
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { supabase } from '../supabase'; // adjust path if needed

const ExpertProfileScreen = ({ navigation, route }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState(route.params?.email || 'neha@experts.com');
  const [companyName, setCompanyName] = useState('');
  const [designation, setDesignation] = useState('');
  const [domain, setDomain] = useState('');
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [availability, setAvailability] = useState(true);
  const [loading, setLoading] = useState(false);
  const [expertId, setExpertId] = useState(null);

  useEffect(() => {
    fetchExpertDetails();
  }, []);

  const fetchExpertDetails = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('experts')
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('New expert, no profile yet');
        } else {
          console.error('Error fetching expert details:', error);
          Alert.alert('Error', 'Unable to fetch expert data');
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
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    setLoading(true);
    try {
      if (!name.trim() || !email.trim()) {
        Alert.alert('Error', 'Name and email are required');
        setLoading(false);
        return;
      }

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
        availability,
      };

      let result;
      if (expertId) {
        result = await supabase
          .from('experts')
          .update(profileData)
          .eq('expert_id', expertId);
      } else {
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
        fetchExpertDetails(); // Refresh data
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
      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Name" placeholderTextColor="#6B7280" />
      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} value={email} editable={false} placeholder="Email/Username" placeholderTextColor="#6B7280" />
      <Text style={styles.label4}>Company</Text>
      <TextInput style={styles.input} value={companyName} onChangeText={setCompanyName} placeholder="Company Name" placeholderTextColor="#6B7280" />
      <Text style={styles.label3}>Designation</Text>
      <TextInput style={styles.input} value={designation} onChangeText={setDesignation} placeholder="Designation" placeholderTextColor="#6B7280" />
      <Text style={styles.label2}>Domain</Text>
      <TextInput style={styles.input} value={domain} onChangeText={setDomain} placeholder="Domain Expertise" placeholderTextColor="#6B7280" />
      <Text style={styles.label3}>Experience</Text>
      <TextInput style={styles.input} value={experience} onChangeText={setExperience} placeholder="Experience (in years)" placeholderTextColor="#6B7280" keyboardType="numeric" />
      
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
  label: {
    fontSize: 15,
    marginBottom: 2,
    marginRight: 330,
    fontWeight: 'bold'
  },
  label1: {
    fontSize: 15,
    marginBottom: 2,
    marginRight: 270,
    fontWeight: 'bold'
  },
  label2: {
    fontSize: 15,
    marginBottom: 2,
    marginRight: 320,
    fontWeight: 'bold'
  },
  label3: {
    fontSize: 15,
    marginBottom: 2,
    marginRight: 290,
    fontWeight: 'bold'
  },
  label4: {
    fontSize: 15,
    marginBottom: 2,
    marginRight: 310,
    fontWeight: 'bold'
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    marginTop: 10,
    marginLeft: -340,
    borderRadius: 10,
  },
  backButtonText: {
    fontSize: 45,  
    color: '#000',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: -10,
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
    width: 380,
    fontWeight: 'bold'
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
  lable: {
    fontSize: 15,
    marginBottom: 2,
    marginLeft: 5,
    fontWeight: 'bold'
  }
});

export default ExpertProfileScreen;
