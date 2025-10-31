import { useLocale } from 'next-intl'

export function useFormattedPrice() {
  const locale = useLocale()

  const formatPrice = (value = '') => {
    const number = Number(value)
    if (isNaN(number)) return '0.00'

    return number.toLocaleString(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  return { formatPrice }
}
