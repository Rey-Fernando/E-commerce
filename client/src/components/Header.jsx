import { Link } from 'react-router-dom'
import useCartStore from '../store/cartStore'

function Header () {
  const totalItems = useCartStore(state => state.getTotalItems())
  const openCart = useCartStore(state => state.openCart)

  return (
    <header>
      <Link to="/" className="header-logo">Nova Shop</Link>
      <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Link to="/" className="btn-outline">Catálogo</Link>
        <Link to="/checkout" className="btn-outline">Checkout</Link>
        <button className="btn-primary" type="button" onClick={openCart}>
          Carrito ({totalItems})
        </button>
      </nav>
    </header>
  )
}

export default Header
