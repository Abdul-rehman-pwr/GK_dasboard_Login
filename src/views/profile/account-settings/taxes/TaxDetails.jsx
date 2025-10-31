'use client'

import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import CustomTextField from '@core/components/mui/TextField'
import { useAuth } from '@/@core/hooks/useAuth'
import userService from '@/services/userService'
import { toast, Toaster } from 'react-hot-toast'
import responseHandler from '@/utils/responseHandler'
import otherService from '@/services/otherService'
import { CircularProgress } from '@mui/material'
import { yupResolver } from '@hookform/resolvers/yup'
import useProfileValidations from '@/validations/profileValidations'
import Image from 'next/image'
import { currencyDetails } from '@/configs/app'
// import CustomDropdown from '@/views/templates/CustomDropdown'
import useVatValidations from '@/validations/vatValidations'
import { useTranslations } from 'next-intl'
import useVatTaxOptions from '@/hooks/useVatTaxOptions'

const languageData = ['English', 'German']

const TaxDetails = () => {
  const auth = useAuth()
  const t = useTranslations()
  const [loading, setLoading] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [tax, setTex] = useState()
  const vatValidations = useVatValidations()
  const { VATCategoryOptions } = useVatTaxOptions()
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isDirty }
  } = useForm({
    resolver: yupResolver(vatValidations)
  })

  useEffect(() => {
    const token = localStorage.getItem('accessToken')

    setFormLoading(true)

    const getTaxInfo = async () => {
      try {
        const response = await userService.getUserByToken({ Authorization: `Bearer ${token}` })
        const { result, status, description } = responseHandler(response)
        if (status === '200') {
          setTex(result)
          setValue('vatType', result?.taxDetail?.vatType, { shouldDirty: true })
        } else {
          toast.error('error')
        }
      } catch (err) {
        toast.error('error')
      } finally {
        setFormLoading(false)
      }
    }

    if (token) {
      getTaxInfo()
    }
  }, [auth.user, reset])

  useEffect(() => {
    if (tax?.taxDetail?.vatType && !isDirty) {
      setValue('vatType', tax?.taxDetail?.vatType)
    }
  }, [tax])

  const onSubmit = async data => {
    setLoading(true)
    try {
      const vatResponse = await userService.addTax({ vatType: data?.vatType })
      const { status, description } = responseHandler(vatResponse)

      if (status !== '200') {
        toast.error(t('failedToUpdateVATDetails'))
        return
      }

      setValue('vatType', data?.vatType)
      toast.success(t('vatInformationAddedSuccessfully'))
    } catch (err) {
      toast.error(t('response_processing_error'))
    } finally {
      setLoading(false)
    }
  }

  if (formLoading) {
    return (
      <div className='flex justify-center h-screen'>
        <CircularProgress size={60} />
      </div>
    )
  }

  return (
    <Card>
      <Toaster position='top-right' reverseOrder={false} toastOptions={{ duration: 4000 }} />

      {/* <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={6}>
              <Controller
                name='vatType'
                control={control}
                defaultValue={tax?.taxDetail?.vatType}
                render={({ field, fieldState }) => (
                  <CustomDropdown
                    {...field}
                    value={field.value}
                    onChange={e => field.onChange(e.target.value)}
                    label={`${t('vatTypeLabel')}*`}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    options={VATCategoryOptions}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Button disabled={!isDirty || loading} fullWidth size='large' type='submit' variant='contained'>
                {t('saveChanges')}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent> */}
    </Card>
  )
}

export default TaxDetails
