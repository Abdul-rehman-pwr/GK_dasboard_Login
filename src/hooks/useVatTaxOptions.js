import { useTranslations } from 'next-intl'

const useVatTaxOptions = () => {
  const t = useTranslations()

  const VATCategoryOptions = [
    {
      value: 'subject_to_vat',
      heading: t('subjectToVat'),
      description: t('subjectToVatDescription')
    },
    {
      value: 'kleinunternehmer',
      heading: t('kleinunternehmer'),
      description: t('kleinunternehmerDescription')
    },
    {
      value: 'exempt_of_vat',
      heading: t('exemptOfVat'),
      description: t('exemptOfVatDescription')
    }
  ]

  return {
    VATCategoryOptions
  }
}

export default useVatTaxOptions
