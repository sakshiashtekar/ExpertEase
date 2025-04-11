import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { supabase } from '../supabase'; // make sure the path is correct

const StudentHomeScreen = ({ navigation }) => {
  const [experts, setExperts] = useState([]);

  const fetchExperts = async () => {
    const { data, error } = await supabase.from('experts').select('*');
    if (error) {
      console.error('Error fetching experts:', error);
    } else {
      setExperts(data);
    }
  };

  useEffect(() => {
    fetchExperts();
  }, []);

  const renderExpertCard = ({ item, index }) => {
    const cardBackgroundColor = index % 2 === 0 ? '#A8DADC' : '#F1FAEE';

    return (
      <View style={[styles.card, { backgroundColor: cardBackgroundColor }]}>
        <Image style={styles.avatar} source={require('../../assets/profile_logo.png')} />
        <View>
          <Text style={styles.cardText}>{item.name}</Text>
          <Text style={styles.cardText}>{item.domain_expertise}</Text>
          <Text style={styles.cardText}>{item.hourly_rate}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
          <Icon name="bars" size={38} color="#E63946" />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#1D3557" style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput} 
            placeholder="Search experts" 
          />
        </View>
      </View>
      <Text style={styles.title}>Our Experts</Text>
      <FlatList
              data={experts} // ✅ using fetched data
              renderItem={renderExpertCard}
              keyExtractor={(item, index) => item.id?.toString() || index.toString()} // safer key
              ListEmptyComponent={<Text>No experts available.</Text>}
            />
      <TouchableOpacity style={styles.postButton} onPress={() => navigation.navigate('PostDoubt')}>
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
    marginTop: 40,
    paddingHorizontal: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 0,
    paddingHorizontal: -5,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#1D3557',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 20,
    marginTop: 10,
    elevation: 4,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 20,
    borderColor: '#1D3557',
    borderWidth: 2,
  },
  cardText: {
    fontSize: 16,
  },
  postButton: {
    backgroundColor: '#1D3557',
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 10,
  },
  postButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default StudentHomeScreen;
