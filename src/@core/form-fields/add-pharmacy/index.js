import { PERMISSIONS } from '@/utils/permissions'
import { useTranslations } from 'next-intl'

export function usePharmacyFormSections() {
  const t = useTranslations()

  const basicInformationSection = {
    title: t('basicInformationTitle'),
    gridSize: 12,
    style: { minHeight: 300 },
    fields: [
      {
        name: 'pharmacyName',
        label: `${t('pharmacyNameLabel')}`,
        required: true,
        type: 'text',
        validation: { required: t('requiredValidation') }
      },
      {
        name: 'legalName',
        label: `${t('legalName')}`,
        required: true,
        type: 'text',
        validation: { required: t('requiredValidation') }
      },
      {
        name: 'officialName',
        label: t('officialNameLabel'),
        type: 'text'
      },
      {
        name: 'domain',
        label: `${t('domainLabel')}`,
        required: true,
        type: 'text'
      },
      {
        name: 'email',
        label: t('emailLabel'),
        type: 'text'
      },
      {
        name: 'phoneNumber',
        label: `${t('phoneNumberLabel')}`,
        required: true,
        type: 'text'
      },
      {
        name: 'connectedAccountId',
        label: `${t('connectedAccountIdLabel')}`,
        required: false,
        type: 'text'
      },
      {
        name: 'vatId',
        label: `${t('VatId')}`,
        required: true,
        type: 'text'
      },
      {
        name: 'userId',
        label: t('pharmacyAdminLabel'),
        type: 'pharmacyAdminAutocomplete',
        permission: PERMISSIONS.PHARMACY.EDIT_PHARMACY_ADMIN,
        hideIfNoPermission: true,
        validation: { required: t('pharmacyAdminRequired') }
      },
      {
        name: 'country',
        label: t('countriesLabel'),
        type: 'countryAutocomplete',
        validation: { required: t('countryAdminRequired') }
      }
    ]
  }

  const addressSection = {
    title: t('addressTitle'),
    gridSize: 6,
    style: { minHeight: 300 },
    fieldGridSize: 12,
    fields: [
      {
        name: 'street',
        label: t('streetLabel'),
        type: 'text',
        gridSize: 12
      },
      {
        name: 'plz',
        label: `${t('plzLabel')}`,
        required: true,
        type: 'text',
        gridSize: 12
      },
      {
        name: 'city',
        label: t('cityLabel'),
        type: 'text',
        gridSize: 12
      }
    ]
  }

  const additionalDetailsSection = {
    title: t('additionalDetailsTitle'),
    gridSize: 6,
    style: { minHeight: 300 },
    fields: [
      {
        name: 'source',
        label: t('sourceLabel'),
        type: 'select',
        options: [
          { label: t('sourceOptionCustom'), value: 'custom' }
          // Uncomment and translate if you add more options
          // { label: t('sourceOptionCannaleo'), value: 'cannaleo' }
        ]
      },
      {
        name: 'priorityRanking',
        permission: PERMISSIONS.PHARMACY.FIELDS.EDIT_PRIORITY_RANKING,
        label: t('priorityRankingLabel'),
        type: 'number'
      },
      {
        name: 'collectPointId',
        permission: PERMISSIONS.PHARMACY.FIELDS.EDIT_COLLECT_POINT_ID,
        label: `${t('collectPointIdLabel')}`,
        type: 'text'
      },
      {
        name: 'collectPointName',
        permission: PERMISSIONS.PHARMACY.FIELDS.EDIT_COLLECT_POINT_NAME,
        label: t('collectPointNameLabel'),
        type: 'text'
      },
      {
        name: 'latitude',
        permission: PERMISSIONS.PHARMACY.FIELDS.EDIT_COLLECT_POINT_NAME,
        label: t('latitude'),
        type: 'number',
        required: true
      },
      {
        name: 'longitude',
        permission: PERMISSIONS.PHARMACY.FIELDS.EDIT_COLLECT_POINT_NAME,
        label: t('longitude'),
        type: 'number',
        required: true
      },
      {
        name: 'enabled',
        label: t('isEnabledLabel'),
        type: 'switch'
      }
    ]
  }

  const shippingOptionsSection = {
    title: t('shippingOptionsTitle'),
    gridSize: 12,
    style: { minHeight: 200 },
    fields: [
      {
        name: 'shippingCostStandard',
        label: ` ${t('shippingCostStandardLabel')}*`,
        permission: PERMISSIONS.PHARMACY.FIELDS.EDIT_SHOPPING_COST_STANDARD,
        type: 'number'
      },

      {
        name: 'expressCostStandard',
        label: `${t('expressCostStandardLabel')}*`,
        permission: PERMISSIONS.PHARMACY.FIELDS.EDIT_EXPRESS_COST_STANDARD,
        type: 'number'
      }
    ]
  }

  const feesPricingSection = {
    title: t('feesPricingTitle'),
    gridSize: 12,
    style: { minHeight: 200 },
    fields: [
      {
        name: 'doctorFee',
        label: `${t('doctorFeeLabel')}*`,
        type: 'number'
      },
      {
        name: 'platformFee',
        label: `${t('platformFeeLabel')}*`,
        type: 'number'
      },
      {
        name: 'priceBumpPercentage',
        label: t('priceBumpPercentageLabel'),
        type: 'number'
      }
    ]
  }

  return {
    basicInformationSection,
    addressSection,
    additionalDetailsSection,
    shippingOptionsSection,
    feesPricingSection
  }
}
