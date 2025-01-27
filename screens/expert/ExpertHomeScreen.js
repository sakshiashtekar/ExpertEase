import React from 'react';    
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; 

const doubts = [
  { id: '1', title: 'What is React Native?', domain: 'Mobile Development', timeslot: '10:00 AM - 11:00 AM', charges: '$20' },
  { id: '2', title: 'How does Redux work?', domain: 'State Management', timeslot: '11:00 AM - 12:00 PM', charges: '$25' },
  { id: '3', title: 'What is Blockchain?', domain: 'Blockchain Technology', timeslot: '1:00 PM - 2:00 PM', charges: '$30' },
  { id: '4', title: 'How to build REST APIs?', domain: 'Backend Development', timeslot: '2:00 PM - 3:00 PM', charges: '$15' },
];

const StudentHomeScreen = () => {
  const renderDoubtCard = ({ item, index }) => {
    // Alternate background colors based on the index
    const cardBackgroundColor = index % 2 === 0 ? '#A8DADC' : '#F1FAEE';

    return (
      <View style={[styles.card, { backgroundColor: cardBackgroundColor }]}>
        <View style={styles.cardContent}>
          <Text style={styles.cardText}>Doubt Title: {item.title}</Text>
          <Text style={styles.cardText}>Domain: {item.domain}</Text>
          <Text style={styles.cardText}>Timeslot: {item.timeslot}</Text>
          <Text style={styles.cardText}>Charges: {item.charges}</Text>
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
            placeholder="Search doubts" 
          />
        </View>
      </View>
      <Text style={styles.title}>Explore Doubts</Text>
      <FlatList
        data={doubts}
        renderItem={renderDoubtCard}
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
    padding: 16,
    marginBottom: 12,
    borderRadius: 20,
    marginTop: 10,
    paddingHorizontal: 15,
    marginLeft: 10,
    marginRight:10
  },
  cardContent: {
    paddingVertical: 10,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 5,
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
