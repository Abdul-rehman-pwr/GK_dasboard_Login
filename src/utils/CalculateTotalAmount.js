// export const calculateTotalInvoice = (invoiceLines = [], useItemDiscounts = false) => {
//   let totalDiscounted = 0
//   let totalVAT = 0

//   // Iterate through each invoice line
//   invoiceLines?.invoiceLineDto?.forEach(line => {
//     const pricePerUnit = parseFloat(line?.lineExtensionAmountDto?.value) || 0
//     const quantity = parseFloat(line?.invoicedQuantityDto?.value) || 0
//     let discountPercentage = parseFloat(line?.itemDto?.discount) || 0
//     let vatPercentage = parseFloat(line?.itemDto?.vat) || 0

//     // If useItemDiscounts is true, look for matching name in itemDiscounts
//     if (useItemDiscounts) {
//       const matchingDiscount = invoiceLines?.itemDiscounts?.find(item => item.name === line?.itemDto?.name)
//       if (matchingDiscount) {
//         // Override discount and vat from itemDiscounts
//         discountPercentage = matchingDiscount.discount || 0
//         vatPercentage = matchingDiscount.vat || 0
//       }
//     }
//     // Calculate the total price before VAT
//     const totalPrice = pricePerUnit * quantity

//     // Apply discount
//     const discountedPrice = totalPrice - (totalPrice * discountPercentage) / 100
//     totalDiscounted += discountedPrice

//     // Calculate VAT
//     const vatAmount = (discountedPrice * vatPercentage) / 100
//     totalVAT += vatAmount
//   })

//   // Calculate the total after VAT
//   const totalAfterVAT = totalDiscounted + totalVAT

//   return {
//     totalAfterVAT: totalAfterVAT.toFixed(2)
//   }
// }

export const calculateTotalInvoice = (invoiceData = {}, useItemDiscounts = false, isCreditNote = false) => {
  let totalDiscounted = 0
  let totalVAT = 0

  const lineItems = isCreditNote ? invoiceData?.creditLineDto || [] : invoiceData?.invoiceLineDto || []

  lineItems.forEach(line => {
    const pricePerUnit = parseFloat((line.priceDto?.priceAmountDto?.value || 0).toFixed(2)) || 0
    const quantity = parseFloat(isCreditNote ? line?.creditQuantityDto?.value : line?.invoicedQuantityDto?.value) || 0
    let discountPercentage = parseFloat(line?.itemDto?.discount) || 0
    let vatPercentage = parseFloat(line?.itemDto?.vat) || 0

    if (useItemDiscounts) {
      const matchingDiscount = invoiceData?.itemDiscounts?.find(item => item.name === line?.itemDto?.name)
      if (matchingDiscount) {
        discountPercentage = matchingDiscount.discount || 0
        vatPercentage = matchingDiscount.vat || 0
      }
    }

    const totalPrice = pricePerUnit * quantity

    const discountedPrice = totalPrice - (totalPrice * discountPercentage) / 100
    totalDiscounted += discountedPrice

    const vatAmount = (discountedPrice * vatPercentage) / 100
    totalVAT += vatAmount
  })

  const totalAfterVAT = totalDiscounted + totalVAT

  return {
    totalAfterVAT: totalAfterVAT.toFixed(2)
  }
}
