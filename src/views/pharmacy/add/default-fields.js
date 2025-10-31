import { DELIVREY_CHARGES } from '@/configs/app'

const addPharmacyDefaultValues = {
  pharmacyId: 0,
  pharmacyName: '',
  officialName: '',
  domain: '',
  email: '',
  phoneNumber: '',
  street: '',
  plz: '',
  city: '',
  shipping: '',
  shippingCostStandard: DELIVREY_CHARGES,
  express: '',
  expressCostStandard: DELIVREY_CHARGES,
  localCourier: '',
  source: 'custom',
  priorityRanking: 1,
  enabled: false,
  collectPointId: '',
  collectPointName: '',
  doctorFee: 14.99,
  platformFee: 0,
  priceBumpPercentage: 0,
  connectedAccountId: '',
  vatId: '',
  priceBrackets: []
}

export default addPharmacyDefaultValues
