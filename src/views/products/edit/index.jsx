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
import otherService from '@/services/otherService'
import PharmacyAutoComplete from '@/views/products/add/PharmacyAutoComplete'
import PageHeader from '@/components/shared/page-header'
import { createSlug } from '@/utils/stringUtils'
import { Card, CardContent, CardHeader } from '@mui/material'

const EditProductPage = () => {
  const router = useRouter()
  const [pharmacySelection, setPharmacySelection] = useState({})
  const locale = useLocale()
  const t = useTranslations()
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [product, setProduct] = useState(null)
  const searchParams = useSearchParams()
  const productId = searchParams.get('id')
  const source = searchParams.get('source')

  const isCannaleo = source === 'cannaleo'

  const { basicInformationSection, originAndSpecsSection, pricingSection, manufacturerSection, shippingSection } =
    useProductFormSections()

  const methods = useForm({
    defaultValues: {
      productId: '',
      name: '',
      genetic: '',
      country: '',
      thc: 0,
      cbd: 0,
      isNew: true,
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

  const { reset, setValue } = methods

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await productService.getProduct(productId, source)
        if (res?.status === 200 || res?.status === 201) {
          const productData = res.data?.data
          const value = {
            label: productData.pharmacyName,
            value: productData.pharmacyId
          }
          if (productData?.productId) productData.productId = createSlug(productData.productId)
          setPharmacySelection(value)
          setProduct(productData)
          reset(productData)
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    if (productId) fetchData()
  }, [productId, reset])

  const onSubmit = async data => {
    try {
      setLoading(true)
      if (files.length) {
        const isFileChanged = files[0].preview !== product.imageUrl
        if (isFileChanged) {
          const res = await otherService.fileUpload(files)
          if (res?.status === 200 && Array.isArray(res?.data)) data.imageUrl = res.data[0]
        }
      }

      const updateProductPromise = productService.updateProduct(productId, data, source).then(response => {
        if (response?.status === 200 && response.data.status === '200') {
          reset()
          // dynamically append the source query parameter from current URL
          const redirectUrl = getLocalizedURL(locale, `products${source ? `?source=${source}` : ''}`)
          router.push(redirectUrl)
          setLoading(false)
          return response.data?.description || 'Product updated successfully'
        } else {
          setLoading(false)
          throw new Error(response.data?.description || 'Failed to update product')
        }
      })

      toast.promise(updateProductPromise, {
        loading: 'Saving product...',
        success: msg => msg,
        error: err => err.message || err
      })
    } catch (error) {
      toast.error(error.message || 'Something went wrong')
    }
  }

  const mapFieldsWithDisabled = section => {
    return {
      ...section,
      fields: section.fields.map(f => {
        if (f.name === 'isNew') return { ...f, disabled: false }
        if (isCannaleo) {
          const editableFields = ['thc', 'cbd', 'isNew', 'genetic']
          return { ...f, disabled: !editableFields.includes(f.name) }
        }
        return { ...f, disabled: false }
      })
    }
  }

  return (
    <FormProvider {...methods}>
      <PageHeader
        heading={product?.name}
        breadcrumbs={[
          { label: t('home'), href: '/' },
          { label: t('products'), href: '/products' },
          { label: product?.name }
        ]}
      />
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <CardHeader title={'Pharmacy'} />
              <CardContent>
                <PharmacyAutoComplete setValue={setValue} value={pharmacySelection} disabled={isCannaleo} />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Grid container spacing={6}>
              <Grid item xs={12} md={basicInformationSection.gridSize}>
                <FormSection {...mapFieldsWithDisabled(basicInformationSection)} />
              </Grid>
              <Grid item xs={12}>
                <ProductImage
                  files={files}
                  setFiles={setFiles}
                  initialFileUrl={product?.imageUrl}
                  disabled={isCannaleo}
                />
              </Grid>
              <Grid item xs={12}>
                <FormSection {...mapFieldsWithDisabled(originAndSpecsSection)} />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={4}>
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <FormSection {...mapFieldsWithDisabled(manufacturerSection)} />
              </Grid>
              <Grid item xs={12}>
                <FormSection {...mapFieldsWithDisabled(pricingSection)} />
              </Grid>
              <Grid item xs={12}>
                <FormSection {...mapFieldsWithDisabled(shippingSection)} />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Button type='submit' variant='contained' disabled={loading}>
              {loading ? t('loading') : t('updateProduct')}
            </Button>
          </Grid>
        </Grid>
      </form>
    </FormProvider>
  )
}

export default EditProductPage
