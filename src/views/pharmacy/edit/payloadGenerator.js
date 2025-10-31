export function extractPharmacyData(data) {
  const fieldsToKeep = [
    'pharmacyName',
    'officialName',
    'domain',
    'email',
    'phoneNumber',
    'street',
    'plz',
    'city',
    'shipping',
    'express',
    'localCourier',
    'pickup',
    'shippingCostStandard',
    'expressCostStandard',
    'localCourierCostStandard',
    'source',
    'priorityRanking',
    'collectPointId',
    'collectPointName',
    'doctorFee',
    'platformFee',
    'priceBumpPercentage',
    'connectedAccountId',
    'userId',
    'vatId',
    'enabled',
    'country',
    'legalName'
  ]

  return fieldsToKeep.reduce((acc, key) => {
    if (key in data) {
      acc[key] = data[key]
    }
    return acc
  }, {})
}
