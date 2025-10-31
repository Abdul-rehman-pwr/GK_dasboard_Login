export const calculateVATAmount = (unitPrice, quantity, vatPercentage) => {
  const price = parseFloat(unitPrice) || 0
  const qty = parseFloat(quantity) || 0
  const vat = parseFloat(vatPercentage) || 0

  return ((price * qty * vat) / 100).toFixed(2)
}
