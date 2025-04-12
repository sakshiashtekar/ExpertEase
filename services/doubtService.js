// This service handles all doubt-related database operations

// Simulated database for doubts
const doubtsDatabase = []

// Function to add a doubt to the database
export const addDoubt = async (doubtData, paymentInfo) => {
  try {
    // In a real app, you would make an API call to your backend
    // For now, we'll simulate a network request
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Create a new doubt object with payment info
    const newDoubt = {
      id: generateId(),
      ...doubtData,
      payment: {
        amount: paymentInfo.amount,
        status: "completed",
        transactionId: generateTransactionId(),
        timestamp: new Date().toISOString(),
      },
      status: "pending", // pending, assigned, resolved
      createdAt: new Date().toISOString(),
    }

    // Add to our simulated database
    doubtsDatabase.push(newDoubt)

    console.log("Doubt added to database:", newDoubt)
    return { success: true, doubt: newDoubt }
  } catch (error) {
    console.error("Error adding doubt to database:", error)
    return { success: false, error: error.message }
  }
}

// Function to get all doubts for a user
export const getUserDoubts = async (userEmail) => {
  try {
    // Simulate network request
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Filter doubts by user email
    const userDoubts = doubtsDatabase.filter((doubt) => doubt.email === userEmail)

    return { success: true, doubts: userDoubts }
  } catch (error) {
    console.error("Error fetching user doubts:", error)
    return { success: false, error: error.message }
  }
}

// Helper function to generate a random ID
const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Helper function to generate a transaction ID
const generateTransactionId = () => {
  return "txn_" + Math.random().toString(36).substring(2, 10)
}
