import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Catalog from './Catalog'

const mockSetFilters = vi.fn()
const mockUseProducts = vi.fn()

vi.mock('../hooks/useProducts', () => ({
  default: (...args) => mockUseProducts(...args)
}))

vi.mock('../components/ProductCard', () => ({
  default: ({ product }) => <div>{product.name}</div>
}))

describe('Catalog page', () => {
  beforeEach(() => {
    mockSetFilters.mockReset()
    mockUseProducts.mockReturnValue({
      products: [
        {
          _id: '1',
          name: 'Aud�fonos Nova',
          description: 'Audio premium',
          price: 1999,
          category: 'Tecnolog�a',
          imageUrl: ''
        }
      ],
      categories: ['Tecnolog�a'],
      loading: false,
      error: null,
      setFilters: mockSetFilters,
      filters: {}
    })
  })

  it('muestra el listado de productos', () => {
    render(<Catalog />)
    expect(screen.getByText('Aud�fonos Nova')).toBeInTheDocument()
  })

  it('aplica filtros cuando el usuario busca', () => {
    render(<Catalog />)

    fireEvent.change(screen.getByPlaceholderText('Buscar productos...'), {
      target: { value: 'aud�fonos' }
    })

    expect(mockSetFilters).toHaveBeenCalled()
  })
})
