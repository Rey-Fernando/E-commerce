import mongoose from 'mongoose'
import { appConfig } from './env.js'

mongoose.set('strictQuery', true)

export const connectDatabase = async () => {
  if (!appConfig.mongoUri) {
    throw new Error('MONGODB_URI no est� configurado')
  }

  await mongoose.connect(appConfig.mongoUri)
  console.log('???  Conexi�n a MongoDB establecida')
}

export default mongoose
