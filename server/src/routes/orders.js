import { Router } from 'express'
import { createOrder, getOrder } from '../controllers/orderController.js'

const router = Router()

router.post('/', createOrder)
router.get('/:orderId', getOrder)

export default router
