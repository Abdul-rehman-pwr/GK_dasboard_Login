'use client'

import React, { useState } from 'react'
import { useForm, FormProvider, useWatch } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Grid, Button, CircularProgress, Typography } from '@mui/material'
import toast from 'react-hot-toast'
import FormSection from '@/components/form-section'
import productService from '@/services/productService'

import otherService from '@/services/otherService'
import { metadataSection } from '@/@core/form-fields/add-metadata'
import PageHeader from '@/components/shared/page-header'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'

const validationSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  type: yup.string().required('Type is required'),
  value: yup.mixed().required('Value is required')
})

const EditProductMetadataForm = () => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations()
  const searchParams = useSearchParams()
  const productId = searchParams.get('productId')

  const methods = useForm({
    defaultValues: {
      name: '',
      type: 'string',
      value: ''
    },
    resolver: yupResolver(validationSchema)
  })

  const { handleSubmit, reset, control, setValue } = methods
  const type = useWatch({ control, name: 'type' })

  console.log({ type })

  const onSubmit = async data => {
    try {
      setLoading(true)

      // Handle image upload if type is 'image'
      if (data.type === 'image' && data.value instanceof File) {
        const res = await otherService.fileUpload([data.value])
        if (res?.status === 200) {
          data.value = res.data[0]
        } else {
          throw new Error(res?.data?.message || 'Image upload failed')
        }
      }

      const response = await productService.addMetadata(data) // <- you should implement this in your API
      if (response?.status === 200 && response.data?.status === '200') {
        toast.success(response.data.message || 'Metadata added successfully')
        reset()
      } else {
        throw new Error(response?.data?.message || 'Failed to add metadata')
      }
    } catch (error) {
      toast.error(error.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <FormProvider {...methods}>
      <PageHeader
        heading={t('Metadata')}
        breadcrumbs={[
          {
            label: t('home'),
            href: '/'
          },
          {
            label: t('metadata'),
            href: `/metadata?porductId=${productId}`
          },
          {
            label: t('addMetadata')
          }
        ]}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <FormSection
              {...metadataSection}
              overrideFieldRender={(field, ControllerComponent) => {
                if (field.name === 'value' && type === 'image') {
                  return (
                    <ControllerComponent
                      render={({ field: { onChange } }) => (
                        <input type='file' accept='image/*' onChange={e => onChange(e.target.files?.[0])} />
                      )}
                    />
                  )
                }
                return null // default rendering from FormSection
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Button type='submit' variant='contained' disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Save Metadata'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </FormProvider>
  )
}

export default EditProductMetadataForm
