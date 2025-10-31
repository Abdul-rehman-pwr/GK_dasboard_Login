'use client'

import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import FormSection from '@/components/form-section'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, FormProvider } from 'react-hook-form'
import { useSearchParams, useRouter } from 'next/navigation'
import { addPharmacySchema, cannaleoUpdatePharmacySchema } from '../add/validationSchema'
import { useLocale, useTranslations } from 'next-intl'
import LoadingFallback from '@/components/shared/loading'
import getLocalizedURL from '@/utils/getLocalizedUrl'
import toast from 'react-hot-toast'
import pharmacyServices from '@/services/pharmacy-services'
import PageHeader from '@/components/shared/page-header'
import { extractPharmacyData } from './payloadGenerator'
import addPharmacyDefaultValues from '../add/default-fields'
import { usePharmacyFormSections } from '@/@core/form-fields/add-pharmacy'
import { PERMISSIONS } from '@/utils/permissions'
import CanView from '@/@core/components/can/can-view'
import NotAuthorized from '@/views/NotAuthorized'

{
  /* WE WILL UNCOMMENT THIS AFTER THE DEMO */
}
// import PriceBracketsSection from './priceBracketSection'

const EditPharmacyView = () => {
  const [pharmacy, setPharmacy] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [unAuth, setUnAuth] = useState(false)
  const [cannaleo, setCannaleo] = useState(false)
  const searchParams = useSearchParams()
  const pharmacyId = searchParams.get('pharmacyId')
  const source = searchParams.get('source')
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
    resolver: yupResolver(source === 'cannaleo' ? cannaleoUpdatePharmacySchema : addPharmacySchema)
  })

  const { reset } = methods

  useEffect(() => {
    if (!source) return
    const fetchData = async () => {
      try {
        setLoading(true)

        const res = await pharmacyServices.getPharmacyById(pharmacyId, source)
        if (res?.status == 200 || res?.status == 201) {
          const pharmacyData = res.data
          const { userIds, ...restData } = pharmacyData
          restData.userId = userIds?.[0]
          if (pharmacyData.source === 'cannaleo') restData.pharmacyName = restData.cannabisPharmacyName
          setPharmacy(pharmacyData)
          const isCannaleo = pharmacyData.source === 'cannaleo'
          console.log(isCannaleo)
          setCannaleo(isCannaleo)
          setUnAuth(false)
          reset(restData)
        } else if (res?.status == 404) {
          setUnAuth(true)
          console.error('Failed to fetch pharmacy data:', res?.description || res?.data)
        } else {
          console.error('Failed to fetch pharmacy data:', res?.description || res?.data)
        }
      } catch (error) {
        console.error('Error fetching pharmacy data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (pharmacyId && source) {
      fetchData()
    }
  }, [pharmacyId, reset, source])

  const onSubmit = data => {
    const { userIds, ...restData } = data
    const payload = extractPharmacyData(restData)
    if (source === 'cannaleo') delete payload.pickup
    setSaving(true)
    const editPharmacyPromise = new Promise((resolve, reject) => {
      pharmacyServices
        .updatePharmacy(pharmacyId, payload)
        .then(response => {
          if (response?.status == 200) {
            setSaving(false)
            resolve(response.description || response.data || 'Pharmacy updated successfully')
            router.push(getLocalizedURL(locale, `pharmacy/list?source=${source}`))
          } else {
            setSaving(false)
            if (response?.data?.errors) {
              reject(response?.data?.errors[0] || 'Unexpected error')
            } else {
              reject(response.data || response.description || 'Unexpected error')
            }
          }
        })
        .catch(error => {
          setSaving(false)
          reject(error)
        })
    })

    toast.promise(editPharmacyPromise, {
      loading: t('savingPharmacy'),
      success: msg => msg,
      error: err => err
    })
  }

  if (loading) {
    return <LoadingFallback />
  }

  return (
    <>
      <FormProvider {...methods}>
        <PageHeader
          heading={pharmacy?.pharmacyName}
          breadcrumbs={[
            {
              label: t('home'),
              href: '/'
            },
            {
              label: t('pharmacies'),
              href: `/pharmacy/list?source=${source}`
            },
            {
              label: loading
                ? t('loadingButton')
                : pharmacy?.pharmacyName || pharmacy?.cannabisPharmacyName || t('noAccess')
            }
          ]}
        />
        {unAuth ? (
          <NotAuthorized />
        ) : (
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <Grid container spacing={6}>
              <Grid item xs={12} md={basicInformationSection.gridSize}>
                <FormSection {...basicInformationSection} cannaleo={cannaleo} />
              </Grid>
              <Grid item xs={12} md={addressSection.gridSize}>
                <FormSection {...addressSection} cannaleo={cannaleo} />
              </Grid>
              <Grid item xs={12} md={additionalDetailsSection.gridSize}>
                <FormSection
                  {...additionalDetailsSection}
                  cannaleo={cannaleo}
                  status={pharmacy?.pharmacyOnboardingStatus}
                />
              </Grid>
              <Grid item xs={12} md={shippingOptionsSection.gridSize}>
                <FormSection {...shippingOptionsSection} cannaleo={cannaleo} />
              </Grid>
              <CanView permission={PERMISSIONS.PHARMACY.SECTION.VIEW_FEES_AND_PRCIING}>
                <Grid item xs={12} md={feesPricingSection.gridSize}>
                  <FormSection {...feesPricingSection} cannaleo={cannaleo} />
                </Grid>
              </CanView>

              {/* WE WILL UNCOMMENT THIS AFTER THE DEMO */}
              {/* <Grid item xs={12} md={feesPricingSection.gridSize}>
            <PriceBracketsSection />
          </Grid> */}

              <Grid item xs={12}>
                <Button type='submit' variant='contained' disabled={saving}>
                  {t('savePharmacy')}
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </FormProvider>
    </>
  )
}

export default EditPharmacyView
