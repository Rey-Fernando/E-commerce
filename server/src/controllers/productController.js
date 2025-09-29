import Product from '../models/Product.js'

export const getProducts = async (req, res) => {
  const { search, category, minPrice, maxPrice } = req.query
  const filters = {}

  if (search) {
    filters.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ]
  }

  if (category) {
    filters.category = category
  }

  if (minPrice || maxPrice) {
    filters.price = {}
    if (minPrice) filters.price.$gte = Number(minPrice)
    if (maxPrice) filters.price.$lte = Number(maxPrice)
  }

  const productsPromise = Product.find(filters).sort({ createdAt: -1 })
  const categoriesPromise = Product.distinct('category')

  const [products, categories] = await Promise.all([productsPromise, categoriesPromise])

  res.json({ products, categories })
}

export const getProduct = async (req, res) => {
  const product = await Product.findById(req.params.productId)
  if (!product) {
    return res.status(404).json({ message: 'Producto no encontrado' })
  }
  res.json({ product })
}
