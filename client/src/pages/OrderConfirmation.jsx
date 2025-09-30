import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import formatCurrency from '../utils/formatCurrency'
import { fetchOrder } from '../services/api'

function OrderConfirmation () {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const data = await fetchOrder(orderId)
        setOrder(data.order)
      } catch (err) {
        setError('No encontramos tu orden, pero tu pago podría haber sido exitoso. Contacta soporte con tu comprobante.')
      } finally {
        setLoading(false)
      }
    }

    loadOrder()
  }, [orderId])

  if (loading) return <p>Cargando detalles de la orden...</p>
  if (error) return <p>{error}</p>

  return (
    <section className="card">
      <h1>¡Gracias por tu compra!</h1>
      <p>Tu número de orden es <strong>{order._id}</strong>.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {order.items.map(item => (
          <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{item.product.name} x{item.quantity}</span>
            <span>{formatCurrency(item.product.price * item.quantity)}</span>
          </div>
        ))}
      </div>

      <hr />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>Total pagado</span>
        <strong>{formatCurrency(order.amount)}</strong>
      </div>

      <p>Enviaremos una confirmación a <strong>{order.customer.email}</strong>.</p>
      <Link to="/" className="btn-primary" style={{ textAlign: 'center' }}>Seguir comprando</Link>
    </section>
  )
}

export default OrderConfirmation
