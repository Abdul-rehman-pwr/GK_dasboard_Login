// export const transformInvoiceToCredit = invoiceData => {
//   if (!invoiceData || typeof invoiceData !== 'object') return invoiceData
//   // Deep clone the object to avoid mutating the original
//   const transformedData = JSON.parse(JSON.stringify(invoiceData))

//   // Rename invoiceLineDto to creditLineDto
//   if (Array.isArray(transformedData.invoiceLineDto)) {
//     transformedData.creditLineDto = transformedData.invoiceLineDto.map(line => {
//       if (line && typeof line === 'object') {
//         const { invoicedQuantityDto, ...rest } = line
//         return {
//           ...rest,
//           creditQuantityDto: invoicedQuantityDto
//         }
//       }
//       return line
//     })
//     delete transformedData.invoiceLineDto
//   }

//   return transformedData
// }
export const transformInvoiceToCredit = invoiceData => {
  if (!invoiceData || typeof invoiceData !== 'object') return invoiceData

  // Deep clone the object to avoid mutating the original
  const transformedData = JSON.parse(JSON.stringify(invoiceData))

  // Map itemDiscounts by name for quick lookup
  const discountMap = new Map()
  if (Array.isArray(transformedData.itemDiscounts)) {
    transformedData.itemDiscounts.forEach(discount => {
      if (discount.name) {
        discountMap.set(discount.name, discount)
      }
    })
  }

  // Rename invoiceLineDto to creditLineDto and merge discount data into itemDto
  if (Array.isArray(transformedData.invoiceLineDto)) {
    transformedData.creditLineDto = transformedData.invoiceLineDto.map(line => {
      if (line && typeof line === 'object') {
        const { invoicedQuantityDto, ...rest } = line
        let { itemDto } = line // Use let instead of const

        // If itemDto has a name, check for a matching discount entry and merge it
        if (itemDto && itemDto.name && discountMap.has(itemDto.name)) {
          itemDto = {
            ...itemDto,
            ...discountMap.get(itemDto.name) // Merge discount info into itemDto
          }
        }

        return {
          ...rest,
          creditQuantityDto: invoicedQuantityDto,
          itemDto // Updated itemDto with discount info
        }
      }
      return line
    })
    delete transformedData.invoiceLineDto
  }

  return transformedData
}
