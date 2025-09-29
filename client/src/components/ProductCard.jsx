import useCartStore from '../store/cartStore'
import formatCurrency from '../utils/formatCurrency'

function ProductCard ({ product }) {
  const addItem = useCartStore(state => state.addItem)

  return (
    <article className="card">
      <img
        src={product.imageUrl}
        alt={product.name}
        style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px' }}
      />
      <span className="badge">{product.category}</span>
      <h3 style={{ margin: 0 }}>{product.name}</h3>
      <p style={{ margin: 0, color: '#6b7280', flex: 1 }}>{product.description}</p>
      <strong>{formatCurrency(product.price)}</strong>
      <button className="btn-primary" type="button" onClick={() => addItem(product)}>
        Agregar al carrito
      </button>
    </article>
  )
}

export default ProductCard
