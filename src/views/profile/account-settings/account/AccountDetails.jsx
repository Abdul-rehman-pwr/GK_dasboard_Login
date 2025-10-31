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
import { useTranslations } from 'next-intl'
import LoadingFallback from '@/components/shared/loading'

const languageData = ['English', 'German']

const AccountDetails = () => {
  const t = useTranslations()

  const auth = useAuth()
  const profileValidations = useProfileValidations()
  const [loading, setLoading] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)
  const defaultImage = '/images/avatars/1.png'
  const [formLoading, setFormLoading] = useState(false)

  const initialData = {
    firstName: auth.user?.firstName || '',
    lastName: auth.user?.lastName || '',
    email: auth.user?.email || '',
    organization: auth.user?.organization || '',
    phoneNumber: auth.user?.phoneNumber || '',
    address: auth.user?.address || '',
    city: auth.user?.city || '',
    postalCode: auth.user?.postalCode || '',
    country: auth.user?.country || 'germany',
    language: auth.user?.language || 'German',
    timezone: auth.user?.timezone || 'gmt+01',
    currency: auth.user?.currency || '€',
    profileImage: auth.user?.image || defaultImage
  }
  const countries = [
    { label: 'Germany', value: 'germany' },
    { label: 'Portugal', value: 'portugal' },
    { label: 'France', value: 'france' },
    { label: 'Ukraine', value: 'ukraine' },
    { label: 'UK', value: 'uk' },
    { label: 'Australia', value: 'australia' },
    { label: 'USA', value: 'usa' }
  ]

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    watch,

    formState: { errors, isDirty }
  } = useForm({
    defaultValues: initialData,
    resolver: yupResolver(profileValidations)
  })

  useEffect(() => {
    setFormLoading(true)
    const loadData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1500))
        reset(initialData)
      } catch (error) {
        console.error('Error loading data:', error)
        toast.error(t('failedToLoadUserDetails'))
      } finally {
        setFormLoading(false)
      }
    }
    loadData()
  }, [auth.user, reset])

  const imgSrc = watch('profileImage') || defaultImage

  const handleFileInputChange = file => {
    const { files } = file.target
    if (files && files.length > 0) {
      const selectedFile = files[0]
      if (selectedFile.size > 800 * 1024) {
        toast.error(t('fileSizeExceedsLimit'))
        return
      }
      const reader = new FileReader()
      reader.onload = () => {
        setValue('profileImage', reader.result, { shouldDirty: true })
        setValue('image', Object.assign(selectedFile), { shouldDirty: true })
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleFileInputReset = () => {
    setValue('profileImage', defaultImage, { shouldDirty: true })
    setValue('image', null, { shouldDirty: true })
  }

  const uploadFile = async file => {
    try {
      setImageLoading(true)
      const response = await otherService.fileUpload(file)
      if (response?.data?.length > 0) {
        const imageURL = response.data[0]
        setValue('profileImage', imageURL)
        return imageURL
      } else {
        toast.error(t('errorUploadingImage'))
        return null
      }
    } catch (err) {
      toast.error(t('errorUploadingImage'))
      return null
    } finally {
      setImageLoading(false)
    }
  }
  const onSubmit = async data => {
    setLoading(true)
    try {
      const requestPayload = { ...data, userId: auth.user?.id }
      if (data?.image) {
        const fileImageURL = await uploadFile(data?.image)
        if (!fileImageURL) {
          setLoading(false)
          return
        }
        requestPayload['image'] = fileImageURL
      }
      const response = await userService.updateUser(requestPayload)
      const { result, status, description } = responseHandler(response)
      if (status === '200') {
        auth.setUser(result)
        localStorage.setItem('userData', JSON.stringify(result))
        toast.success(t('userDataSubmittedSuccessfully'))
      } else {
        toast.error(t('failedToUpdateUserData'))
      }
    } catch (err) {
      toast.error(t('failedToUpdateUserData'))
    } finally {
      setLoading(false)
    }
  }

  if (formLoading) {
    return <LoadingFallback />
  }
  return (
    <Card>
      <Toaster position='top-right' reverseOrder={false} toastOptions={{ duration: 4000 }} />
      <CardContent>
        <div className='flex max-sm:flex-col items-center gap-6'>
          {imageLoading ? (
            <CircularProgress size={100} className='text-blue-500' />
          ) : (
            <Image height={100} width={100} className='rounded' src={imgSrc} alt='Profile' />
          )}

          <div className='flex flex-grow flex-col gap-4'>
            <div className='flex flex-col sm:flex-row gap-4'>
              <Button component='label' variant='contained' htmlFor='account-settings-upload-image'>
                {t('uploadNewPhoto')}
                <input
                  hidden
                  type='file'
                  accept='image/png, image/jpeg'
                  onChange={handleFileInputChange}
                  id='account-settings-upload-image'
                />
              </Button>
              <Button variant='tonal' color='secondary' onClick={handleFileInputReset}>
                {t('reset')}
              </Button>
            </div>
            <Typography>{t('allowedFileFormats')}</Typography>
          </div>
        </div>
        <Divider className='mbs-4' />
      </CardContent>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={6}>
              <Controller
                name='firstName'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    label={t('firstNameLabel') + '*'}
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                    {...field}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='lastName'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    label={t('lastNameLabel') + '*'}
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                    {...field}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='email'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    label={t('emailLabel') + '*'}
                    disabled
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    {...field}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='phoneNumber'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    label={t('phoneNumber') + '*'}
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber?.message}
                    {...field}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='address'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    label={t('addressLabel') + '*'}
                    error={!!errors.address}
                    helperText={errors.address?.message}
                    {...field}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='city'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    label={t('cityLabel') + '*'}
                    error={!!errors.city}
                    helperText={errors.city?.message}
                    {...field}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='postalCode'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    label={t('postalCodeLabel') + '*'}
                    error={!!errors.postalCode}
                    helperText={errors.postalCode?.message}
                    {...field}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='country'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    select
                    label={t('countryLabel') + '*'}
                    fullWidth
                    error={!!errors.country}
                    {...field}
                    disabled={!!field.value}
                  >
                    <MenuItem disabled value=''>
                      {t('selectCountry')}
                    </MenuItem>
                    {countries?.map((country, index) => (
                      <MenuItem key={index + country.value} value={country.value}>
                        {country.label}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='language'
                control={control}
                render={({ field }) => (
                  <CustomTextField select fullWidth label={t('language') + '*'} error={!!errors.language} {...field}>
                    {languageData.map(name => (
                      <MenuItem key={name} value={name}>
                        {name}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='timezone'
                control={control}
                render={({ field }) => (
                  <CustomTextField select fullWidth label={t('timeZone') + '*'} error={!!errors.timezone} {...field}>
                    <MenuItem value='gmt+01'>(GMT+01:00) Berlin, Germany</MenuItem>
                    <MenuItem value='gmt-12'>(GMT-12:00) International Date Line West</MenuItem>
                    <MenuItem value='gmt-11'>(GMT-11:00) Midway Island, Samoa</MenuItem>
                    <MenuItem value='gmt-10'>(GMT-10:00) Hawaii</MenuItem>
                    <MenuItem value='gmt-09'>(GMT-09:00) Alaska</MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='currency'
                control={control}
                render={({ field }) => (
                  <CustomTextField select fullWidth label={t('currency') + '*'} error={!!errors.currency} {...field}>
                    {Object.entries(currencyDetails).map(([code, { symbol }]) => (
                      <MenuItem key={code} value={code.toLocaleLowerCase()}>
                        {code}
                      </MenuItem>
                    ))}
                  </CustomTextField>
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
      </CardContent>
    </Card>
  )
}

export default AccountDetails
