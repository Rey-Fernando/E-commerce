import { Router } from 'express'
import { createPaymentIntent, handleWebhook } from '../controllers/paymentController.js'

const router = Router()

router.post('/create-intent', createPaymentIntent)
router.post('/webhook', handleWebhook)

export default router
