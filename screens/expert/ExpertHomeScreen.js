import React, { useEffect, useState } from 'react';

import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Alert, Image } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import * as AuthSession from 'expo-auth-session';
import Constants from 'expo-constants';
import { supabase } from '../supabase';

// Replace these with your actual Auth0 values
const auth0ClientId = 'u5hqWLFwHEW2aUFfY1G214ZUnlHVMUPD';
const auth0Domain = 'https://dev-w3p1twys85rx8ekx.us.auth0.com';

const ExpertHomeScreen = () => {
  const navigation = useNavigation();

  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const { data, error } = await supabase.from('doubts').select('*');
    if (error) {
      console.error('Error fetching users:', error);
    } else {
      setUsers(data);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDoubtPress = (doubt) => {
    navigation.navigate('SpecificDoubt', { doubt });
  };

  const handleLogout = async () => {
    try {
      const returnTo = encodeURIComponent(AuthSession.makeRedirectUri());

      const logoutUrl = `${auth0Domain}/v2/logout?client_id=${auth0ClientId}&returnTo=${returnTo}`;

      // Open the Auth0 logout URL
      await AuthSession.startAsync({
        authUrl: logoutUrl,
      });

      // Navigate back to signup screen after logout
      navigation.reset({
        index: 0,
        routes: [{ name: 'ExpertSignupScreen' }],
      });
    } catch (error) {
      console.error('Logout failed:', error);
      Alert.alert('Logout Error', 'Something went wrong during logout.');
    }
  };

  const renderDoubtCard = ({ item, index }) => {
    const cardBackgroundColor = index % 2 === 0 ? '#A8DADC' : '#F1FAEE';

    return (
      <TouchableOpacity onPress={() => handleDoubtPress(item)}>
        <View style={[styles.card, { backgroundColor: cardBackgroundColor }]}>
          <View style={styles.cardContent}>
            <Text style={styles.cardText}>Doubt Title: {item.title}</Text>
            <Text style={styles.cardText}>Domain: {item.domain}</Text>
            <Text style={styles.cardText}>Student Email: {item.posted_by}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header with hamburger and search */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
          <Icon name="bars" size={28} color="#E63946" />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#1D3557" style={styles.searchIcon} />
          <TextInput style={styles.searchInput} placeholder="Search doubts" />
        </View>
      </View>

      <Text style={styles.title}>Explore Doubts</Text>

      <FlatList
        data={users} // ✅ using fetched data
        renderItem={renderDoubtCard}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()} // safer key
        ListEmptyComponent={<Text>No doubts available.</Text>}
      />

      {/* Logout Button at Bottom (Optional for now) */}
      {/* <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity> */}

      {/* Chatbot logo at the bottom right */}
      <TouchableOpacity
        style={styles.chatbotLogo}
        onPress={() => navigation.navigate('Chatbot')}
      >
        <Image
          source={require('../../assets/chatbot-logo.png')} // Replace with your logo path
          style={styles.chatbotImage}
        />
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  menuButton: {
    marginRight: 8,
    marginTop: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    height: 40,
    borderWidth: 2,
    borderColor: '#1D3557',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginTop: 40,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#1D3557',
  },
  card: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 20,
    elevation: 4,
  },
  cardContent: {
    paddingVertical: 10,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 5,
  },

  logoutButton: {
    backgroundColor: '#E63946',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  chatbotLogo: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#ffff', // Customize background color
    padding: 10,
    borderRadius: 50,
    elevation: 5,
  },
  chatbotImage: {
    width: 60,
    height: 60,
    borderRadius: 50,

  },
});

export default ExpertHomeScreen;
