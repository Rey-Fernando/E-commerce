import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Checkout from './Checkout'
import useCartStore from '../store/cartStore'

vi.mock('@stripe/react-stripe-js', () => ({
  CardElement: () => <div data-testid="card-element" />,
  useStripe: () => null,
  useElements: () => null
}))

vi.mock('../services/api', () => ({
  createPaymentIntent: vi.fn().mockResolvedValue({ clientSecret: 'secret_123' }),
  confirmOrder: vi.fn().mockResolvedValue({ order: { _id: 'order_1' } }),
  fetchOrder: vi.fn()
}))

const initialState = useCartStore.getState()

describe('Checkout page', () => {
  beforeEach(() => {
    useCartStore.setState(initialState, true)
  })

  const renderWithRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>)

  it('avisa cuando el carrito está vacío', () => {
    renderWithRouter(<Checkout />)
    expect(screen.getByText('Tu carrito está vacío. Agrega productos para continuar.')).toBeInTheDocument()
  })

  it('muestra el resumen de compra cuando hay productos', () => {
    useCartStore.setState(state => ({
      ...state,
      items: [
        {
          product: {
            _id: '1',
            name: 'Botella Horizon',
            price: 649,
            imageUrl: '',
            stock: 10
          },
          quantity: 2
        }
      ]
    }))

    renderWithRouter(<Checkout />)

    expect(screen.getByText('Botella Horizon x2')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Pagar/ })).toBeDisabled()
  })
})
