// This service handles all payment-related operations

// Function to create a payment intent (would call your backend)
export const createPaymentIntent = async (amount, email) => {
    try {
      // In a real app, you would make an API call to your backend
      // For now, we'll simulate a network request
      const response = await fetch("https://your-backend-api.com/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          email,
        }),
      })
  
      if (!response.ok) {
        throw new Error("Failed to create payment intent")
      }
  
      return await response.json()
    } catch (error) {
      console.error("Error creating payment intent:", error)
      throw error
    }
  }
  
  // Function to process a payment with Stripe
  export const processStripePayment = async (stripe, clientSecret, paymentMethod) => {
    try {
      const { error, paymentIntent } = await stripe.confirmPayment(clientSecret, {
        paymentMethodId: paymentMethod.id,
      })
  
      if (error) {
        throw new Error(error.message)
      }
  
      return {
        success: true,
        paymentIntent,
      }
    } catch (error) {
      console.error("Error processing payment:", error)
      return {
        success: false,
        error: error.message,
      }
    }
  }
  
  // Function to generate a receipt
  export const generateReceipt = (paymentInfo, doubtData) => {
    return {
      receiptId: `rcpt_${Math.random().toString(36).substring(2, 10)}`,
      customerEmail: doubtData.email,
      amount: paymentInfo.amount,
      description: `Payment for ${doubtData.title}`,
      date: new Date().toISOString(),
      paymentMethod: {
        type: "card",
        last4: paymentInfo.cardLast4,
        brand: paymentInfo.cardBrand,
      },
    }
  }
  