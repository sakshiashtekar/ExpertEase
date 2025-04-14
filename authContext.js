"use client"

import { createContext, useState, useEffect, useContext } from "react"
import { isAuthenticated, getUserInfo, getUserRole, logout } from "./authService"

// Create the context
const AuthContext = createContext({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  userRole: null,
  logout: async () => {},
  checkAuth: async () => {},
})

// Create the provider component
export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    userRole: null,
  })

  // Check authentication status on mount and when dependencies change
  const checkAuth = async () => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }))

      const authStatus = await isAuthenticated()

      if (authStatus) {
        const user = await getUserInfo()
        const role = await getUserRole()

        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          user,
          userRole: role,
        })
      } else {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
          userRole: null,
        })
      }
    } catch (error) {
      console.error("Error checking auth status:", error)
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        userRole: null,
      })
    }
  }

  // Check auth on mount
  useEffect(() => {
    checkAuth()
  }, [])

  // Logout function
  const handleLogout = async () => {
    try {
      await logout()
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        userRole: null,
      })
    } catch (error) {
      console.error("Error during logout:", error)
    }
  }

  // Context value
  const value = {
    ...authState,
    logout: handleLogout,
    checkAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext)
