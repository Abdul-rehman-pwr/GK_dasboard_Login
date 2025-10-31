export const calculateTotalDiscount = items => {
  try {
    if (!Array.isArray(items)) {
      throw new Error('Invalid input: items should be an array')
    }

    let totalDiscount = items.reduce((acc, item) => {
      const unitPrice = Number(item?.unitPrice) || 0
      const quantity = Number(item?.quantity) || 0
      const discount = Number(item?.discount) || 0

      const itemPrice = unitPrice * quantity
      const itemDiscount = itemPrice * (discount / 100)

      return acc + itemDiscount
    }, 0)

    return totalDiscount.toFixed(2)
  } catch (error) {
    console.error('Error in calculateTotalDiscount:', error.message)
    return '0.00'
  }
}
