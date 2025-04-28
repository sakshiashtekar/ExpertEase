"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert, TextInput } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import Icon from "react-native-vector-icons/FontAwesome"
import { StripeProvider, useStripe } from "@stripe/stripe-react-native"
import { useDatabase } from "../../context/DatabaseContext"

// You would replace this with your actual Stripe publishable key
const STRIPE_PUBLISHABLE_KEY = "stripe-1234"

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
  const { createPaymentMethod } = useStripe()

  const [selectedOption, setSelectedOption] = useState(PAYMENT_OPTIONS[0])
  const [loading, setLoading] = useState(false)
  const [validating, setValidating] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [cardValidated, setCardValidated] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState(null)

  // Manual card input states
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvc, setCvc] = useState("")
  const [postalCode, setPostalCode] = useState("")

  // Validation states
  const [cardNumberError, setCardNumberError] = useState("")
  const [expiryDateError, setExpiryDateError] = useState("")
  const [cvcError, setCvcError] = useState("")

  const handleGoBack = () => {
    navigation.navigate("StudentDrawer", {
      screen: "StudentHome",
    });
  }

  // Format card number as user types (add spaces every 4 digits)
  const formatCardNumber = (text) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, "")
    // Add a space after every 4 digits
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, "$1 ")
    // Limit to 16 digits (19 chars with spaces)
    return formatted.slice(0, 19)
  }

  // Format expiry date as MM/YY
  const formatExpiryDate = (text) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, "")
    // Format as MM/YY
    if (cleaned.length > 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`
    }
    return cleaned
  }

  // Validate card number (basic Luhn algorithm check)
  const validateCardNumber = () => {
    const cleaned = cardNumber.replace(/\s/g, "")

    // Check if it's a valid test card number
    if (cleaned === "4242424242424242") {
      setCardNumberError("")
      return true
    }

    // Basic length check
    if (cleaned.length !== 16) {
      setCardNumberError("Card number must be 16 digits")
      return false
    }

    setCardNumberError("")
    return true
  }

  // Validate expiry date
  const validateExpiryDate = () => {
    if (!expiryDate.includes("/")) {
      setExpiryDateError("Invalid format")
      return false
    }

    const [month, year] = expiryDate.split("/")
    const currentYear = new Date().getFullYear() % 100 // Get last 2 digits of year
    const currentMonth = new Date().getMonth() + 1 // Months are 0-indexed

    if (Number.parseInt(month) < 1 || Number.parseInt(month) > 12) {
      setExpiryDateError("Invalid month")
      return false
    }

    if (
      Number.parseInt(year) < currentYear ||
      (Number.parseInt(year) === currentYear && Number.parseInt(month) < currentMonth)
    ) {
      setExpiryDateError("Card expired")
      return false
    }

    setExpiryDateError("")
    return true
  }

  // Validate CVC
  const validateCvc = () => {
    if (cvc.length < 3) {
      setCvcError("CVC must be at least 3 digits")
      return false
    }

    setCvcError("")
    return true
  }

  // Validate all card details
  const validateAllCardDetails = () => {
    const isCardNumberValid = validateCardNumber()
    const isExpiryDateValid = validateExpiryDate()
    const isCvcValid = validateCvc()

    return isCardNumberValid && isExpiryDateValid && isCvcValid
  }

  // Validate the card details
  const validateCard = async () => {
    console.log("Validating card details...")

    if (!validateAllCardDetails()) {
      Alert.alert("Error", "Please correct the card details")
      return
    }

    setValidating(true)

    try {
      // Parse expiry date
      const [expiryMonth, expiryYear] = expiryDate.split("/")

      // Create a payment method to validate the card
      console.log("Creating payment method...")
      const { paymentMethod: method, error } = await createPaymentMethod({
        type: "Card",
        card: {
          number: cardNumber.replace(/\s/g, ""),
          expMonth: Number.parseInt(expiryMonth),
          expYear: Number.parseInt(expiryYear) + 2000, // Convert YY to YYYY
          cvc: cvc,
        },
        billingDetails: {
          email: doubtData.email,
          postalCode: postalCode,
        },
      })

      if (error) {
        console.log("Error creating payment method:", error)
        throw new Error(error.message)
      }

      if (!method) {
        console.log("No payment method returned")
        throw new Error("Failed to create payment method")
      }

      console.log("Payment method created successfully:", method.id)

      // If we get here, the card is valid
      setCardValidated(true)
      setPaymentMethod(method)

      Alert.alert("Card Validated", `Card ending in ${method.card.last4} is valid. You can now proceed with payment.`)
    } catch (error) {
      console.error("Card validation error:", error)
      Alert.alert(
        "Validation Failed",
        error.message || "There was an error validating your card. Please check the details and try again.",
      )
    } finally {
      setValidating(false)
    }
  }

  const handlePayment = async () => {
    if (!cardValidated || !paymentMethod) {
      Alert.alert("Error", "Please validate your card details first")
      return
    }

    setLoading(true)

    try {
      // Get the amount to charge
      const amountToCharge = selectedOption.amount

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
            <Text style={styles.inputLabel}>Card Number</Text>
            <TextInput
              style={[styles.input, cardNumberError ? styles.inputError : null]}
              placeholder="4242 4242 4242 4242"
              value={cardNumber}
              onChangeText={(text) => setCardNumber(formatCardNumber(text))}
              keyboardType="numeric"
              maxLength={19}
              onBlur={validateCardNumber}
            />
            {cardNumberError ? <Text style={styles.errorText}>{cardNumberError}</Text> : null}

            <View style={styles.rowContainer}>
              <View style={styles.halfInput}>
                <Text style={styles.inputLabel}>Expiry Date</Text>
                <TextInput
                  style={[styles.input, expiryDateError ? styles.inputError : null]}
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                  keyboardType="numeric"
                  maxLength={5}
                  onBlur={validateExpiryDate}
                />
                {expiryDateError ? <Text style={styles.errorText}>{expiryDateError}</Text> : null}
              </View>

              <View style={styles.halfInput}>
                <Text style={styles.inputLabel}>CVC</Text>
                <TextInput
                  style={[styles.input, cvcError ? styles.inputError : null]}
                  placeholder="123"
                  value={cvc}
                  onChangeText={setCvc}
                  keyboardType="numeric"
                  maxLength={4}
                  onBlur={validateCvc}
                />
                {cvcError ? <Text style={styles.errorText}>{cvcError}</Text> : null}
              </View>
            </View>

            <Text style={styles.inputLabel}>Postal Code (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="12345"
              value={postalCode}
              onChangeText={setPostalCode}
              keyboardType="numeric"
              maxLength={10}
            />

            {cardValidated && (
              <View style={styles.validatedBadge}>
                <Icon name="check-circle" size={16} color="#4CAF50" />
                <Text style={styles.validatedText}>Card Validated</Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={[styles.validateButton, validating && styles.disabledButton]}
            onPress={validateCard}
            disabled={validating || cardValidated}
          >
            {validating ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.validateButtonText}>{cardValidated ? "Card Validated ✓" : "Validate Card"}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.payButton, (!cardValidated || loading) && styles.disabledButton]}
            onPress={handlePayment}
            disabled={!cardValidated || loading}
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
  inputLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1D3557",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    fontSize: 16,
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
  validateButton: {
    backgroundColor: "#457B9D",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 10,
  },
  validateButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
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
