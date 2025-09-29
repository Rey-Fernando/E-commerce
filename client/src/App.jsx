import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Catalog from './pages/Catalog'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'

function App () {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Catalog />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orden-exitosa/:orderId" element={<OrderConfirmation />} />
      </Routes>
    </Layout>
  )
}

export default App
