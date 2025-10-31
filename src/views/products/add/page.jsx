'use client'

import React, { useEffect, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import FormSection from '@/components/form-section'
import { useProductFormSections } from '@/@core/form-fields/add-products'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import getLocalizedURL from '@/utils/getLocalizedUrl'
import { useLocale, useTranslations } from 'next-intl'
import { addProductSchema } from '@/views/pharmacy/add/validationSchema'
import ProductImage from '@/views/products/add/ProductImage'
import productService from '@/services/productService'
import { Autocomplete, Card, CardContent, CardHeader, CircularProgress, MenuItem } from '@mui/material'
import otherService from '@/services/otherService'
import PharmacyAutoComplete from '@/views/products/add/PharmacyAutoComplete'
import PageHeader from '@/components/shared/page-header'
import { createSlug } from '@/utils/stringUtils'

const AddProductPage = () => {
  const router = useRouter()
  const locale = useLocale()
  const [files, setFiles] = useState([])
  const t = useTranslations()
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const source = searchParams.get('source' || 'custom')

  const { basicInformationSection, originAndSpecsSection, pricingSection, manufacturerSection } =
    useProductFormSections()

  const methods = useForm({
    defaultValues: {
      productId: '',
      name: '',
      genetic: '',
      country: '',
      thc: 0,
      cbd: 0,
      isNew: false,
      irradiated: 0,
      strain: '',
      category: '',
      availability: true,
      price: 0,
      originalPrice: 0,
      isStandardDelivery: true,
      shippingCostStandard: 0,
      manufacturer: '',
      grower: '',
      dominance: '',
      pharmacyName: '',
      pharmacyDomain: '',
      greenMedicalProductId: 0,
      vendor: '',
      source: '',
      productNumber: '',
      imageUrl: '',
      pharmacyId: 0,
      priorityRanking: 1
    },
    resolver: yupResolver(addProductSchema(t))
  })

  const { reset, setValue, watch } = methods

  const productName = watch('name')

  const onSubmit = async data => {
    setLoading(true)
    try {
      // Upload files first
      if (files.length != 0) {
        const res = await otherService.fileUpload(files)
        if (res?.status === 200) {
          data.imageUrl = res.data[0]
        } else {
          throw new Error(res.data?.message || 'File upload failed')
        }
      }

      // Then call product creation
      const addProductPromise = productService.createProduct(data, source).then(response => {
        if (response?.status === 200) {
          console.log(response.data.status)
          if (response.data.status == '200') {
            reset()
            router.push(getLocalizedURL(locale, `products?source=${source}`))
            setLoading(false)
            return response.data?.message || 'Product added successfully'
          } else {
            setLoading(false)
            const { data } = response
            if (data?.errors?.length) {
              const displayError = data?.errors[0]
              throw new Error(displayError || 'Failed to add product')
            }
            throw new Error(response.data?.description || 'Failed to add product')
          }
        } else {
          setLoading(false)
          throw new Error(response.data?.message || 'Unexpected error')
        }
      })

      toast.promise(addProductPromise, {
        loading: 'Saving product...',
        success: msg => msg,
        error: err => err.message || err
      })
    } catch (error) {
      toast.error(error.message || 'Something went wrong')
    }
  }

  useEffect(() => {
    // Create slug when product name changes
    if (productName) {
      handleCreateSlug()
    } else {
      setValue('productId', '') // Reset slug if product name is empty
    }
  }, [productName])

  const handleCreateSlug = () => {
    const slug = createSlug(productName)
    setValue('productId', slug)
  }

  return (
    <FormProvider {...methods}>
      <PageHeader
        heading={t('addProduct')}
        breadcrumbs={[
          {
            label: t('home'),
            href: '/'
          },
          {
            label: t('products'),
            href: '/products'
          },
          {
            label: t('addProduct')
          }
        ]}
      />
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <Card>
                  <CardHeader title={'Pharmacy'} />
                  <CardContent>
                    <PharmacyAutoComplete
                      control={methods.control}
                      setValue={setValue}
                      errors={methods.formState.errors}
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={8}>
            <Grid container spacing={6}>
              <Grid item xs={12} md={basicInformationSection.gridSize}>
                <FormSection {...basicInformationSection} />
              </Grid>
              <Grid item xs={12}>
                <ProductImage files={files} setFiles={setFiles} />
              </Grid>
              <Grid item xs={12}>
                <FormSection {...originAndSpecsSection} />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={4}>
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <FormSection {...manufacturerSection} />
              </Grid>
              <Grid item xs={12}>
                <FormSection {...pricingSection} />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Button type='submit' variant='contained' disabled={loading}>
              {loading ? t('loading') : t('saveProduct')}
            </Button>
          </Grid>
        </Grid>
      </form>
    </FormProvider>
  )
}

export default AddProductPage
