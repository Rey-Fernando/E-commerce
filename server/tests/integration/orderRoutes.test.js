import request from 'supertest'
import mongoose from 'mongoose'
import { MongoMemoryReplSet } from 'mongodb-memory-server'
import app from '../../src/app.js'
import Product from '../../src/models/Product.js'
import Order from '../../src/models/Order.js'

describe('POST /api/orders', () => {
  let mongo
  let product

  beforeAll(async () => {
    mongo = await MongoMemoryReplSet.create({
      replSet: { storageEngine: 'wiredTiger' }
    })
    await mongoose.connect(mongo.getUri())
  })

  afterAll(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    await mongo.stop()
  })

  beforeEach(async () => {
    await Order.deleteMany({})
    await Product.deleteMany({})
    product = await Product.create({
      name: 'Smartwatch Pulse X',
      description: 'Monitorea tu salud',
      category: 'Tecnología',
      price: 3299,
      imageUrl: 'https://example.com/watch.jpg',
      stock: 5
    })
  })

  it('crea una orden y descuenta inventario', async () => {
    const payload = {
      paymentIntentId: 'pi_123',
      amount: 3299,
      customer: {
        name: 'Ana Pérez',
        email: 'ana@example.com'
      },
      items: [
        {
          product: product._id.toString(),
          quantity: 1
        }
      ]
    }

    const response = await request(app)
      .post('/api/orders')
      .send(payload)

    expect(response.status).toBe(201)
    expect(response.body.order.items[0].product.name).toBe('Smartwatch Pulse X')

    const updatedProduct = await Product.findById(product._id)
    expect(updatedProduct.stock).toBe(4)
  })

  it('rechaza órdenes con stock insuficiente', async () => {
    const response = await request(app)
      .post('/api/orders')
      .send({
        paymentIntentId: 'pi_456',
        amount: 10000,
        customer: { name: 'Luis' },
        items: [{ product: product._id.toString(), quantity: 10 }]
      })

    expect(response.status).toBe(400)
    expect(response.body.message).toMatch(/Stock insuficiente/i)
  })
})
