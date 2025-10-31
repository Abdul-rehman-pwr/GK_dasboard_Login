export const formatPrice = (val = '', locale = 'en-US') => {
  const number = Number(val)
  if (isNaN(number)) return '0.00'

  return number.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}
