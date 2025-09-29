import mongoose from 'mongoose'
import Order from '../models/Order.js'
import Product from '../models/Product.js'

export const createOrder = async (req, res) => {
  const { items, customer, paymentIntentId, amount } = req.body

  if (!Array.isArray(items) || !items.length) {
    return res.status(400).json({ message: 'Debes incluir productos en la orden.' })
  }

  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const productIds = items.map(item => item.product)
    const products = await Product.find({ _id: { $in: productIds } }).session(session)

    const orderItems = items.map(item => {
      const product = products.find(prod => prod._id.toString() === item.product)
      if (!product) {
        throw new Error('Producto no encontrado')
      }
      if (product.stock < item.quantity) {
        throw new Error(`Stock insuficiente para ${product.name}`)
      }

      product.stock -= item.quantity
      return {
        product: product._id,
        quantity: item.quantity,
        unitPrice: product.price
      }
    })

    const calculatedAmount = orderItems.reduce((total, item) => total + (item.unitPrice * item.quantity), 0)
    const orderAmount = Number(amount) || calculatedAmount

    if (Math.abs(orderAmount - calculatedAmount) > 1) {
      throw new Error('El monto enviado no coincide con el total calculado')
    }

    await Promise.all(products.map(product => product.save({ session })))

    const [order] = await Order.create([{
      items: orderItems,
      amount: calculatedAmount,
      customer,
      paymentIntentId,
      status: 'paid'
    }], { session })

    await session.commitTransaction()

    const populatedOrder = await Order.findById(order._id).populate('items.product')

    res.status(201).json({ order: populatedOrder })
  } catch (error) {
    await session.abortTransaction()
    error.statusCode = 400
    throw error
  } finally {
    session.endSession()
  }
}

export const getOrder = async (req, res) => {
  const { orderId } = req.params
  const order = await Order.findById(orderId).populate('items.product')
  if (!order) {
    return res.status(404).json({ message: 'Orden no encontrada' })
  }
  res.json({ order })
}
