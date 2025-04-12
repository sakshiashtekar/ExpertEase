"use client"

import { createContext, useState, useContext } from "react"
import { addDoubt, getUserDoubts } from "../services/doubtService"

// Create context
const DatabaseContext = createContext({
  doubts: [],
  loading: false,
  addNewDoubt: async () => {},
  fetchUserDoubts: async () => {},
})

// Create provider
export const DatabaseProvider = ({ children }) => {
  const [doubts, setDoubts] = useState([])
  const [loading, setLoading] = useState(false)

  // Add a new doubt with payment info
  const addNewDoubt = async (doubtData, paymentInfo) => {
    setLoading(true)
    try {
      const result = await addDoubt(doubtData, paymentInfo)
      if (result.success) {
        setDoubts((prevDoubts) => [...prevDoubts, result.doubt])
        return { success: true, doubt: result.doubt }
      } else {
        return { success: false, error: result.error }
      }
    } catch (error) {
      console.error("Error in addNewDoubt:", error)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  // Fetch doubts for a specific user
  const fetchUserDoubts = async (userEmail) => {
    setLoading(true)
    try {
      const result = await getUserDoubts(userEmail)
      if (result.success) {
        setDoubts(result.doubts)
        return { success: true, doubts: result.doubts }
      } else {
        return { success: false, error: result.error }
      }
    } catch (error) {
      console.error("Error in fetchUserDoubts:", error)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  // Context value
  const value = {
    doubts,
    loading,
    addNewDoubt,
    fetchUserDoubts,
  }

  return <DatabaseContext.Provider value={value}>{children}</DatabaseContext.Provider>
}

// Custom hook to use the database context
export const useDatabase = () => useContext(DatabaseContext)
