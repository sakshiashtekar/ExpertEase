// This would be on your backend server
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = "usd", email } = req.body

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe expects amount in cents
      currency,
      receipt_email: email,
      metadata: {
        integration_check: "accept_a_payment",
      },
    })

    // Send the client secret to the client
    res.json({
      clientSecret: paymentIntent.client_secret,
    })
  } catch (error) {
    console.error("Error creating payment intent:", error)
    res.status(500).json({ error: error.message })
  }
}
