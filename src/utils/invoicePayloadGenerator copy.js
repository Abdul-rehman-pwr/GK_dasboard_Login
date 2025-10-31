import { parse } from 'date-fns'

const getVATCategoryCode = vatRate => {
  let rates = {
    Z: 0,
    S: 19,
    R: 7
  }
  return vatRate === rates.Z ? 'Z' : vatRate >= rates.S ? 'S' : vatRate >= rates.R ? 'R' : 'E'
}

const getInvoiceTypeCode = () => {
  return 380
}

const getItemClassificationCode = category => {
  let categories = {
    sale_of_goods: 'AAB',
    sale_of_services: 'SRV',
    real_estate_rental: 'RNT',
    copyright_revenue: 'WZ',
    donation: 'DNT'
  }

  return categories[category] || 'ZZZ'
}

const getPaymentMeansCode = paymentMethod => {
  let methods = {
    credit_card: 54,
    bank_transfer: 42
  }
  return methods[paymentMethod] || ''
}

const getQuantityCode = quantityType => {
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

const getTaxAmount = items => {
  return items.reduce((acc, item) => acc + item.priceOfItem * item?.quantity * (Number(item?.vat) / 100), 0)
}

export const generateInvoicePayload = (data, supplierData, clientData, orderRefrence) => {
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
          name: supplierData.companyName || 'Default Supplier'
        },
        postalAddressDto: {
          streetName: supplierData.street || 'Default Street',
          cityName: supplierData.state || 'Default City',
          postalZone: supplierData.postalCode || 1,
          countryDto: {
            identificationCode: supplierData.countryCode || 'DE'
          }
        },
        partyTaxSchemeDto: {
          companyId: supplierData.companyId || '',
          taxSchemeDto: {
            id: supplierData.taxSchemeId || 'defaultTaxScheme'
          }
        },
        partyLegalEntityDto: {
          registrationName: supplierData.companyName || 'Default Legal Name',
          companyID: supplierData.companyID || '',
          companyLegalForm: supplierData.companyLegalForm || ''
        },
        contactDto: {
          name: supplierData.companyName || 'Default Contact',
          telephone: supplierData.telephone || '0000000000',
          electronicMail: supplierData.email || 'default@example.com'
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
          name: clientData?.name || 'Default Supplier'
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
        currencyId: data.currency || '€',
        value: data.items?.reduce((acc, line) => acc + line.unitPrice * line.quantity * (line.vat / 100), 0) || 0
      },
      taxSubtotalDto:
        data.items?.map(line => ({
          taxableAmountDto: {
            currencyId: data.currency || '€',
            value: line.unitPrice * line.quantity || 0
          },
          taxAmountDto: {
            currencyId: data.currency || '€',
            value: line.unitPrice * line.quantity * (line.vat / 100) || 0
          },
          taxCategoryDto: {
            id: getVATCategoryCode(line.vat || 0),
            value: line.vat || 0,
            taxSchemeDto: {
              id: data.taxSchemeId || 'defaultTaxScheme'
            }
          }
        })) || []
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
          // unitCode: getQuantityCode(line.unit || 'piece'),
          unitCode: line.unit || '',
          value: line.quantity || 0
        },
        lineExtensionAmountDto: {
          currencyID: line.currency || '€',
          value: line.unitPrice || 0
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
            value: line.priceOfItem || 0
          }
        }
      })) || []
  }
}
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

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
        currencyId: data.currency || '€',
        value: data.taxAmount || 0
      },
      taxSubtotalDto: {
        taxableAmountDto: {
          currencyId: data.currency || '€',
          value: data.taxableAmount || 0 // quantity x unit price
        },
        taxAmountDto: {
          currencyId: data.currency || '€',
          value: data.taxAmount || 0 //taxableAmount x (vat/100)
        },
        // total tax percentage and getVATCategoryCode
        taxCategoryDto: {
          // item.vat
          id: getVATCategoryCode(data.taxPercent || 0),
          // item.vat
          value: data.taxPercent || 0,
          taxSchemeDto: {
            id: data.taxSchemeId || 'defaultTaxScheme'
          }
        }
      }
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
    // creditNotDTO
    invoiceLineDto:
      data.items?.map(line => ({
        id: line.id || 0,
        note: line.note || '',
        //creditedQuantyDto
        invoicedQuantityDto: {
          unitCode: getQuantityCode(line.unit || 'piece'),
          value: line.quantity || 0
        },
        lineExtensionAmountDto: {
          currencyID: line.currency || '€',
          value: line.unitPrice || 0
        },
        invoicePeriodDto: {
          startDate: line.startDate || Date.now(),
          endDate: line.endDate || Date.now()
        },
        orderLineReferenceDto: {
          lineId: line.orderLineId || 0
        },
        //
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
            value: line.priceOfItem || 0
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
