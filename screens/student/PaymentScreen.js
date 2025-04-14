"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import Icon from "react-native-vector-icons/FontAwesome"
import { StripeProvider, CardField, useStripe } from "@stripe/stripe-react-native"
import { useDatabase } from "../../context/DatabaseContext"

// You would replace this with your actual Stripe publishable key
const STRIPE_PUBLISHABLE_KEY = "pk_test_your_publishable_key_here"

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
  const navigation = useNavigation()
  const route = useRoute()
  const { doubtData } = route.params
  const { addNewDoubt } = useDatabase()
  const { initPaymentSheet, presentPaymentSheet, createPaymentMethod } = useStripe()

  const [selectedOption, setSelectedOption] = useState(PAYMENT_OPTIONS[0])
  const [cardDetails, setCardDetails] = useState(null)
  const [loading, setLoading] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const handleGoBack = () => {
    navigation.goBack()
  }

  // This would typically be a call to your backend to create a payment intent
  const fetchPaymentIntentClientSecret = async (amount) => {
    // Simulate API call to your backend
    return new Promise((resolve) => {
      setTimeout(() => {
        // Your backend would create a PaymentIntent and return the client secret
        resolve({ clientSecret: "mock_client_secret_from_your_backend" })
      }, 1000)
    })
  }

  const handlePayment = async () => {
    if (!cardDetails?.complete) {
      Alert.alert("Error", "Please enter complete card details")
      return
    }

    setLoading(true)

    try {
      // Get the amount to charge
      const amountToCharge = selectedOption.amount

      // Create a payment method
      const { paymentMethod, error } = await createPaymentMethod({
        type: "Card",
        billingDetails: {
          email: doubtData.email,
        },
      })

      if (error) {
        throw new Error(error.message)
      }

      // In a real implementation, you would:
      // 1. Send the payment method ID to your server
      // 2. Your server would create a PaymentIntent with Stripe
      // 3. Confirm the payment on the client

      // For this demo, we'll simulate a successful payment
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Create payment info object
      const paymentInfo = {
        amount: selectedOption.amount,
        paymentMethodId: paymentMethod.id,
        cardLast4: paymentMethod.card.last4,
        cardBrand: paymentMethod.card.brand,
      }

      // Add doubt to database
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
    } catch (error) {
      console.error("Payment error:", error)
      Alert.alert("Payment Failed", error.message || "There was an error processing your payment. Please try again.")
    } finally {
      setLoading(false)
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

  return (
    <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
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

          <View style={styles.cardContainer}>
            <CardField
              postalCodeEnabled={true}
              placeholder={{
                number: "4242 4242 4242 4242",
              }}
              cardStyle={styles.cardStyle}
              style={styles.cardField}
              onCardChange={setCardDetails}
            />
          </View>

          <TouchableOpacity
            style={[styles.payButton, (!cardDetails?.complete || loading) && styles.disabledButton]}
            onPress={handlePayment}
            disabled={!cardDetails?.complete || loading}
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
    </StripeProvider>
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
    fontSize: 25,
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
  },
  cardStyle: {
    backgroundColor: "#FFFFFF",
    textColor: "#1D3557",
    borderRadius: 10,
    fontSize: 16,
  },
  cardField: {
    width: "100%",
    height: 50,
    marginVertical: 10,
  },
  payButton: {
    backgroundColor: "#1D3557",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
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
})

export default PaymentScreen
