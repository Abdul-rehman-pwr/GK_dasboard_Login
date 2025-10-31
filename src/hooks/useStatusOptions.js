import { useTranslations } from 'next-intl'

const useStatusOptions = () => {
  const t = useTranslations()

  const statusOptions = [
    { value: 'NOT_SENT', label: t('notSent') },
    { value: 'SENT_BUT_NOT_PAID', label: t('sentButNotPaid') },
    { value: 'PAID', label: t('paid') }
  ]

  const quoteStatusStyle = status => {
    switch (status) {
      case 'SENT':
        return { label: t('sent'), color: '#2A9D8F', bgColor: '#D4F4E4' }
      case 'NOT_SENT':
        return { label: t('notSent'), color: '#E9B824', bgColor: '#FFF5CC' }
      case 'APPROVED':
        return { label: t('approved'), color: '#2D6A4F', bgColor: '#D8F3DC' }
      case 'REJECTED':
        return { label: t('rejected'), color: '#D62828', bgColor: '#FFD6D6' }
      default:
        return { label: 'Unknown', color: '#E76F51', bgColor: '#FFE4C4' }
    }
  }

  const invoiceStatuses = [...statusOptions, { value: 'SENT', label: t('sent') }]
  return {
    statusOptions,
    invoiceStatuses,
    quoteStatusStyle
  }
}

export default useStatusOptions
