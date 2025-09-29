import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { connectDatabase } from '../config/database.js'
import Product from '../models/Product.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const seedProducts = async () => {
  await connectDatabase()
  const productsPath = path.join(__dirname, '..', 'data', 'products.json')
  const raw = await fs.readFile(productsPath, 'utf-8')
  const products = JSON.parse(raw)

  await Product.deleteMany({})
  const enriched = products.map(product => ({
    ...product,
    sku: product.sku || `SKU-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
  }))

  await Product.insertMany(enriched)
  console.log(`? ${products.length} productos insertados`)
}

seedProducts()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Error al ejecutar el seed', error)
    process.exit(1)
  })
