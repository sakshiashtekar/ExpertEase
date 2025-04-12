import React from "react"
import { startAsync, makeRedirectUri, exchangeCodeAsync } from "expo-auth-session";

import * as AuthSession from "expo-auth-session"
import * as SecureStore from "expo-secure-store"
import { auth0ClientId, auth0Domain, auth0Audience, auth0Scope } from "./authConfig"

// Constants for secure storage
const AUTH_TOKEN_KEY = "auth0_token"
const AUTH_USER_KEY = "auth0_user"
const USER_ROLE_KEY = "user_role"

// Create the Auth0 redirect URI
export const redirectUri = AuthSession.makeRedirectUri({
  scheme: "myapp", // Replace with your app's scheme
  path: "callback",
  useProxy: true,
})

// Log the redirect URI for debugging
console.log("Auth0 Redirect URI:", redirectUri)

// Auth0 endpoints
const discovery = {
  authorizationEndpoint: `https://${auth0Domain}/authorize`,
  tokenEndpoint: `https://${auth0Domain}/oauth/token`,
  revocationEndpoint: `https://${auth0Domain}/oauth/revoke`,
  userInfoEndpoint: `https://${auth0Domain}/userinfo`,
}

// Create the Auth0 request hook
export function useAuthRequest() {
  return AuthSession.useAuthRequest(
    {
      clientId: auth0ClientId,
      redirectUri,
      responseType: "code",
      scopes: auth0Scope.split(" "),
      extraParams: {
        audience: auth0Audience,
        prompt: "login",
      },
    },
    discovery,
  )
}

// Exchange authorization code for tokens
export async function exchangeCodeForToken(code, request) {
  try {
    console.log("Exchanging code for token...")

    const tokenResponse = await AuthSession.exchangeCodeAsync(
      {
        clientId: auth0ClientId,
        code,
        redirectUri,
        extraParams: {
          code_verifier: request.codeVerifier,
        },
      },
      discovery,
    )

    console.log("Token exchange successful")

    // Store tokens securely
    await storeAuthData(tokenResponse)

    // Fetch user info
    const userInfo = await fetchUserInfo(tokenResponse.accessToken)
    await storeUserInfo(userInfo)

    return { success: true }
  } catch (error) {
    console.error("Error exchanging code for token:", error)
    return { success: false, error: error.message || "Failed to exchange code for token" }
  }
}

// Fetch user info from Auth0
async function fetchUserInfo(accessToken) {
  try {
    const response = await fetch(`https://${auth0Domain}/userinfo`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch user info")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching user info:", error)
    throw error
  }
}

// Store auth data securely
async function storeAuthData(tokenResponse) {
  try {
    await SecureStore.setItemAsync(
      AUTH_TOKEN_KEY,
      JSON.stringify({
        accessToken: tokenResponse.accessToken,
        refreshToken: tokenResponse.refreshToken,
        idToken: tokenResponse.idToken,
        expiresIn: tokenResponse.expiresIn,
        issuedAt: new Date().getTime(),
      }),
    )
  } catch (error) {
    console.error("Error storing auth data:", error)
    throw error
  }
}

// Store user info securely
async function storeUserInfo(userInfo) {
  try {
    await SecureStore.setItemAsync(AUTH_USER_KEY, JSON.stringify(userInfo))
  } catch (error) {
    console.error("Error storing user info:", error)
    throw error
  }
}

// Set user role (expert or student)
export async function setUserRole(role) {
  try {
    await SecureStore.setItemAsync(USER_ROLE_KEY, role)
    return true
  } catch (error) {
    console.error("Error setting user role:", error)
    return false
  }
}

// Get user role
export async function getUserRole() {
  try {
    return await SecureStore.getItemAsync(USER_ROLE_KEY)
  } catch (error) {
    console.error("Error getting user role:", error)
    return null
  }
}

// Check if user is authenticated
export async function isAuthenticated() {
  try {
    const authDataStr = await SecureStore.getItemAsync(AUTH_TOKEN_KEY)
    if (!authDataStr) return false

    const authData = JSON.parse(authDataStr)
    const expiryTime = authData.issuedAt + authData.expiresIn * 1000
    const isExpired = new Date().getTime() > expiryTime

    if (isExpired && authData.refreshToken) {
      // Try to refresh the token
      return await refreshTokens(authData.refreshToken)
    }

    return !isExpired
  } catch (error) {
    console.error("Error checking authentication:", error)
    return false
  }
}

// Refresh tokens
async function refreshTokens(refreshToken) {
  try {
    const tokenResponse = await fetch(`https://${auth0Domain}/oauth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grant_type: "refresh_token",
        client_id: auth0ClientId,
        refresh_token: refreshToken,
      }),
    })

    if (!tokenResponse.ok) {
      throw new Error("Failed to refresh token")
    }

    const tokenData = await tokenResponse.json()
    await storeAuthData({
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token || refreshToken,
      idToken: tokenData.id_token,
      expiresIn: tokenData.expires_in,
      issuedAt: new Date().getTime(),
    })

    return true
  } catch (error) {
    console.error("Error refreshing tokens:", error)
    return false
  }
}

// Get user info
export async function getUserInfo() {
  try {
    const userInfoStr = await SecureStore.getItemAsync(AUTH_USER_KEY)
    return userInfoStr ? JSON.parse(userInfoStr) : null
  } catch (error) {
    console.error("Error getting user info:", error)
    return null
  }
}

// Get access token
export async function getAccessToken() {
  try {
    const authDataStr = await SecureStore.getItemAsync(AUTH_TOKEN_KEY)
    if (!authDataStr) return null

    const authData = JSON.parse(authDataStr)
    return authData.accessToken
  } catch (error) {
    console.error("Error getting access token:", error)
    return null
  }
}

// Login with email/password
export async function loginWithAuth0(email, password) {
  try {
    console.log("Logging in with email/password...")

    const tokenResponse = await fetch(`https://${auth0Domain}/oauth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grant_type: "password",
        username: email,
        password: password,
        client_id: auth0ClientId,
        audience: auth0Audience,
        scope: auth0Scope,
      }),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json()
      throw new Error(errorData.error_description || "Invalid credentials")
    }

    const tokenData = await tokenResponse.json()

    // Store tokens
    await storeAuthData({
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      idToken: tokenData.id_token,
      expiresIn: tokenData.expires_in,
      issuedAt: new Date().getTime(),
    })

    // Fetch and store user info
    const userInfo = await fetchUserInfo(tokenData.access_token)
    await storeUserInfo(userInfo)

    return { success: true }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, error: error.message || "Login failed" }
  }
}

// Logout
export async function logout() {
  try {
    // Clear stored tokens and user info
    await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY)
    await SecureStore.deleteItemAsync(AUTH_USER_KEY)
    await SecureStore.deleteItemAsync(USER_ROLE_KEY)

    // Construct the Auth0 logout URL
    const logoutUrl = `https://${auth0Domain}/v2/logout?client_id=${auth0ClientId}&returnTo=${encodeURIComponent(redirectUri)}`

    // Open the logout URL in a browser
    await startAsync({ authUrl: logoutUrl, returnUrl: redirectUri });

    return true
  } catch (error) {
    console.error("Logout error:", error)
    return false
  }
}

// Auth0 context provider for React components
export function createAuthContext() {
  const AuthContext = React.createContext({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    login: async () => {},
    loginWithGoogle: async () => {},
    logout: async () => {},
    userRole: null,
  })

  return AuthContext
}
