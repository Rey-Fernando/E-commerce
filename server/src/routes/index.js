import { Router } from 'express'
import productRoutes from './products.js'
import orderRoutes from './orders.js'
import paymentRoutes from './payments.js'

const router = Router()

router.use('/products', productRoutes)
router.use('/orders', orderRoutes)
router.use('/payments', paymentRoutes)

export default router
