import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Image, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../supabase';

const StudentHomeScreen = () => {
  const navigation = useNavigation();

  const [experts, setExperts] = useState([]);
  const [filteredExperts, setFilteredExperts] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState('');

  useEffect(() => {
    fetchExperts();
  }, []);

  const fetchExperts = async () => {
    const { data, error } = await supabase.from('experts').select('*');
    if (error) {
      console.error('Error fetching experts:', error);
    } else {
      setExperts(data);
      setFilteredExperts(data);
    }
  };

  const handleDomainSelect = (domain) => {
    setSelectedDomain(domain === 'All Domains' ? '' : domain);
    setIsDropdownVisible(false);

    if (domain === 'All Domains') {
      setFilteredExperts(experts);
    } else {
      const filtered = experts.filter(expert => expert.domain_expertise.toLowerCase() === domain.toLowerCase());
      setFilteredExperts(filtered);
    }
  };

  const renderExpertCard = ({ item, index }) => {
    const cardBackgroundColor = index % 2 === 0 ? '#A8DADC' : '#F1FAEE';

    return (
      <View style={[styles.card, { backgroundColor: cardBackgroundColor }]}>
        <Image style={styles.avatar} source={require('../../assets/profile_logo.png')} />
        <View style={styles.cardContent}>
          <Text style={styles.cardText}>Name: {item.name}</Text>
          <Text style={styles.cardText}>Expertise: {item.domain_expertise}</Text>
          <Text style={styles.cardText}>Hourly Rate: ₹{item.hourly_rate}</Text>
        </View>
      </View>
    );
  };

  const uniqueDomains = ['All Domains', ...new Set(experts.map(expert => expert.domain_expertise))];

  return (
    <View style={styles.container}>
      {/* Header with menu and domain filter */}
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

      <Text style={styles.title}>Our Experts</Text>

      {/* Domain dropdown modal */}
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
        data={filteredExperts}
        renderItem={renderExpertCard}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        ListEmptyComponent={<Text>No experts available.</Text>}
      />

      <TouchableOpacity style={styles.postButton} onPress={() => navigation.navigate('PostDoubt')}>
        <Text style={styles.postButtonText}>Post Doubt</Text>
      </TouchableOpacity>

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
    marginTop: 40,
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
    marginTop: 40,
    backgroundColor: '#f0f4f8',
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
    flexDirection: 'row',
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
    elevation: 4,
    backgroundColor: '#F1FAEE',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#1D3557',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardText: {
    fontSize: 16,
    color: '#1D3557',
    marginBottom: 4,
  },
  postButton: {
    backgroundColor: '#1D3557',
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  postButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
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

export default StudentHomeScreen;
