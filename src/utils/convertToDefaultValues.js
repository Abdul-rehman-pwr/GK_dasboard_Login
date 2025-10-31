// export const convertToDefaultValues = data => {
//   return {
//     invoiceId: data.id || '1',
//     issuedDate: data.issueDate || '',
//     dueDate: data.dueDate || '',
//     deliveryDate: data.deliveryDate || new Date(),
//     invoiceStatus: data?.invoiceStatus,
//     quoteStatus: data?.quoteStatus,
//     note: data?.paymentTermsDto?.note || '',
//     locked: data.locked,
//     customer: data.accountingCustomerPartyDto?.customerPartyDto?.partyIdentificationDto?.id || '',
//     items: data.invoiceLineDto?.map(line => ({
//       name: line.itemDto?.name || 'Default Item',
//       description: line.itemDto?.description || 'Default Description',
//       // vat: line.itemDto?.vat || 0,
//       vat:
//         line.itemDto?.vat ?? data?.itemDiscounts?.find(discount => discount.name === line.itemDto?.name)?.vat ?? null,
//       noVatReason:
//         line.itemDto?.noVatReason ??
//         data?.itemDiscounts?.find(discount => discount.name === line.itemDto?.name)?.noVatReason ??
//         '',
//       unitPrice: line.lineExtensionAmountDto?.value || 0,
//       quantity: line.invoicedQuantityDto?.value || 1,
//       priceOfItem: line.priceDto?.priceAmountDto?.value || 0,
//       category:
//         line.itemDto?.category ||
//         data?.itemDiscounts?.find(discount => discount?.name === line?.itemDto?.name)?.category ||
//         '',
//       unit: line.invoicedQuantityDto?.unitCode || '',
//       discount:
//         line.itemDto?.discount ||
//         data?.itemDiscounts?.find(discount => discount?.name === line?.itemDto?.name)?.discount
//     })) || [
//       {
//         categoryName: 'App Design',
//         unitPrice: 0,
//         quantity: 1,
//         priceOfItem: 0,
//         discount: 0
//       }
//     ],
//     subTotal: data.legalMonetaryTotalDto?.lineExtensionAmountDto?.value || 0,
//     discount: data?.itemDiscounts?.reduce((total, item) => total + (item.discount || 0), 0),
//     tax: data.legalMonetaryTotalDto?.taxInclusiveAmountDto?.value || 0,
//     total: data.legalMonetaryTotalDto?.payableAmountDto?.value || 0,
//     supplier: data.accountingSupplierPartyDto || {},
//     customerParty: data?.accountingCustomerPartyDto || 0,
//     templateId: data?.template?.id || 0,
//     styles: data?.templateCustomizedData || 0,
//     imageUrl: data?.imageUrl,
//     paymentMeans: data?.paymentMeansDto?.paymentMeansCode || '',
//     orderRefrence: data?.orderReferenceDto?.id || ''
//   }
// }

const getOriginalUnit = unitCode => {
  let reverseMethods = {
    H87: 'items', // Reverse mapping for 'piece'
    HUR: 'hours',
    DAY: 'days',
    KGM: 'kilogram',
    LTR: 'litre',
    MTR: 'meter',
    KMT: 'kiloMeters', // Reverse mapping for 'kilometers'
    MTK: 'square_meter',
    MTQ: 'cubic_meter',
    CMT: 'centimeter',
    MMT: 'millimeter',
    MON: 'month'
  }

  return reverseMethods[unitCode] || ''
}

const currencyMap = {
  $: 'USD',
  '€': 'EUR',
  '£': 'GBP',
  '₹': 'INR',
  '¥': 'JPY',
  '₩': 'KRW',
  '₽': 'RUB'
}

// Function to get Currency Code from Symbol
const getCurrencyIdCode = currency => currencyMap[currency] || 'EUR'

const getCurrencySymbol = code => Object.keys(getCurrencyIdCode).find(symbol => currencyMap[symbol] === code) || '€'

export const convertToDefaultValues = data => {
  const lineItems = data.invoiceLineDto || data.creditLineDto || [] // Handles both cases
  const quantityKey = data.invoiceLineDto ? 'invoicedQuantityDto' : 'creditQuantityDto' // Determines correct quantity key
  return {
    invoiceId: data.id || '1',
    issuedDate: data.issueDate || '',
    documentCurrencyCode: getCurrencySymbol(data?.documentCurrencyCode) || null,
    dueDate: data.dueDate || '',
    deliveryDate: data.deliveryDate || new Date(),
    invoiceStatus: data?.invoiceStatus,
    quoteStatus: data?.quoteStatus,
    note: data?.paymentTermsDto?.note || '',
    locked: data.locked,
    customer: data.accountingCustomerPartyDto?.customerPartyDto?.partyIdentificationDto?.id || '',
    items: lineItems.map(line => ({
      name: line.itemDto?.name || 'Default Item',
      description: line.itemDto?.description || 'Default Description',
      vat:
        line.itemDto?.vat ??
        data?.itemDiscounts?.find(discount => discount.name === line.itemDto?.name)?.vat ??
        line?.itemDto?.classifiedTaxCategoryDto?.value ??
        null,
      noVatReason:
        line.itemDto?.noVatReason ??
        data?.itemDiscounts?.find(discount => discount.name === line.itemDto?.name)?.noVatReason ??
        '',
      unitPrice: (line.priceDto?.priceAmountDto?.value || 0).toFixed(2),
      quantity: line[quantityKey]?.value || 1, // Uses correct key based on data type
      priceOfItem: line.lineExtensionAmountDto?.value || 0,
      category:
        line.itemDto?.category ||
        data?.itemDiscounts?.find(discount => discount?.name === line?.itemDto?.name)?.category ||
        '',
      // unit: line[quantityKey]?.unitCode || '',

      unit: getOriginalUnit(line[quantityKey]?.unitCode || ''),

      discount:
        line.itemDto?.discount ||
        data?.itemDiscounts?.find(discount => discount?.name === line?.itemDto?.name)?.discount ||
        0
    })) || [
      {
        categoryName: 'App Design',
        unitPrice: 0,
        quantity: 1,
        priceOfItem: 0,
        discount: 0
      }
    ],
    subTotal: data.legalMonetaryTotalDto?.lineExtensionAmountDto?.value || 0,
    discount: data?.itemDiscounts?.reduce((total, item) => total + (item.discount || 0), 0),
    tax: data.legalMonetaryTotalDto?.taxInclusiveAmountDto?.value || 0,
    total: data.legalMonetaryTotalDto?.payableAmountDto?.value || 0,
    supplier: data.accountingSupplierPartyDto || {},
    customerParty: data?.accountingCustomerPartyDto || 0,
    templateId: data?.template?.id || 0,
    styles: data?.templateCustomizedData || 0,
    imageUrl: data?.imageUrl,
    paymentMeans: data?.paymentMeansDto?.paymentMeansCode || '',
    orderRefrence: data?.orderReferenceDto?.id || ''
  }
}
