import { useTranslations } from 'next-intl'

const useCategoryOptions = () => {
  const t = useTranslations()
  const categoryOptions = [
    {
      value: 'sale_of_goods',
      heading: t('saleOfGoods'),
      description: t('saleOfGoodsDescription')
    },
    {
      value: 'sale_of_services',
      heading: t('salesOfServices'),
      description: t('salesOfServicesDescription')
    },
    {
      value: 'commissions',
      heading: t('commissions'),
      description: t('commissionsDescription')
    },
    {
      value: 'royalties_licensing',
      heading: t('royaltiesLicensing'),
      description: t('royaltiesLicensingDescription')
    },
    {
      value: 'real_estate_rental',
      heading: t('realEstateRental'),
      description: t('realEstateRentalDescription')
    }
  ]

  return {
    categoryOptions
  }
}

export default useCategoryOptions
