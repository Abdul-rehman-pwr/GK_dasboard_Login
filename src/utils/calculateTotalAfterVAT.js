export const calculateTotalAfterVAT = (quoteItems = []) => {
  try {
    if (!Array.isArray(quoteItems)) {
      console.error('calculateTotalAfterVAT expected an array but received:', quoteItems)
      return 0
    }

    const subtotal = quoteItems?.reduce((sum, item) => sum + parseFloat(item?.priceOfItem ?? 0), 0)
    let totalVAT = 0

    quoteItems?.forEach(item => {
      const priceOfItem = parseFloat(item?.priceOfItem ?? 0)
      const vatPercentage = parseFloat(item?.vat ?? 0)

      if (!isNaN(priceOfItem) && !isNaN(vatPercentage) && vatPercentage > 0) {
        totalVAT += (priceOfItem * vatPercentage) / 100
      }
    })

    return parseFloat((subtotal + totalVAT).toFixed(2))
  } catch (error) {
    console.error('Error in calculateTotalAfterVAT:', error)
    return 0
  }
}
