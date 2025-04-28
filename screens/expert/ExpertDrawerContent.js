import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import logo from '../../assets/expertease_logo.png'; 

import { auth0Domain, auth0ClientId } from '../../authContext';

import * as WebBrowser from 'expo-web-browser';
import * as SecureStore from 'expo-secure-store';

const clearSession = async () => {
  await SecureStore.deleteItemAsync('accessToken');
  await SecureStore.deleteItemAsync('idToken');
  await SecureStore.deleteItemAsync('refreshToken');
};
export const handleLogout = async () => {
  const logoutUrl = `https://${auth0Domain}/v2/logout?client_id=${auth0ClientId}}`;
  await clearSession();
  await WebBrowser.openBrowserAsync(logoutUrl);
};

const ExpertDrawerContent = (props) => {
  // const handleLogout = async () => {
  //   try {
  //     // Clear all tokens from storage
  //     await AsyncStorage.removeItem("access_token");
  //     await AsyncStorage.removeItem("id_token");
  //     await AsyncStorage.removeItem("refresh_token");
  //     await AsyncStorage.removeItem("user_role");
  //     await AsyncStorage.removeItem("auth_state");
      
  //     console.log("Logged out successfully");
      
  //     // Use the navigation hook
  //     props.navigation.reset({
  //       index: 0,
  //       routes: [{ name: 'Welcome' }],
  //     });
  //   } catch (error) {
  //     console.error("Logout error:", error);
  //     props.navigation.reset({
  //       index: 0,
  //       routes: [{ name: 'Welcome' }],
  //     });
  //   }
  // };
  
  
  return (
    <View style={styles.drawerContent}>
      <View style={styles.header}>
      <Image source={logo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.heading}>ExpertEase</Text>
      </View>
      
      <TouchableOpacity onPress={() => props.navigation.navigate('ExpertHome')}>
        <Text style={styles.drawerItem}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => props.navigation.navigate('ExpertProfile')}>
        <Text style={styles.drawerItem}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => props.navigation.navigate('ExpertChatbot')}>
        <Text style={styles.drawerItem}>Chatbot</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => props.navigation.navigate('ExpertFeedback')}>
        <Text style={styles.drawerItem}>Feedback</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => props.navigation.navigate('Welcome')}>
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
