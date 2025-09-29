const formatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN'
})

function formatCurrency (amount) {
  return formatter.format(amount || 0)
}

export default formatCurrency
