import { create } from 'zustand'

const useCartStore = create((set, get) => ({
  items: [],
  isOpen: false,
  addItem: product => {
    const items = get().items
    const existingIndex = items.findIndex(item => item.product._id === product._id)

    if (existingIndex >= 0) {
      const updated = items.map((item, index) => index === existingIndex
        ? { ...item, quantity: Math.min(item.quantity + 1, product.stock ?? 99) }
        : item)
      set({ items: updated })
    } else {
      set({ items: [...items, { product, quantity: 1 }] })
    }
  },
  removeItem: productId => {
    set({ items: get().items.filter(item => item.product._id !== productId) })
  },
  incrementItem: productId => {
    const updated = get().items.map(item => item.product._id === productId
      ? { ...item, quantity: Math.min(item.quantity + 1, item.product.stock ?? 99) }
      : item)
    set({ items: updated })
  },
  decrementItem: productId => {
    const updated = get().items
      .map(item => item.product._id === productId
        ? { ...item, quantity: Math.max(item.quantity - 1, 0) }
        : item)
      .filter(item => item.quantity > 0)
    set({ items: updated })
  },
  clearCart: () => set({ items: [] }),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set(state => ({ isOpen: !state.isOpen })),
  getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
  getSubtotal: () => get().items.reduce((total, item) => total + (item.product.price * item.quantity), 0)
}))

export default useCartStore
