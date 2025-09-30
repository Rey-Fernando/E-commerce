import { Link } from 'react-router-dom'
import useCartStore from '../store/cartStore'
import formatCurrency from '../utils/formatCurrency'

function CartDrawer () {
  const isOpen = useCartStore(state => state.isOpen)
  const items = useCartStore(state => state.items)
  const closeCart = useCartStore(state => state.closeCart)
  const removeItem = useCartStore(state => state.removeItem)
  const incrementItem = useCartStore(state => state.incrementItem)
  const decrementItem = useCartStore(state => state.decrementItem)
  const subtotal = useCartStore(state => state.getSubtotal())

  if (!isOpen) return null

  return (
    <div className="cart-overlay" onClick={closeCart}>
      <aside className="cart-drawer" onClick={event => event.stopPropagation()}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Carrito</h2>
          <button className="btn-outline" type="button" onClick={closeCart}>Cerrar</button>
        </header>

        <div className="cart-items">
          {items.length === 0 && (
            <p className="empty-cart">Tu carrito está vacío</p>
          )}

          {items.map(({ product, quantity }) => (
            <article className="cart-item" key={product._id}>
              <img src={product.imageUrl} alt={product.name} />
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 0.25rem 0' }}>{product.name}</h3>
                <p style={{ margin: 0, color: '#6b7280' }}>{formatCurrency(product.price)}</p>
                <div className="cart-item-actions">
                  <button className="btn-outline" onClick={() => decrementItem(product._id)}>-</button>
                  <span>{quantity}</span>
                  <button className="btn-outline" onClick={() => incrementItem(product._id)}>+</button>
                  <button className="btn-outline" onClick={() => removeItem(product._id)}>Eliminar</button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <footer className="cart-footer">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Total</span>
            <strong>{formatCurrency(subtotal)}</strong>
          </div>
          <Link to="/checkout" className="btn-primary" onClick={closeCart}>Ir a pagar</Link>
        </footer>
      </aside>
    </div>
  )
}

export default CartDrawer
