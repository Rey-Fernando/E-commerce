import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPaymentIntent } from '../../src/controllers/paymentController.js'

const mockCreate = vi.fn()

vi.mock('stripe', () => ({
  default: vi.fn(() => ({
    paymentIntents: {
      create: mockCreate
    }
  }))
}))

describe('paymentController.createPaymentIntent', () => {
  beforeEach(() => {
    mockCreate.mockReset()
    mockCreate.mockResolvedValue({ client_secret: 'secret_123' })
  })

  it('retorna 400 cuando faltan datos obligatorios', async () => {
    const status = vi.fn(() => ({ json: vi.fn() }))
    const res = { status }

    await createPaymentIntent({ body: { items: [] } }, res)

    expect(status).toHaveBeenCalledWith(400)
  })

  it('crea un intent de pago cuando el payload es válido', async () => {
    const json = vi.fn()
    const res = { json }
    const payload = {
      amount: 1500,
      items: [{ productId: 'abc', quantity: 2 }]
    }

    await createPaymentIntent({ body: payload }, res)

    expect(mockCreate).toHaveBeenCalledWith({
      amount: 1500,
      currency: 'mxn',
      automatic_payment_methods: { enabled: true },
      metadata: {
        items: JSON.stringify([{ id: 'abc', quantity: 2 }])
      }
    })
    expect(json).toHaveBeenCalledWith({ clientSecret: 'secret_123' })
  })
})
