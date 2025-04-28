import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Alert, Image, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import * as AuthSession from 'expo-auth-session';
import { supabase } from '../supabase';

const auth0ClientId = 'u5hqWLFwHEW2aUFfY1G214ZUnlHVMUPD';
const auth0Domain = 'https://dev-w3p1twys85rx8ekx.us.auth0.com';

const ExpertHomeScreen = () => {
  const navigation = useNavigation();

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState('');

  const fetchUsers = async () => {
    const { data, error } = await supabase.from('doubts').select('*');
    if (error) {
      console.error('Error fetching users:', error);
    } else {
      setUsers(data);
      setFilteredUsers(data); // initially show all
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDoubtPress = (doubt) => {
    navigation.navigate('SpecificDoubt', { doubt });
  };

  const handleDomainSelect = (domain) => {
    setSelectedDomain(domain === 'All Domains' ? '' : domain);
    setIsDropdownVisible(false);

    if (domain === 'All Domains') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => user.domain.toLowerCase() === domain.toLowerCase());
      setFilteredUsers(filtered);
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

  const uniqueDomains = ['All Domains', ...new Set(users.map(user => user.domain))];

  return (
    <View style={styles.container}>
      {/* Header with hamburger and search */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
          <Icon name="bars" size={28} color="#E63946" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.searchContainer}
          onPress={() => setIsDropdownVisible(true)}
        >
          <Icon name="search" size={20} color="#1D3557" style={styles.searchIcon} />
          <Text style={styles.searchInput}>
            {selectedDomain ? selectedDomain : 'Select Domain'}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Explore Doubts</Text>

      {/* Dropdown Modal */}
      <Modal
        visible={isDropdownVisible}
        transparent={true}
        animationType="fade"
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setIsDropdownVisible(false)}
        >
          <View style={styles.dropdown}>
            <FlatList
              data={uniqueDomains}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleDomainSelect(item)}
                >
                  <Text style={styles.dropdownText}>{item}</Text>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      <FlatList
        data={filteredUsers}
        renderItem={renderDoubtCard}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        ListEmptyComponent={<Text>No doubts available.</Text>}
      />

      {/* Chatbot logo at the bottom right */}
      <TouchableOpacity
        style={styles.chatbotLogo}
        onPress={() => navigation.navigate('Chatbot')}
      >
        <Image
          source={require('../../assets/chatbot-logo.png')}
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
    marginTop: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    height: 45,
    borderWidth: 2,
    borderColor: '#1D3557',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginTop: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1D3557',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
    color: '#1D3557',
  },
  card: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
    elevation: 4,
    backgroundColor: '#F1FAEE',
  },
  cardContent: {
    paddingVertical: 10,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#1D3557',
  },
  chatbotLogo: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 50,
    elevation: 5,
  },
  chatbotImage: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdown: {
    backgroundColor: '#fff',
    width: '80%',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    maxHeight: '50%',
  },
  dropdownItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownText: {
    fontSize: 18,
    color: '#1D3557',
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginHorizontal: 10,
  },
});


export default ExpertHomeScreen;