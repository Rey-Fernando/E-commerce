import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  unitPrice: {
    type: Number,
    required: true
  }
}, { _id: false })

const orderSchema = new mongoose.Schema({
  items: {
    type: [orderItemSchema],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  paymentIntentId: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    name: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    zip: String
  }
}, {
  timestamps: true
})

export default mongoose.model('Order', orderSchema)
