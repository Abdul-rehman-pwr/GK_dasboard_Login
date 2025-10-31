export const USER_SERVICE_BASE_URL = 'https://bill-e-user-service-dev.internal.pwr.dev'

export const CORE_SERVICE_BASE_URL = 'https://bill-e-core-management-service-dev.internal.pwr.dev'

export const EMAIL_SERVICE_BASE_URL = 'https://bill-e-email-service-dev.internal.pwr.dev'

export const FRONTEND_BASE_URL = process.env.NEXT_PUBLIC_FRONTEND_BASE_URL

export const accountTypeId = 2
export const DELIVREY_CHARGES = 8.49

export const layoutToTemplateId = {
  Circle: 3,
  Straight: 4,
  Basic: 5,
  Rounded: 1
}
export const countries = [
  { label: 'Germany', value: 'germany' },
  { label: 'Portugal', value: 'portugal' },
  { label: 'France', value: 'france' },
  { label: 'Ukraine', value: 'ukraine' },
  { label: 'UK', value: 'uk' },
  { label: 'Italy', value: 'italy' },
  { label: 'Spain', value: 'spain' },
  { label: 'Netherlands', value: 'netherlands' },
  { label: 'Sweden', value: 'sweden' },
  { label: 'Poland', value: 'poland' },
  { label: 'Belgium', value: 'belgium' },
  { label: 'Austria', value: 'austria' },
  { label: 'Switzerland', value: 'switzerland' },
  { label: 'Norway', value: 'norway' },
  { label: 'Finland', value: 'finland' },
  { label: 'Denmark', value: 'denmark' },
  { label: 'Ireland', value: 'ireland' },
  { label: 'Australia', value: 'australia' },
  { label: 'USA', value: 'usa' }
]
export const currencyDetails = {
  USD: { symbol: '$', flag: 'us' },
  EUR: { symbol: '€', flag: 'eu' },
  GBP: { symbol: '£', flag: 'gb' },
  PKR: { symbol: '₨', flag: 'pk' },
  INR: { symbol: '₹', flag: 'in' },
  AUD: { symbol: 'A$', flag: 'au' },
  CAD: { symbol: 'C$', flag: 'ca' },
  CHF: { symbol: 'CHF', flag: 'ch' },
  SEK: { symbol: 'kr', flag: 'se' },
  NOK: { symbol: 'kr', flag: 'no' },
  DKK: { symbol: 'kr', flag: 'dk' },
  PLN: { symbol: 'zł', flag: 'pl' },
  HUF: { symbol: 'Ft', flag: 'hu' },
  CZK: { symbol: 'Kč', flag: 'cz' },
  RON: { symbol: 'lei', flag: 'ro' },
  BGN: { symbol: 'лв', flag: 'bg' },
  TRY: { symbol: '₺', flag: 'tr' },
  JPY: { symbol: '¥', flag: 'jp' },
  CNY: { symbol: '¥', flag: 'cn' }
}

export const getStatusStyle = status => {
  switch (status) {
    case 'SENT':
      return { label: 'Sent', color: '#2A9D8F', bgColor: '#D4F4E4' }
    case 'NOT_SENT':
      return { label: 'Not Sent', color: '#E9B824', bgColor: '#FFF5CC' }
    case 'APPROVED':
      return { label: 'Approved', color: '#2D6A4F', bgColor: '#D8F3DC' }
    case 'REJECTED':
      return { label: 'Rejected', color: '#D62828', bgColor: '#FFD6D6' }
    default:
      return { label: 'Unknown', color: '#E76F51', bgColor: '#FFE4C4' }
  }
}

export const USERTYPES = {
  admin: 1,
  doctor: 2,
  pharmacy_admin: 3
}

export const categories = [
  { id: 1, name: 'App Design' },
  { id: 2, name: 'App Customization' },
  { id: 3, name: 'ABC Template' },
  { id: 4, name: 'App Development' }
]
