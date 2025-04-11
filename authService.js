// authService.js
import * as AuthSession from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Auth0 Configuration
const auth0Domain = "dev-w3p1twys85rx8ekx.us.auth0.com";
const auth0ClientId = "u5hqWLFwHEW2aUFfY1G214ZUnlHVMUPD";

// Get the redirect URI
const redirectUri = AuthSession.makeRedirectUri({
  useProxy: true,
});

// Setup Auth0 endpoints
const discovery = {
  authorizationEndpoint: `https://${auth0Domain}/authorize`,
  tokenEndpoint: `https://${auth0Domain}/oauth/token`,
  revocationEndpoint: `https://${auth0Domain}/oauth/revoke`,
  userInfoEndpoint: `https://${auth0Domain}/userinfo`
};

// Token storage keys
const ACCESS_TOKEN_KEY = 'auth0_access_token';
const ID_TOKEN_KEY = 'auth0_id_token';
const USER_DATA_KEY = 'auth0_user_data';
const USER_ROLE_KEY = 'user_role'; // 'expert' or 'student'

// Create Auth Session request for Google login
export const useAuthRequest = () => {
  return AuthSession.useAuthRequest(
    {
      clientId: auth0ClientId,
      redirectUri,
      responseType: 'code',
      scopes: ['openid', 'profile', 'email'],
      extraParams: {
        connection: 'google-oauth2',
      },
    },
    discovery
  );
};

// Email & Password login with Auth0
export const loginWithAuth0 = async (email, password) => {
  try {
    const tokenResponse = await fetch(`https://${auth0Domain}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'password',
        username: email,
        password: password,
        client_id: auth0ClientId,
        scope: 'openid profile email',
      }),
    });

    const tokenData = await tokenResponse.json();
    
    // Handle errors from Auth0
    if (tokenData.error) {
      throw new Error(tokenData.error_description || 'Login failed');
    }

    // Save tokens to secure storage
    await storeTokens(tokenData);
    
    // Fetch user profile
    const userData = await fetchUserProfile(tokenData.access_token);
    
    return {
      success: true,
      userData
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Register with email & password on Auth0
export const registerWithAuth0 = async (email, password) => {
  try {
    const signupResponse = await fetch(`https://${auth0Domain}/dbconnections/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: auth0ClientId,
        email,
        password,
        connection: 'Username-Password-Authentication',
      }),
    });

    const signupData = await signupResponse.json();
    
    // Handle errors from Auth0
    if (signupData.error) {
      throw new Error(signupData.error_description || 'Registration failed');
    }

    // After registration, log in to get tokens
    return await loginWithAuth0(email, password);
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Exchange authorization code for tokens (Google login flow)
export const exchangeCodeForToken = async (code) => {
  try {
    console.log("Exchanging code for token...");
    
    const tokenResponse = await fetch(`https://${auth0Domain}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: auth0ClientId,
        code,
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenResponse.json();
    
    if (tokenData.error) {
      throw new Error(tokenData.error_description || 'Failed to exchange code for token');
    }

    // Store tokens in secure storage
    await storeTokens(tokenData);
    
    // Fetch user profile with the token
    const userData = await fetchUserProfile(tokenData.access_token);
    
    return {
      success: true,
      userData
    };
  } catch (error) {
    console.error('Token exchange error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Fetch user profile from Auth0
export const fetchUserProfile = async (accessToken) => {
  try {
    const userInfoResponse = await fetch(`https://${auth0Domain}/userinfo`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userData = await userInfoResponse.json();
    
    if (userData.error) {
      throw new Error(userData.error_description || 'Failed to fetch user profile');
    }
    
    // Store user data
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    
    return userData;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Store auth tokens
const storeTokens = async (tokenData) => {
  try {
    if (tokenData.access_token) {
      await AsyncStorage.setItem(ACCESS_TOKEN_KEY, tokenData.access_token);
    }
    if (tokenData.id_token) {
      await AsyncStorage.setItem(ID_TOKEN_KEY, tokenData.id_token);
    }
  } catch (error) {
    console.error('Error storing tokens:', error);
    throw error;
  }
};

// Set user role (expert or student)
export const setUserRole = async (role) => {
  try {
    await AsyncStorage.setItem(USER_ROLE_KEY, role);
  } catch (error) {
    console.error('Error storing user role:', error);
  }
};

// Get user role
export const getUserRole = async () => {
  try {
    return await AsyncStorage.getItem(USER_ROLE_KEY);
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
};

// Get current user data
export const getCurrentUser = async () => {
  try {
    const userData = await AsyncStorage.getItem(USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

// Logout user
export const logout = async () => {
  try {
    // Remove all auth data from storage
    await AsyncStorage.multiRemove([
      ACCESS_TOKEN_KEY,
      ID_TOKEN_KEY,
      USER_DATA_KEY,
      USER_ROLE_KEY
    ]);
    
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { 
      success: false,
      error: error.message
    };
  }
};

// Check if user is authenticated
export const isAuthenticated = async () => {
  try {
    const token = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
    return !!token;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

// Get access token
export const getAccessToken = async () => {
  try {
    return await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
};