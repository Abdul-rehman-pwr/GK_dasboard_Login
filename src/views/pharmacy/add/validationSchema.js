import * as yup from 'yup'

export const addPharmacySchema = yup.object().shape({
  pharmacyName: yup.string().required('Pharmacy name is required'),
  officialName: yup.string(),
  domain: yup
    .string()
    .matches(/^(?!:\/\/)([a-zA-Z0-9-_]+\.)+[a-zA-Z]{2,}$/, 'Must be a valid domain without http(s)://'),
  phoneNumber: yup.string().matches(/^\+[0-9]+$/, 'Enter phone number in international format, e.g. +1234567890'),
  plz: yup.string().matches(/^\d{5}$/, 'Must be a 5-digit postal code'),
  email: yup.string().email('Invalid email'),
  vatId: yup
    .string()
    .required('VAT ID is required')
    .matches(/^[A-Z]{2}\d{6,}$/, 'Invalid VAT ID format (e.g., DE123456)'),
  userId: yup
    .mixed()
    .test(
      'userId',
      'Please select a pharmacy admin',
      value => value === null || (typeof value === 'number' && !isNaN(value))
    )
    .required('Please select a pharmacy admin'),
  street: yup.string(),
  city: yup.string(),
  shippingCostStandard: yup
    .number()
    .transform((value, originalValue) => {
      return originalValue === '' ? null : value
    })
    .required('Standard Shipping Cost is required')
    .min(0, 'Must be greater than or equal to 0'),
  expressCostStandard: yup
    .number()
    .transform((value, originalValue) => {
      return originalValue === '' ? null : value
    })
    .required('Express Shipping Cost is required')
    .min(0, 'Must be greater than or equal to 0'),
  source: yup.string(),
  priorityRanking: yup
    .number()
    .transform((value, originalValue) => {
      return originalValue === '' ? null : value
    })
    .required('Priority Ranking is required')
    .integer('Priority Ranking must be an integer')
    .min(1, 'Priority Ranking must be greater than or equal to 1.')
    .max(500000, 'Priority Ranking must be lower than or equal to 500000'),
  enabled: yup.boolean(),
  collectPointName: yup.string(),
  doctorFee: yup
    .number()
    .transform((value, originalValue) => {
      return originalValue === '' ? null : value
    })
    .required('Doctor Fee is required')
    .min(0, 'Must be 0 or greater'),
  platformFee: yup
    .number()
    .transform((value, originalValue) => {
      return originalValue === '' ? null : value
    })
    .required('Platform Fee is required')
    .min(0, 'Must be 0 or greater'),
  priceBumpPercentage: yup
    .number()
    .transform((value, originalValue) => {
      return originalValue === '' ? null : value
    })
    .nullable()
    .min(0, 'Must be 0 or greater'),
  collectPointId: yup
    .string()
    .transform(value => (value === '' ? null : value)) // Treat "" as null
    .matches(/^[a-zA-Z0-9-]+$/, 'Only letters, numbers, and dashes are allowed')
    .nullable()
    .notRequired(),
  connectedAccountId: yup
    .string()
    .notRequired() // ✅ better than optional()
    .matches(/^[a-zA-Z0-9-_]+$/, 'Only letters, numbers, dashes, and underscores are allowed')
    .nullable()
    .transform((value, originalValue) => (originalValue === '' ? null : value)),
  images: yup.array(),
  country: yup.string().required('Please select a country'),
  legalName: yup.string().required('Legal name is required'),
  latitude: yup
    .number()
    .typeError('Latitude must be a number')
    .required('Latitude is required')
    .min(-90, 'Latitude must be greater than or equal to -90')
    .max(90, 'Latitude must be less than or equal to 90'),

  longitude: yup
    .number()
    .typeError('Longitude must be a number')
    .required('Longitude is required')
    .min(-180, 'Longitude must be greater than or equal to -180')
    .max(180, 'Longitude must be less than or equal to 180')
})

export const cannaleoUpdatePharmacySchema = yup.object().shape({
  vatId: yup
    .string()
    .required('VAT ID is required')
    .matches(/^[A-Z]{2}\d{6,}$/, 'Invalid VAT ID format (e.g., DE123456)'),

  priorityRanking: yup
    .number()
    .transform((value, originalValue) => {
      return originalValue === '' ? null : value
    })
    .required('Priority Ranking is required')
    .integer('Priority Ranking must be an integer')
    .min(1, 'Priority Ranking must be greater than or equal to 1.')
    .max(500000, 'Priority Ranking must be lower than or equal to 500000'),
  collectPointId: yup
    .string()
    .transform(value => (value === '' ? null : value)) // Treat "" as null
    .matches(/^[a-zA-Z0-9-]+$/, 'Only letters, numbers, and dashes are allowed')
    .nullable()
    .notRequired(),
  platformFee: yup
    .number()
    .transform((value, originalValue) => {
      return originalValue === '' ? null : value
    })
    .required('Platform Fee is required')
    .min(0, 'Must be 0 or greater'),
  doctorFee: yup
    .number()
    .transform((value, originalValue) => {
      return originalValue === '' ? null : value
    })
    .required('Doctor Fee is required')
    .min(0, 'Must be 0 or greater'),
  shippingCostStandard: yup
    .number()
    .transform((value, originalValue) => {
      return originalValue === '' ? null : value
    })
    .required('Standard Shipping Cost is required')
    .min(0, 'Must be greater than or equal to 0'),
  expressCostStandard: yup
    .number()
    .transform((value, originalValue) => {
      return originalValue === '' ? null : value
    })
    .required('Express Shipping Cost is required')
    .min(0, 'Must be greater than or equal to 0'),
  priceBumpPercentage: yup
    .number()
    .transform((value, originalValue) => {
      return originalValue === '' ? null : value
    })
    .nullable()
    .min(0, 'Must be 0 or greater'),
  country: yup.string().required('Please select a country'),
  legalName: yup.string().required('Legal name is required'),
  userId: yup
    .mixed()
    .test(
      'userId',
      'Please select a pharmacy admin',
      value => value === null || (typeof value === 'number' && !isNaN(value))
    )
    .required('Please select a pharmacy admin')
})

export const addProductSchema = t => {
  return yup.object().shape({
    // basic
    name: yup.string().required(t('nameRequired')),
    productId: yup
      .string()
      .required(t('productIdRequired'))
      .matches(/^[a-z0-9-]+$/, t('productIdPattern')),
    productNumber: yup
      .string()
      .nullable()
      .matches(/^[0-9.]*$/, t('productNumberPattern')),
    genetic: yup.string().required(t('geneticRequired')),
    strain: yup.string(),
    dominance: yup.string(),
    category: yup.string(),
    isNew: yup.boolean(),
    price: yup
      .number(t('priceMustBeNumber'))
      .transform((value, originalValue) => {
        return originalValue === '' ? null : value
      })
      .required(t('priceRequired'))
      .min(1, t('priceMin')),

    originalPrice: yup
      .number(t('originalPriceMustBeNumber'))
      .transform((value, originalValue) => {
        return originalValue === '' ? null : value
      })
      .required(t('originalPriceRequired'))
      .min(1, t('originalPriceMin')),
    availability: yup.boolean(),
    manufacturer: yup.string(),
    grower: yup.string(),
    vendor: yup.string().nullable(),
    source: yup.string(),
    country: yup.string(),
    thc: yup
      .number(t('thcMustBeNumber'))

      .transform((value, originalValue) => {
        return originalValue === '' ? null : value
      })
      .nullable()
      .required(t('thcRequired'))
      .min(0, t('thcMin'))
      .max(100, t('thcMax')),
    cbd: yup
      .number(t('cbdMustBeNumber'))

      .transform((value, originalValue) => {
        return originalValue === '' ? null : value
      })
      .nullable()
      .required(t('cbdRequired'))
      .min(0, t('cbdMin'))
      .max(100, t('cbdMax')),

    irradiated: yup
      .number(t('irradiatedMustBeNumber'))
      .transform((value, originalValue) => {
        return originalValue === '' ? null : value
      })
      .nullable()
      .min(0, t('irradiatedMin'))
      .max(100, t('irradiatedMax')),
    isStandardDelivery: yup.boolean(),
    shippingCostStandard: yup
      .number()
      .transform((value, originalValue) => {
        return originalValue === '' ? null : value
      })
      .nullable()
      .min(0, t('shippingCostStandardMin')),
    pharmacyName: yup.string(),
    pharmacyDomain: yup.string(),

    priorityRanking: yup
      .number()
      .required(t('priorityRankingRequired'))
      .transform((value, originalValue) => {
        return originalValue === '' ? null : value
      })
      .integer(t('priorityRankingMustBeInteger'))
      .min(1, t('priorityRankingMin'))
      .max(500000, t('priorityRankingMax')),
    pharmacyId: yup
      .number()
      .transform((value, originalValue) => {
        return originalValue === '' ? null : value
      })
      .required(t('pharmacyRequired'))
      .typeError(t('pharmacyRequired'))
      .moreThan(0, t('pharmacyRequired'))
  })
}
