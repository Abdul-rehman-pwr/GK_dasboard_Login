import { useTranslations } from 'next-intl'

const useCompanyFields = () => {
  const t = useTranslations()

  const accountTypeOptions = ['FREELANCE', 'TRADER']
  const activityOptions = ['PRIMARY_ACTIVITY', 'SECONDARY_ACTIVITY']

  const formFields = [
    { name: 'companyName', label: `${t('companyName')}*`, type: 'text', required: true },
    {
      name: 'isThisPrimaryActivity',
      label: `${t('activityType')}*`,
      type: 'select',
      options: [
        {
          label: `${t('primaryActivity')}*`,
          value: 'PRIMARY_ACTIVITY'
        },
        {
          label: `${t('secondaryActivity')}*`,
          value: 'SECONDARY_ACTIVITY'
        }
      ],
      required: true
    },
    {
      name: 'companyAccountType',
      label: `${t('accountType')}*`,
      type: 'select',
      options: [
        { label: 'Freelance', value: 'FREELANCE' },
        { label: 'Trader', value: 'TRADER' }
      ],
      required: true
    },

    { name: 'state', label: `${t('state')}*`, type: 'text', required: true },
    { name: 'taxOffice', label: `${t('taxOffice')}*`, type: 'text', required: true },
    { name: 'iban', label: 'IBAN*', type: 'text', required: true },
    { name: 'bic', label: 'BIC*', type: 'text', required: true },
    { name: 'vatnumber', label: `${t('vatNumber')}*`, type: 'text', required: true }
  ]

  return {
    formFields
  }
}

export default useCompanyFields
