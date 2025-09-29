import Stripe from 'stripe'
import { appConfig } from '../config/env.js'

let stripeClient

const getStripe = () => {
  if (!appConfig.stripeSecretKey) {
    throw Object.assign(new Error('Configura STRIPE_SECRET_KEY en tu entorno'), { statusCode: 500 })
  }

  if (!stripeClient) {
    stripeClient = new Stripe(appConfig.stripeSecretKey, {
      apiVersion: '2023-10-16'
    })
  }

  return stripeClient
}

export const createPaymentIntent = async (req, res) => {
  const { amount, items } = req.body

  if (!amount) {
    return res.status(400).json({ message: 'El monto es requerido.' })
  }

  if (!items || !items.length) {
    return res.status(400).json({ message: 'Los productos son requeridos.' })
  }

  const stripe = getStripe()

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'mxn',
    automatic_payment_methods: {
      enabled: true
    },
    metadata: {
      items: JSON.stringify(items.map(item => ({ id: item.productId, quantity: item.quantity })))
    }
  })

  res.json({ clientSecret: paymentIntent.client_secret })
}

export const handleWebhook = (req, res) => {
  res.status(200).json({ received: true })
}
