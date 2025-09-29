import dotenv from 'dotenv'

dotenv.config()

const required = ['MONGODB_URI', 'STRIPE_SECRET_KEY']

const missing = required.filter(key => !process.env[key])

if (missing.length) {
  console.warn(`??  Variables de entorno faltantes: ${missing.join(', ')}`)
}

export const appConfig = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 4000,
  mongoUri: process.env.MONGODB_URI,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173'
}
