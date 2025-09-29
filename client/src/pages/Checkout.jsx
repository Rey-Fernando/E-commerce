import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import useCartStore from '../store/cartStore'
import formatCurrency from '../utils/formatCurrency'
import { confirmOrder, createPaymentIntent } from '../services/api'

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#111827',
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '16px',
      '::placeholder': {
        color: '#9ca3af'
      }
    },
    invalid: {
      color: '#dc2626'
    }
  }
}

function Checkout () {
  const stripe = useStripe()
  const elements = useElements()
  const navigate = useNavigate()
  const items = useCartStore(state => state.items)
  const subtotal = useCartStore(state => state.getSubtotal())
  const clearCart = useCartStore(state => state.clearCart)

  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: ''
  })
  const [clientSecret, setClientSecret] = useState(null)
  const [loading, setLoading] = useState(false)
  const [intentLoading, setIntentLoading] = useState(false)
  const [error, setError] = useState(null)

  const cartSummary = useMemo(() => ({
    subtotal,
    shipping: subtotal > 1500 ? 0 : 119,
    total: subtotal + (subtotal > 1500 ? 0 : 119)
  }), [subtotal])

  useEffect(() => {
    const bootstrapPayment = async () => {
      if (!items.length) return
      setIntentLoading(true)
      setError(null)
      try {
        const payload = {
          items: items.map(({ product, quantity }) => ({
            productId: product._id,
            name: product.name,
            price: product.price,
            quantity
          })),
          amount: Math.round(cartSummary.total * 100)
        }
        const response = await createPaymentIntent(payload)
        setClientSecret(response.clientSecret)
      } catch (err) {
        setError('No se pudo inicializar el pago. Intenta más tarde.')
      } finally {
        setIntentLoading(false)
      }
    }

    bootstrapPayment()
  }, [items, cartSummary.total])

  const handleChange = event => {
    const { name, value } = event.target
    setCustomer(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async event => {
    event.preventDefault()
    if (!stripe || !elements || !clientSecret) return

    setLoading(true)
    setError(null)

    try {
      const cardElement = elements.getElement(CardElement)
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: customer.name,
            email: customer.email,
            phone: customer.phone
          }
        },
        shipping: {
          name: customer.name,
          address: {
            line1: customer.address,
            city: customer.city,
            postal_code: customer.zip,
            country: 'MX'
          }
        }
      })

      if (stripeError) {
        setError(stripeError.message)
        return
      }

      const orderPayload = {
        paymentIntentId: paymentIntent.id,
        items: items.map(({ product, quantity }) => ({
          product: product._id,
          quantity
        })),
        customer,
        amount: cartSummary.total
      }

      const { order } = await confirmOrder(orderPayload)
      clearCart()
      navigate(`/orden-exitosa/${order._id}`)
    } catch (err) {
      setError('No se pudo completar la orden. Revisa la información e intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (!items.length) {
    return <p>Tu carrito está vacío. Agrega productos para continuar.</p>
  }

  return (
    <section style={{ display: 'grid', gap: '2rem', gridTemplateColumns: '2fr 1fr' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h2>Datos del cliente</h2>
        <div>
          <label htmlFor="name">Nombre completo</label>
          <input id="name" name="name" type="text" required value={customer.name} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="email">Correo electrónico</label>
          <input id="email" name="email" type="email" required value={customer.email} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="phone">Teléfono</label>
          <input id="phone" name="phone" type="tel" required value={customer.phone} onChange={handleChange} />
        </div>

        <h2>Dirección de envío</h2>
        <div>
          <label htmlFor="address">Dirección</label>
          <input id="address" name="address" type="text" required value={customer.address} onChange={handleChange} />
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 2 }}>
            <label htmlFor="city">Ciudad</label>
            <input id="city" name="city" type="text" required value={customer.city} onChange={handleChange} />
          </div>
          <div style={{ flex: 1 }}>
            <label htmlFor="zip">Código postal</label>
            <input id="zip" name="zip" type="text" required value={customer.zip} onChange={handleChange} />
          </div>
        </div>

        <h2>Método de pago</h2>
        <div style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '12px', background: '#fff' }}>
          {intentLoading && <p>Preparando la pasarela de pago...</p>}
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>

        {error && <p style={{ color: '#dc2626' }}>{error}</p>}

        <button className="btn-primary" type="submit" disabled={!stripe || loading || intentLoading || !clientSecret}>
          {loading ? 'Procesando...' : `Pagar ${formatCurrency(cartSummary.total)}`}
        </button>
      </form>

      <aside className="card" style={{ position: 'sticky', top: '2rem', height: 'fit-content' }}>
        <h2>Resumen</h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {items.map(({ product, quantity }) => (
            <li key={product._id} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{product.name} x{quantity}</span>
              <span>{formatCurrency(product.price * quantity)}</span>
            </li>
          ))}
        </ul>
        <hr />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Subtotal</span>
          <strong>{formatCurrency(cartSummary.subtotal)}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Envío</span>
          <strong>{cartSummary.shipping === 0 ? 'Gratis' : formatCurrency(cartSummary.shipping)}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem' }}>
          <span>Total</span>
          <strong>{formatCurrency(cartSummary.total)}</strong>
        </div>
      </aside>
    </section>
  )
}

export default Checkout
