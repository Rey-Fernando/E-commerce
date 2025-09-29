import request from 'supertest'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import app from '../../src/app.js'
import Product from '../../src/models/Product.js'

describe('GET /api/products', () => {
  let mongo

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create()
    await mongoose.connect(mongo.getUri())
  })

  afterAll(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    await mongo.stop()
  })

  beforeEach(async () => {
    await Product.deleteMany({})
    await Product.insertMany([
      {
        name: 'Aud�fonos Inal�mbricos',
        description: 'Audio de alta fidelidad',
        category: 'Tecnolog�a',
        price: 1999,
        imageUrl: 'https://example.com/headphones.jpg',
        stock: 10
      },
      {
        name: 'Mochila Urbana',
        description: 'Comodidad diaria',
        category: 'Moda',
        price: 899,
        imageUrl: 'https://example.com/backpack.jpg',
        stock: 15
      }
    ])
  })

  it('devuelve listado de productos y categor�as', async () => {
    const response = await request(app).get('/api/products')

    expect(response.status).toBe(200)
    expect(response.body.products).toHaveLength(2)
    expect(response.body.categories).toEqual(expect.arrayContaining(['Tecnolog�a', 'Moda']))
  })

  it('filtra productos por categor�a y b�squeda', async () => {
    const response = await request(app)
      .get('/api/products')
      .query({ category: 'Tecnolog�a', search: 'Aud�fonos' })

    expect(response.status).toBe(200)
    expect(response.body.products).toHaveLength(1)
    expect(response.body.products[0].category).toBe('Tecnolog�a')
  })
})
