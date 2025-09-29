import axios from 'axios'

const api = axios.create({
  baseURL: '/api'
})

export const fetchProducts = async (params = {}) => {
  const { data } = await api.get('/products', { params })
  return data
}

export const createPaymentIntent = async payload => {
  const { data } = await api.post('/payments/create-intent', payload)
  return data
}

export const confirmOrder = async payload => {
  const { data } = await api.post('/orders', payload)
  return data
}

export const fetchOrder = async orderId => {
  const { data } = await api.get(`/orders/${orderId}`)
  return data
}

export default api
