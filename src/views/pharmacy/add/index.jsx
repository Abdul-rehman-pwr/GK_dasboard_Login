'use client'

import React, { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import FormSection from '@/components/form-section'
import { addPharmacySchema } from './validationSchema'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import getLocalizedURL from '@/utils/getLocalizedUrl'
import { useLocale, useTranslations } from 'next-intl'
import pharmacyServices from '@/services/pharmacy-services'
import PageHeader from '@/components/shared/page-header'
import addPharmacyDefaultValues from './default-fields'
import { usePharmacyFormSections } from '@/@core/form-fields/add-pharmacy'
const AddPharmacyView = () => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations()
  const {
    basicInformationSection,
    addressSection,
    additionalDetailsSection,
    shippingOptionsSection,
    feesPricingSection
  } = usePharmacyFormSections()
  const methods = useForm({
    defaultValues: addPharmacyDefaultValues,
    resolver: yupResolver(addPharmacySchema)
  })
  const { reset } = methods
  const onSubmit = data => {
    setLoading(true)
    const addPharmacyPromise = new Promise((resolve, reject) => {
      pharmacyServices
        .addPharmacy(data)
        .then(response => {
          if (response?.status == 200) {
            setLoading(false)
            resolve(response.data || response.description)
            reset()
            router.push(getLocalizedURL(locale, 'pharmacy/list?source=custom'))
          } else {
            setLoading(false)
            if (response?.data?.errors) {
              reject(response?.data?.errors[0] || 'Unexpected error')
            } else {
              reject(response.data || response.description || 'Unexpected error')
            }
          }
        })
        .catch(error => {
          setLoading(false)
          reject(error)
        })
    })

    toast.promise(addPharmacyPromise, {
      loading: t('savingPharmacy'),
      success: msg => msg,
      error: err => err
    })
  }

  return (
    <FormProvider {...methods}>
      <PageHeader
        heading={t('addPharmacy')}
        breadcrumbs={[
          {
            label: t('home'),
            href: '/'
          },
          {
            label: t('pharmacies'),
            href: '/pharmacy/list?source=custom'
          },
          {
            label: t('addPharmacy')
          }
        ]}
      />
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Grid container spacing={6}>
          <Grid item xs={12} md={basicInformationSection.gridSize}>
            <FormSection {...basicInformationSection} />
          </Grid>
          <Grid item xs={12} md={addressSection.gridSize}>
            <FormSection {...addressSection} />
          </Grid>
          <Grid item xs={12} md={additionalDetailsSection.gridSize}>
            <FormSection {...additionalDetailsSection} addPharmacy={true} />
          </Grid>
          <Grid item xs={12} md={shippingOptionsSection.gridSize}>
            <FormSection {...shippingOptionsSection} />
          </Grid>
          <Grid item xs={12} md={feesPricingSection.gridSize}>
            <FormSection {...feesPricingSection} />
          </Grid>

          <Grid item xs={12}>
            <Button type='submit' variant='contained' disabled={loading}>
              {t('savePharmacy')}
            </Button>
          </Grid>
        </Grid>
      </form>
    </FormProvider>
  )
}

export default AddPharmacyView
