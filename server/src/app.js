import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import 'express-async-errors'
import routes from './routes/index.js'
import { appConfig } from './config/env.js'
import errorHandler from './middlewares/errorHandler.js'

const app = express()

app.use(helmet())
app.use(cors({
  origin: appConfig.clientUrl,
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() })
})

app.use('/api', routes)

app.use(errorHandler)

export default app
