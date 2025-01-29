import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import logo from '../../assets/expertease_logo.png'; 

const ExpertDrawerContent = (props) => {
  return (
    <View style={styles.drawerContent}>
      <View style={styles.header}>
      <Image source={logo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.heading}>ExpertEase</Text>
      </View>
      
      <TouchableOpacity onPress={() => props.navigation.navigate('ExpertHome')}>
        <Text style={styles.drawerItem}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => props.navigation.navigate('')}>
        <Text style={styles.drawerItem}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => props.navigation.navigate('ExpertHistory')}>
        <Text style={styles.drawerItem}>History</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => props.navigation.navigate('')}>
        <Text style={styles.drawerItem}>Chatbot</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => props.navigation.navigate('')}>
      <View style={styles.logoutContainer}>
          <Icon name="logout" size={24} color="#457B9D" style={styles.logoutIcon} />
          <Text style={styles.logout}>Logout</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    paddingTop: 30,
    paddingLeft: 20,
    paddingRight: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 80, 
    height: 100,
    marginRight: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1D3557',
  },
  drawerItem: {
    fontSize: 18,
    paddingVertical: 10,
    color: '#457B9D',
    fontWeight: 'bold'
  },
  logoutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 50,
  },
  logoutIcon: {
    marginRight: 10,  
  },
  logout: {
    fontSize: 18,
    paddingVertical: 10,
    color: '#457B9D',
    fontWeight: 'bold'
  },
});

export default ExpertDrawerContent;
