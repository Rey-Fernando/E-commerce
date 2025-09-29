import Header from './Header'
import CartDrawer from './CartDrawer'

function Layout ({ children }) {
  return (
    <div>
      <Header />
      <main>
        {children}
      </main>
      <CartDrawer />
    </div>
  )
}

export default Layout
