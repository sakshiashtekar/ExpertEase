import React from 'react';   
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; 

const experts = [
  { id: '1', name: 'sakshi', company: 'ABC Corp', email: 'sakshi@example.com', designation: 'Software Engineer' },
  { id: '2', name: 'Jash', company: 'XYZ Ltd', email: 'jash@example.com', designation: 'Data Scientist' },
  { id: '3', name: 'preeti', company: 'Tech Solutions', email: 'preeti@example.com', designation: 'Product Manager' },
  { id: '4', name: 'aditya', company: 'Technova', email: 'aditya@example.com', designation: 'Java developer' },
];

const StudentHomeScreen = () => {
  const renderExpertCard = ({ item, index }) => {
    const cardBackgroundColor = index % 2 === 0 ? '#A8DADC' : '#F1FAEE';

    return (
      <View style={[styles.card, { backgroundColor: cardBackgroundColor }]}>
        <Image style={styles.avatar} source={require('../../assets/profile_logo.jpg')} />
        <View>
          <Text style={styles.cardText}>{item.name}</Text>
          <Text style={styles.cardText}>{item.company}</Text>
          <Text style={styles.cardText}>{item.email}</Text>
          <Text style={styles.cardText}>{item.designation}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton}>
          <Icon name="bars" size={30} color="#E63946" marginTop={20} />
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
        data={experts}
        renderItem={renderExpertCard}
        keyExtractor={(item) => item.id}
      />
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  menuButton: {
    marginRight: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    height: 40,
    borderWidth: 2,
    borderColor: '#1D3557',
    borderRadius: 20,
    marginTop: 20,
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
    fontSize: 24,
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
