import { useEffect, useState } from 'react'
import { fetchProducts } from '../services/api'

function useProducts (initialFilters = {}) {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [filters, setFilters] = useState(initialFilters)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true
    const loadProducts = async () => {
      setLoading(true)
      try {
        const data = await fetchProducts(filters)
        if (!isMounted) return
        setProducts(data.products)
        setCategories(data.categories || [])
      } catch (err) {
        if (isMounted) setError(err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadProducts()
    return () => {
      isMounted = false
    }
  }, [filters])

  return {
    products,
    categories,
    loading,
    error,
    filters,
    setFilters
  }
}

export default useProducts
