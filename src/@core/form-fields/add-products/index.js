import { PERMISSIONS } from '@/utils/permissions'
import { useTranslations } from 'next-intl'

export function useProductFormSections() {
  const t = useTranslations()

  const basicInformationSection = {
    title: t('basicInformationTitle'),
    gridSize: 12,
    style: { minHeight: 300 },
    fields: [
      { name: 'name', label: 'Product Name', required: true, type: 'text', validation: { required: 'Required' } },
      { name: 'productNumber', label: 'Product Number', type: 'text' },
      { name: 'productId', label: 'Product ID*', type: 'text', disabled: true, validation: { required: 'Required' } },
      { name: 'genetic', label: 'Genetic*', type: 'text' },
      { name: 'strain', label: 'Strain', type: 'text' },
      { name: 'dominance', label: 'Dominance', type: 'text' },
      { name: 'category', label: 'Category', type: 'text' },
      {
        name: 'priorityRanking',
        label: t('priorityRankingLabel'),
        type: 'number',
        validation: {
          required: 'Required'
        }
      },
      { name: 'isNew', label: t('new'), type: 'switch' }
    ]
  }

  const originAndSpecsSection = {
    title: 'Origin & Specifications',
    gridSize: 6,
    style: { minHeight: 300 },
    fields: [
      { name: 'country', label: 'Country', type: 'text' },
      { name: 'thc', label: 'THC %*', type: 'number' },
      { name: 'cbd', label: 'CBD %*', type: 'number' },
      { name: 'irradiated', label: 'Irradiated (%)', type: 'number' }
    ]
  }

  const pricingSection = {
    title: 'Pricing',
    gridSize: 6,
    style: { minHeight: 300 },
    fields: [
      { name: 'price', label: 'Current Price (€)', type: 'number' },
      { name: 'originalPrice', label: 'Original Price (€)', type: 'number' },
      { name: 'availability', label: 'Availability', type: 'switch' }
    ]
  }

  const shippingSection = {
    title: 'Shipping',
    gridSize: 12,
    style: { minHeight: 300 },
    fields: [
      { name: 'isStandardDelivery', label: 'Standard Delivery Available', type: 'switch', gridSize: 12 },
      { name: 'shippingCostStandard', label: 'Standard Shipping Cost (€)', type: 'number', gridSize: 12 }
    ]
  }

  const manufacturerSection = {
    title: 'Manufacturing Details',
    gridSize: 6,
    style: { minHeight: 355 },
    fields: [
      { name: 'manufacturer', label: 'Manufacturer', type: 'text', gridSize: 12 },
      { name: 'grower', label: 'Grower', type: 'text', gridSize: 12 },
      { name: 'vendor', label: 'Vendor', type: 'text', gridSize: 6 },
      {
        name: 'source',
        label: 'Source',
        type: 'select',
        gridSize: 6,
        options: [{ label: 'Custom', value: 'custom' }]
      }
    ]
  }

  return {
    basicInformationSection,
    originAndSpecsSection,
    pricingSection,
    shippingSection,
    manufacturerSection
  }
}
