// Updated Auth0 service

import * as AuthSession from "expo-auth-session"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as Random from "expo-random"
import * as Crypto from "expo-crypto"

// Auth0 configuration
const AUTH0_DOMAIN = "dev-w3p1twys85rx8ekx.us.auth0.com"
const AUTH0_CLIENT_ID = "u5hqWLFwHEW2aUFfY1G214ZUnlHVMUPD"
const AUTH_AUDIENCE = `https://${AUTH0_DOMAIN}/api/v2/`
const REDIRECT_URI = AuthSession.makeRedirectUri({
  useProxy: true,
});
console.log("Redirect URI", REDIRECT_URI)
// Store for PKCE code verifier
let codeVerifier = null

// Generate PKCE code verifier and challenge
// Generate PKCE code verifier and challenge
const generatePKCE = async () => {
  // Generate random bytes for verifier
  const randomBytes = await Random.getRandomBytesAsync(32)
  
  // Create verifier as base64url-encoded string
  codeVerifier = Buffer.from(randomBytes)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "")
  
  // Ensure verifier meets length requirements (min 43 chars)
  if (codeVerifier.length < 43) {
    codeVerifier = codeVerifier.padEnd(43, "0")
  }
  
  // Create the challenge by hashing the verifier with SHA-256
  const challengeBuffer = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    codeVerifier
  )
  
  // Convert the challenge hash to base64url encoding
  const challenge = Buffer.from(challengeBuffer)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "")
  
  return challenge
}

// Use Auth0 authentication request
export const useAuthRequest = () => {
  const [request, result, promptAsync] = AuthSession.useAuthRequest(
    {
      redirectUri: REDIRECT_URI,
      clientId: AUTH0_CLIENT_ID,
      responseType: "code",
      scopes: ["openid", "profile", "email", "offline_access"],
      extraParams: {
        audience: AUTH_AUDIENCE,
        code_challenge_method: "S256",
        // Generate a new code challenge on each request
        get code_challenge() {
          return generatePKCE().then((challenge) => challenge)
        },
      },
    },
    { authorizationEndpoint: `https://${AUTH0_DOMAIN}/authorize` },
  )

  return [request, result, promptAsync]
}

// Exchange authorization code for token
export const exchangeCodeForToken = async (code) => {
  if (!codeVerifier) {
    return {
      success: false,
      error: "Code verifier is missing. Please try again.",
    }
  }

  try {
    const tokenResponse = await fetch(`https://${AUTH0_DOMAIN}/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        client_id: AUTH0_CLIENT_ID,
        code_verifier: codeVerifier,
        code,
        redirect_uri: REDIRECT_URI,
      }),
    })

    const tokenData = await tokenResponse.json()

    if (tokenData.error) {
      console.error("Token exchange error:", tokenData)
      return {
        success: false,
        error: tokenData.error_description || "Failed to exchange code for token",
      }
    }

    // Store the tokens
    await AsyncStorage.setItem("access_token", tokenData.access_token)
    await AsyncStorage.setItem("id_token", tokenData.id_token)
    if (tokenData.refresh_token) {
      await AsyncStorage.setItem("refresh_token", tokenData.refresh_token)
    }

    return {
      success: true,
      tokens: tokenData,
    }
  } catch (error) {
    console.error("Token exchange error:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

// Register with Auth0 using email/password
export const registerWithAuth0 = async (email, password) => {
  try {
    // For direct signup, use Auth0's Database Connection API
    const signupResponse = await fetch(`https://${AUTH0_DOMAIN}/dbconnections/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: AUTH0_CLIENT_ID,
        email,
        password,
        connection: "Username-Password-Authentication", // Use your Auth0 DB connection name
      }),
    })

    const signupData = await signupResponse.json()

    if (signupData.error) {
      console.error("Signup error:", signupData)
      return {
        success: false,
        error: signupData.error_description || "Failed to sign up",
      }
    }

    // After signup, get tokens using the password grant
    // Note: This requires enabling the Password grant in Auth0
    return await loginWithCredentials(email, password)
  } catch (error) {
    console.error("Registration error:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

// Login with email/password credentials
export const loginWithCredentials = async (email, password) => {
  try {
    // Use authorization code flow instead of password grant
    const state = Math.random().toString(36).substring(2, 15)
    const codeChallenge = await generatePKCE()

    // Store state for verification
    await AsyncStorage.setItem("auth_state", state)

    // Create authorization URL
    const authUrl =
      `https://${AUTH0_DOMAIN}/authorize?` +
      `client_id=${AUTH0_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
      `&response_type=code` +
      `&scope=${encodeURIComponent("openid profile email offline_access")}` +
      `&state=${state}` +
      `&code_challenge=${codeChallenge}` +
      `&code_challenge_method=S256` +
      `&audience=${encodeURIComponent(AUTH_AUDIENCE)}` +
      `&login_hint=${encodeURIComponent(email)}`

    // Launch browser for authentication
    const result = await AuthSession.startAsync({
      authUrl,
    })

    if (result.type === "success" && result.params.code) {
      // Verify state to prevent CSRF
      const storedState = await AsyncStorage.getItem("auth_state")
      if (storedState !== result.params.state) {
        return {
          success: false,
          error: "Invalid state parameter",
        }
      }

      // Exchange code for token
      return await exchangeCodeForToken(result.params.code)
    } else {
      return {
        success: false,
        error: "Authentication failed or was cancelled",
      }
    }
  } catch (error) {
    console.error("Login error:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

// Set user role
export const setUserRole = async (role) => {
  try {
    const accessToken = await AsyncStorage.getItem("access_token")
    if (!accessToken) {
      return {
        success: false,
        error: "No access token available",
      }
    }

    // Store the user role locally
    await AsyncStorage.setItem("user_role", role)

    // In a real implementation, you might want to update the user's
    // role in Auth0 or your own backend using the Management API

    return {
      success: true,
    }
  } catch (error) {
    console.error("Set user role error:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}
