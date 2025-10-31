import { useTranslations } from 'next-intl'

const usePaymentOptions = () => {
  const t = useTranslations()

  let PAYMENT_METHODS = [
    {
      value: 'bank_transfer',
      label: t('otherBannk')
    },
    {
      value: 'credit_card',
      label: t('cashMethod')
    }
  ]

  return {
    PAYMENT_METHODS
  }
}

export default usePaymentOptions
