import { useMemo } from 'react'
import ProductCard from '../components/ProductCard'
import useProducts from '../hooks/useProducts'

function Catalog () {
  const { products, categories, loading, error, setFilters, filters } = useProducts()

  const categoriesWithAll = useMemo(() => ['Todas', ...categories], [categories])

  const handleSearch = event => {
    const value = event.target.value
    setFilters(prev => ({ ...prev, search: value }))
  }

  const handleCategory = event => {
    const value = event.target.value
    setFilters(prev => ({ ...prev, category: value === 'Todas' ? undefined : value }))
  }

  return (
    <section>
      <header style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        <h1 style={{ marginBottom: 0 }}>Explora el catálogo</h1>
        <p style={{ color: '#6b7280', margin: 0 }}>Descubre productos seleccionados con envíos a todo México.</p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <input
            type="search"
            placeholder="Buscar productos..."
            defaultValue={filters?.search ?? ''}
            onChange={handleSearch}
            style={{ flex: '1 1 240px' }}
          />
          <select defaultValue={filters?.category ?? 'Todas'} onChange={handleCategory} style={{ width: '200px' }}>
            {categoriesWithAll.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </header>

      {loading && <p>Cargando productos...</p>}
      {error && <p>Hubo un error cargando los productos.</p>}

      {!loading && !error && (
        <div className="grid">
          {products.map(product => <ProductCard key={product._id} product={product} />)}
        </div>
      )}
    </section>
  )
}

export default Catalog
