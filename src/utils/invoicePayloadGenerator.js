import { parse } from 'date-fns'

const getVATCategoryCode = vatRate => {
  let rates = {
    Z: 0,
    S: 19,
    R: 7
  }

  return vatRate == 0 ? 'E' : 'S'
}

const getInvoiceTypeCode = () => {
  return 380
}

const getItemClassificationCode = category => {
  let categories = {
    sale_of_goods: 'AB',
    sale_of_services: 'SRV',
    real_estate_rental: 'AB',
    copyright_revenue: 'AB',
    donation: 'AB'
  }

  return categories[category] || 'ZZZ'
}

const getPaymentMeansCode = paymentMethod => {
  let methods = {
    credit_card: 54,
    bank_transfer: 42,
    defaultMethod: 1
  }
  return methods[paymentMethod] || ''
}
const getQuantityCode = quantityType => {
  let methods = {
    piece: 'H87',
    items: 'H87',
    hour: 'HUR',
    hours: 'HUR',
    day: 'DAY',
    days: 'DAY',
    kilogram: 'KGM',
    litre: 'LTR',
    meter: 'MTR',
    kilometers: 'KMT',
    square_meter: 'MTK',
    cubic_meter: 'MTQ',
    centimeter: 'CMT',
    millimeter: 'MMT',
    month: 'MON'
  }

  return methods[quantityType.toLowerCase()] || ''
}

const getQuantsityCode = quantityType => {
  let methods = {
    piece: 'H87',
    kilogram: 'KGM',
    litre: 'LTR',
    meter: 'MTR',
    square_meter: 'MTK',
    cubic_meter: 'MTQ',
    centimeter: 'CMT',
    millimeter: 'MMT',
    hour: 'HUR',
    day: 'DAY',
    month: 'MON'
  }
  return methods[quantityType] || ''
}

const getCurrencyIdCode = currency => {
  let currencies = {
    $: 'USD',
    '€': 'EUR',
    '£': 'GBP',
    '₹': 'INR',
    '¥': 'JPY',
    '₩': 'KRW',
    '₽': 'RUB'
  }
  return currencies[currency] || 'EUR'
}

const getTaxAmount = items => {
  return items.reduce((acc, item) => acc + item.priceOfItem * (Number(item?.vat) / 100), 0)
}
const getLegalMonetaryTotal = total => {
  let legalMonetaryTotal = Math.round(total * 100) / 100
  return legalMonetaryTotal
}

export const generateInvoicePayload = (data, supplierData, clientData, orderRefrence) => {
  const taxInclusiveAmount = Number(data.subTotal) + getTaxAmount(data.items)
  return {
    customizationId: 'urn:cen.eu:en16931:2017#compliant#urn:xeinkauf.de:kosit:xrechnung_3.0',
    profileId: 'urn:fdc:peppol.eu:2017:poacc:billing:01:1.0',
    id: data.invoiceId || data.id || 0,
    issueDate: data.issuedDate || data.issueDate || Date.now(),
    dueDate: data.dueDate || Date.now(),
    invoiceTypeCode: getInvoiceTypeCode(),
    note: data.note || 'No notes',
    taxPointDate: data.taxPointDate || Date.now(),
    documentCurrencyCode: getCurrencyIdCode(data.currency || '€'),
    buyerReference: data.buyerReference || 'N/A',

    orderReferenceDto: {
      id: orderRefrence?.reference || data.orderReferenceDto?.id || 0,
      salesOrderId: data.salesOrderId || data.orderReferenceDto?.salesOrderId || 'defaultSalesOrderId'
    },

    accountingSupplierPartyDto: {
      partyDto: {
        endpointIdDto: { schemeId: '0007', text: supplierData?.endpointText || '0' },
        partyNameDto: { name: supplierData?.companyName || 'Default Supplier' },
        postalAddressDto: {
          streetName: supplierData?.street || 'Default Street',
          cityName: supplierData?.state || 'Default City',
          postalZone: supplierData?.postalCode || 1,
          countryDto: { identificationCode: supplierData?.countryCode || 'DE' }
        },
        partyTaxSchemeDto: {
          companyId: supplierData?.companyId || 'defaultCompanyId',
          taxSchemeDto: { id: supplierData?.taxSchemeId || 'defaultTaxScheme' }
        },
        partyLegalEntityDto: {
          registrationName: supplierData?.companyName || 'Default Legal Name',
          companyID: supplierData?.companyID || 'defaultCompanyID',
          companyLegalForm: supplierData?.companyLegalForm || 'defaultLegalForm'
        },
        contactDto: {
          name: supplierData?.companyName || 'Default Contact',
          telephone: supplierData?.telephone || '0000000000',
          electronicMail: supplierData?.email || 'default@example.com'
        }
      }
    },

    accountingCustomerPartyDto: {
      customerPartyDto: {
        endpointIdDto: { schemeId: '0007', text: clientData?.endpointText || '0' },
        partyIdentificationDto: { id: clientData?.id || 'defaultClientId' },
        postalAddressDto: {
          streetName: clientData?.streetNameAndNumber || 'Default Street',
          cityName: clientData?.city || 'Default City',
          postalZone: parseInt(clientData?.postalCode) || 0,
          countryDto: { identificationCode: clientData?.countryCode || 'DE' }
        },
        customerPartyLegalEntityDto: { registrationName: clientData?.company || 'defaultCompany' },
        partyNameDto: { name: clientData?.name || 'Default Supplier' }
      }
    },

    paymentMeansDto: {
      paymentMeansCode: getPaymentMeansCode(orderRefrence?.paymentMethod || 'defaultMethod'),
      paymentId: data.paymentId || 'defaultPaymentId',
      payeeFinancialAccountDto: { id: data.payeeFinancialAccountDto?.id || 'defaultAccountId' }
    },

    paymentTermsDto: { note: data.note || 'No payment terms' },
    taxTotalDto: {
      taxAmountDto: {
        currencyId: getCurrencyIdCode(data.currency || '€'),
        value: data.items
          .reduce((sum, line) => {
            const taxableAmount = line.quantity * line.unitPrice
            const vatRate = Number(line.vat) || 0
            const taxAmount = vatRate === 0 ? 0 : (taxableAmount * vatRate) / 100
            return sum + taxAmount
          }, 0)
          .toFixed(2)
      },
      taxSubtotalDto: data.items.map(line => {
        const taxableAmount = line.quantity * line.unitPrice
        const vatRate = Number(line.vat) || 0
        const taxAmount = (vatRate === 0 ? 0 : (taxableAmount * vatRate) / 100).toFixed(2)

        return {
          taxableAmountDto: {
            currencyId: getCurrencyIdCode(data.currency || '€'),
            value: taxableAmount.toFixed(2)
          },
          taxAmountDto: {
            currencyId: getCurrencyIdCode(data.currency || '€'),
            value: vatRate === 0 ? 0 : taxAmount
          },
          taxCategoryDto: {
            id: getVATCategoryCode(vatRate),
            value: vatRate.toFixed(2),
            taxSchemeDto: { id: 'VAT' },
            ...(vatRate === 0
              ? {
                  taxExemptionReasonCode: { code: 'VATEX-EU-IC' },
                  taxExemptionReason: [{ value: 'Intra-community supply' }]
                }
              : {})
          }
        }
      })
    },

    legalMonetaryTotalDto: {
      lineExtensionAmountDto: {
        currencyID: getCurrencyIdCode(data.currency || '€'),
        value: data.items.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0).toFixed(2)
      },
      taxExclusiveAmountDto: {
        currencyID: getCurrencyIdCode(data.currency || '€'),
        value: Number(data.subTotal).toFixed(2)
      },
      taxInclusiveAmountDto: {
        currencyID: getCurrencyIdCode(data.currency || '€'),
        value: (Number(taxInclusiveAmount) || 0).toFixed(2)
      },
      payableAmountDto: {
        currencyID: getCurrencyIdCode(data.currency || '€'),
        value: (Number(taxInclusiveAmount) || 0).toFixed(2)
      }
    },
    invoiceLineDto:
      data.items?.map(line => ({
        id: line.id || 0,
        note: line.note || 'No line note',
        invoicedQuantityDto: {
          unitCode: getQuantityCode(line.unit || 'piece'),
          value: line.quantity || 0
        },
        lineExtensionAmountDto: {
          currencyID: getCurrencyIdCode(data.currency || '€'),
          value: (Number(line.priceOfItem) || 0)?.toFixed(2)
        },
        invoicePeriodDto: {
          startDate: line.startDate || Date.now(),
          endDate: line.endDate || Date.now()
        },
        orderLineReferenceDto: { lineId: line.orderLineId || 0 },
        itemDto: {
          name: line.name || 'Default Item Name',
          discount: line.discount || '0',
          vat: line.vat || 0,
          category: line.category || 'Default Category',
          noVatReason: line.noVatReason || 'Exempt from VAT',
          description: line.description || 'Default Description',
          sellersItemIdentificationDto: { id: line.sellersItemId || 0 },
          commodityClassificationDto: {
            itemClassificationCodeDto: {
              listId: getItemClassificationCode(line.category) || 'defaultListId',
              text: line.classificationText || 'Default Classification Text'
            }
          },
          classifiedTaxCategoryDto: {
            id: getVATCategoryCode(line.vat || 0),
            value: (line.vat === 0 ? 0 : Number(line.vat)).toFixed(2),
            taxSchemeDto: { id: 'VAT' },
            ...(line.vat === 0
              ? {
                  taxExemptionReasonCode: 'VATEX-EU-IC</cbc',
                  taxExemptionReason: 'Intra-community supply'
                }
              : {})
          }
        },
        priceDto: {
          priceAmountDto: {
            currencyID: getCurrencyIdCode(data.currency || '€'),
            value: (Number(line.unitPrice) || 0).toFixed(2) || '0.00'
          }
        }
      })) || []
  }
}

export const generateQuotePayload = (data, supplierData, clientData, orderRefrence) => {
  const taxInclusiveAmount = Number(data.subTotal) + getTaxAmount(data.items)

  return {
    customizationId: data.customizationId || '',
    profileId: data.profileId || '',
    id: data.invoiceId || data.id || '',
    issueDate: data.issuedDate || data.issueDate || Date.now(),
    dueDate: data.dueDate || Date.now(),
    invoiceTypeCode: getInvoiceTypeCode(),
    note: data.note || '',
    taxPointDate: data.taxPointDate || Date.now(),
    documentCurrencyCode: data.currency || data.documentCurrencyCode || '€',
    buyerReference: data.buyerReference || 'defaultBuyerRef',

    orderReferenceDto: {
      id: orderRefrence?.reference || data.orderReferenceDto?.id || 0,
      salesOrderId: data.salesOrderId || data.orderReferenceDto?.salesOrderId || 'defaultSalesOrderId'
    },

    accountingSupplierPartyDto: {
      partyDto: {
        endpointIdDto: {
          schemeId: '0007',
          text: supplierData?.endpointText || '0'
        },
        partyNameDto: {
          name: supplierData?.companyName || 'Default Supplier'
        },
        postalAddressDto: {
          streetName: supplierData?.street || 'Default Street',
          cityName: supplierData?.state || 'Default City',
          postalZone: supplierData?.postalCode || 1,
          countryDto: {
            identificationCode: supplierData?.countryCode || 'DE'
          }
        },
        partyTaxSchemeDto: {
          companyId: supplierData?.companyId || '',
          taxSchemeDto: {
            id: supplierData?.taxSchemeId || 'defaultTaxScheme'
          }
        },
        partyLegalEntityDto: {
          registrationName: supplierData?.companyName || 'Default Legal Name',
          companyID: supplierData?.companyID || '',
          companyLegalForm: supplierData?.companyLegalForm || ''
        },
        contactDto: {
          name: supplierData?.companyName || 'Default Contact',
          telephone: supplierData?.telephone || '0000000000',
          electronicMail: supplierData?.email || 'default@example.com'
        }
      }
    },

    accountingCustomerPartyDto: {
      customerPartyDto: {
        endpointIdDto: {
          schemeId: '0007',
          text: clientData?.endpointText || '0'
        },
        partyIdentificationDto: {
          id: clientData?.id || ''
        },
        postalAddressDto: {
          streetName: clientData?.streetNameAndNumber || 'Default Street',
          cityName: clientData?.city || 'Default City',
          postalZone: parseInt(clientData?.postalCode) || 0,
          countryDto: {
            identificationCode: clientData?.countryCode || 'DE'
          }
        },
        customerPartyLegalEntityDto: {
          registrationName: clientData?.company || ''
        },
        partyNameDto: {
          name: clientData.name || 'Default Supplier'
        }
      }
    },

    paymentMeansDto: {
      paymentMeansCode: getPaymentMeansCode(orderRefrence?.paymentMethod) || '',
      paymentId: data.paymentId || '',
      payeeFinancialAccountDto: {
        id: data.payeeFinancialAccountDto?.id || ''
      }
    },

    paymentTermsDto: {
      note: data.note || ''
    },

    taxTotalDto: {
      taxAmountDto: {
        currencyId: getCurrencyIdCode(data.currency || '€'),
        value: data.items
          .reduce((sum, line) => {
            const taxableAmount = line.quantity * line.unitPrice
            const vatRate = Number(line.vat) || 0
            const taxAmount = (taxableAmount * vatRate) / 100
            return sum + taxAmount
          }, 0)
          .toFixed(2)
      },
      taxSubtotalDto: data.items.map(line => {
        const taxableAmount = line.quantity * line.unitPrice
        const vatRate = Number(line.vat) || 0
        const taxAmount = ((taxableAmount * vatRate) / 100).toFixed(2)

        return {
          taxableAmountDto: {
            currencyId: getCurrencyIdCode(data.currency || '€'),
            value: taxableAmount.toFixed(2)
          },
          taxAmountDto: {
            currencyId: getCurrencyIdCode(data.currency || '€'),
            value: vatRate === 0 ? 0 : taxAmount
          },
          taxCategoryDto: {
            id: getVATCategoryCode(vatRate),
            value: vatRate.toFixed(2),
            taxSchemeDto: { id: 'VAT' },
            ...(vatRate === 0 ? { exemptionReasonText: line.noVatReason || 'Exempt from VAT' } : {})
          }
        }
      })
    },

    legalMonetaryTotalDto: {
      lineExtensionAmountDto: {
        currencyID: data.currency || '€',
        value: Number(data.subTotal) || 0
      },
      taxExclusiveAmountDto: {
        currencyID: data.currency || '€',
        value: Number(data.subTotal) || 0
      },
      taxInclusiveAmountDto: {
        currencyID: data.currency || '€',
        value: taxInclusiveAmount || 0
      },
      payableAmountDto: {
        currencyID: data.currency || '€',
        value: taxInclusiveAmount || 0
      }
    },
    invoiceLineDto:
      data.items?.map(line => ({
        id: line.id || 0,
        note: line.note || '',
        invoicedQuantityDto: {
          unitCode: getQuantityCode(line.unit || 'piece'),
          value: line.quantity || 0
        },
        lineExtensionAmountDto: {
          currencyID: line.currency || '€',
          value: line.priceOfItem || 0
        },
        invoicePeriodDto: {
          startDate: line.startDate || Date.now(),
          endDate: line.endDate || Date.now()
        },
        orderLineReferenceDto: {
          lineId: line.orderLineId || 0
        },
        itemDto: {
          name: line.name || 'Default Item',
          discount: line.discount || '0',
          vat: line.vat || null,
          category: line.category || '',
          noVatReason: line.noVatReason || '0',
          description: line.description || 'Default Description',
          sellersItemIdentificationDto: {
            id: line.sellersItemId || 0
          },
          commodityClassificationDto: {
            itemClassificationCodeDto: {
              listId: getItemClassificationCode(line.category) || '',
              text: line.classificationText || ''
            }
          },
          classifiedTaxCategoryDto: {
            id: getVATCategoryCode(line.vat || 0),
            value: line.vat || 0,
            taxSchemeDto: {
              id: 'VAT'
            }
          }
        },
        priceDto: {
          priceAmountDto: {
            currencyID: data.currency || '€',
            value: line.unitPrice || 0
          }
        }
      })) || [],

    cac: data.cac || 'defaultCac',
    cbc: data.cbc || 'defaultCbc',
    ubl: data.ubl || 'defaultUbl',
    xsi: data.xsi || 'defaultXsi',
    schemaLocation: data.schemaLocation || 'defaultSchemaLocation',
    text: data.text || 'defaultText'
  }
}
