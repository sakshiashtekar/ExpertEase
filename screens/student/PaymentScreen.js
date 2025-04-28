"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert, TextInput } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import Icon from "react-native-vector-icons/FontAwesome"
import { StripeProvider, useStripe, CardField, useConfirmPayment, CardForm  } from "@stripe/stripe-react-native"
import { useDatabase } from "../../context/DatabaseContext"

// You would replace this with your actual Stripe publishable key
const STRIPE_PUBLISHABLE_KEY = "pk_test_51RCxbuK6hULRCRrGj5VzOztFNlG5EO8h4KV5tHaQYAoRfIUfRUsaQoqiEMVM7B6vBsaiHpdTJR9i55bHOY4vNoei007iAVnDeW"

// API URL - replace with your actual backend URL
const API_URL = "http://localhost:3000"

// Payment options with different tiers
const PAYMENT_OPTIONS = [
  { id: "1", amount: 5, description: "Basic Doubt", features: ["24-hour response time", "Text-based solution"] },
  {
    id: "2",
    amount: 10,
    description: "Standard Doubt",
    features: ["12-hour response time", "Text & image solution", "Follow-up question"],
  },
  {
    id: "3",
    amount: 20,
    description: "Premium Doubt",
    features: ["4-hour response time", "Detailed explanation", "Video solution", "Multiple follow-ups"],
  },
]




const PaymentScreen = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  console.log("Stripe hook:", initPaymentSheet);
  const navigation = useNavigation()
  const route = useRoute()
  const { doubtData } = route.params
  const { addNewDoubt } = useDatabase()
  const { confirmPayment, loading } = useConfirmPayment()

  const [selectedOption, setSelectedOption] = useState(PAYMENT_OPTIONS[0])
  const [cardDetails, setCardDetails] = useState(null)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
 
  const handleGoBack = () => {
    navigation.navigate("StudentDrawer", {
      screen: "StudentHome",
    });
  }

  const fetchPaymentIntentClientSecret = async () => {
    try {
      const response = await fetch(`${API_URL}/create-payment-intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: selectedOption.amount * 100, // Convert to cents for Stripe
          currency: "usd"
        }),
      })
      
      const { clientSecret, error } = await response.json()
      return { clientSecret, error }
    } catch (error) {
      console.error("Error fetching payment intent:", error)
      return { error: "Failed to connect to payment server" }
    }
  }

  const handlePayment = async () => {
    if (!cardDetails?.complete) {
      Alert.alert("Error", "Please enter complete card details")
      return
    }


    try {
      // 1. Fetch the payment intent client secret
      const { clientSecret, error: fetchError } = await fetchPaymentIntentClientSecret()
      
      if (fetchError) {
        throw new Error(fetchError)
      }
      
      // 2. Confirm the payment
      const { paymentIntent, error } = await confirmPayment(clientSecret, {
        type: "Card",
        billingDetails: {
          email: doubtData.email,
        },
      })

      if (error) {
        throw new Error(error.message)
      }

      if (paymentIntent) {
        // 3. Payment successful - create payment info
        const paymentInfo = {
          amount: selectedOption.amount,
          paymentIntentId: paymentIntent.id,
          paymentMethodId: paymentIntent.paymentMethodId,
        }

        // 4. Add doubt to database
        const result = await addNewDoubt(doubtData, paymentInfo)

        if (result.success) {
          setPaymentSuccess(true)

          // Show success message and navigate after a delay
          setTimeout(() => {
            Alert.alert("Payment Successful", "Your doubt has been posted successfully!", [
              {
                text: "OK",
                onPress: () => {
                  navigation.navigate("StudentDrawer", {
                    screen: "StudentHome",
                    params: { doubtPosted: true },
                  })
                },
              },
            ])
          }, 1000)
        } else {
          throw new Error(result.error || "Failed to save doubt")
        }
      }
    } catch (error) {
      console.error("Payment error:", error)
      Alert.alert("Payment Failed", error.message || "There was an error processing your payment. Please try again.")
    } finally {
      
    }
  }

  const renderPaymentOption = (option) => {
    const isSelected = selectedOption.id === option.id

    return (
      <TouchableOpacity
        key={option.id}
        style={[styles.paymentOption, isSelected ? styles.selectedPaymentOption : null]}
        onPress={() => setSelectedOption(option)}
      >
        <View style={styles.paymentOptionHeader}>
          <Text style={[styles.paymentOptionTitle, isSelected ? styles.selectedPaymentOptionText : null]}>
            ${option.amount} - {option.description}
          </Text>
          {isSelected && <Icon name="check" size={20} color="#1D3557" />}
        </View>

        <View style={styles.featuresContainer}>
          {option.features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Icon name="check-circle" size={14} color="#457B9D" style={styles.featureIcon} />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>
      </TouchableOpacity>
    )
  }
  
  if (paymentSuccess) {
    return (
      <View style={styles.successContainer}>
        <Icon name="check-circle" size={80} color="#1D3557" />
        <Text style={styles.successTitle}>Payment Successful!</Text>
        <Text style={styles.successText}>Your doubt has been posted successfully.</Text>
        <ActivityIndicator size="large" color="#1D3557" style={styles.successSpinner} />
      </View>
    )
  }
  // Add this right before the return statement
  console.log("Card details:", cardDetails);
  return (
    
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Payment</Text>

          <View style={styles.doubtSummary}>
            <Text style={styles.summaryTitle}>Doubt Summary</Text>
            <Text style={styles.summaryText} numberOfLines={1} ellipsizeMode="tail">
              <Text style={styles.summaryLabel}>Title: </Text>
              {doubtData.title}
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Select Package</Text>

          {PAYMENT_OPTIONS.map(renderPaymentOption)}

          <Text style={styles.sectionTitle}>Card Details</Text>

          
            <CardField
              postalCodeEnabled={false}
              placeholder={{ 
                number: "4242 4242 4242 4242",
              }}
              cardStyle={styles.cardField}
              style={styles.cardFieldContainer}
              onCardChange={(details) => {
                console.log("Card changed:", details);
                setCardDetails(details);;
              }} 
              onFocus={(focusedField) => {
                console.log('Focus on', focusedField);
              }}
            />
            {/* <CardForm
              postalCodeEnabled={false}
              placeholder={{ 
                number: "4242 4242 4242 4242",
              }}
              cardStyle={styles.cardField}
              style={styles.cardFieldContainer}
              onFormComplete={(details) => {
                console.log("Card Form Complete:", details);
                setCardDetails(details);
              }}
            /> */}
            {cardDetails?.complete && (
              <View style={styles.validatedBadge}>
                <Icon name="check-circle" size={16} color="#4CAF50" />
                <Text style={styles.validatedText}>Card Complete</Text>
              </View>
            )}
          

          <TouchableOpacity
            style={[styles.payButton, (loading) && styles.disabledButton]}
            onPress={handlePayment}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.payButtonText}>Pay ${selectedOption.amount}</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.secureText}>
            <Icon name="lock" size={14} color="#457B9D" /> Secure Payment via Stripe
          </Text>
        </View>
      </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    position: "absolute",
    top: 25,
    left: 16,
    zIndex: 10,
  },
  backButtonText: {
    fontSize: 45,
    color: "#000",
    fontWeight: "bold",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 60,
    color: "#1D3557",
    textAlign: "center",
  },
  doubtSummary: {
    backgroundColor: "#F1FAEE",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1D3557",
    marginBottom: 5,
  },
  summaryText: {
    fontSize: 14,
    color: "#333",
  },
  summaryLabel: {
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1D3557",
    marginTop: 10,
    marginBottom: 15,
  },
  paymentOption: {
    backgroundColor: "#F1FAEE",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedPaymentOption: {
    borderColor: "#1D3557",
    backgroundColor: "#A8DADC",
  },
  paymentOptionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  paymentOptionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1D3557",
  },
  selectedPaymentOptionText: {
    color: "#1D3557",
  },
  featuresContainer: {
    marginTop: 5,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  featureIcon: {
    marginRight: 5,
  },
  featureText: {
    fontSize: 14,
    color: "#333",
  },
  cardContainer: {
    backgroundColor: "#F1FAEE",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    position: "relative",
  },
  cardField: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 10,
  },
  cardFieldContainer: {
    height: 50,
    marginVertical: 10,
    borderWidth: 2,
    borderColor: 'red',
  },
  inputError: {
    borderColor: "#E53935",
  },
  errorText: {
    color: "#E53935",
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    width: "48%",
  },
  payButton: {
    backgroundColor: "#1D3557",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 5,
    marginBottom: 10,
  },
  disabledButton: {
    backgroundColor: "#A0AEC0",
  },
  payButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  secureText: {
    textAlign: "center",
    color: "#457B9D",
    marginTop: 10,
    marginBottom: 20,
  },
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1D3557",
    marginTop: 20,
    marginBottom: 10,
  },
  successText: {
    fontSize: 16,
    color: "#457B9D",
    textAlign: "center",
    marginBottom: 20,
  },
  successSpinner: {
    marginTop: 20,
  },
  validatedBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#E8F5E9",
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  validatedText: {
    color: "#4CAF50",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 5,
  },
})

export default PaymentScreen