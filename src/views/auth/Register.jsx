'use client'

// React Imports
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

// Next Imports
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

// MUI Imports
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Divider from '@mui/material/Divider'
import { styled, useTheme } from '@mui/material/styles'
import { toast, Toaster } from 'react-hot-toast'

// Component Imports
import Logo from '@components/layout/shared/Logo'
import CustomTextField from '@core/components/mui/TextField'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'
import userService from '@/services/userService'
import { useLocale, useTranslations } from 'next-intl'
import getLocalizedURL from '@/utils/getLocalizedUrl'
import responseHandler from '@/utils/responseHandler'
import { accountTypeId, countries } from '@/configs/app'
import { MenuItem } from '@mui/material'
import LanguageDropdown from '@/components/shared/language-dropdown'

// Styled Custom Components
const RegisterIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  blockSize: 'auto',
  maxBlockSize: 600,
  maxInlineSize: '100%',
  margin: theme.spacing(12),
  [theme.breakpoints.down(1536)]: {
    maxBlockSize: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxBlockSize: 450
  }
}))

const Register = () => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [loading, setLoading] = useState(false)
  const t = useTranslations()

  // const passwordSchema = yup
  //   .string()
  //   .required(t('password'))
  //   .test('password-validation', '', (value, { path, createError }) => {
  //     const conditions = [
  //       { regex: /[A-Z]/, message: t('passwordUppercase') },
  //       { regex: /[a-z]/, message: t('passwordLowercase') },
  //       { regex: /[0-9]/, message: t('passwordNumber') },
  //       { regex: /[!@#$%^&*()_+\-=[\]{}|;:'",.<>?/]/, message: t('passwordSpecialChar') },
  //       { regex: /.{5,15}/, message: value?.length < 8 ? t('passwordLimit') : t('passwordLimitMax') }
  //     ]

  //     const errors = conditions.filter(({ regex }) => !regex.test(value)).map(({ message }) => message)

  //     return errors.length ? createError({ path, message: `${t('passwordMust')} ${errors.join(', ')}` }) : true
  //   })
  const passwordSchema = yup
    .string()
    .required(t('password'))
    .test('password-validation', '', (value, { path, createError }) => {
      if (!value) return createError({ path, message: t('password') })

      const conditions = [
        { regex: /[A-Z]/, message: t('passwordUppercase') },
        { regex: /[a-z]/, message: t('passwordLowercase') },
        { regex: /[0-9]/, message: t('passwordNumber') },
        { regex: /[!@#$%^&*()_+\-=[\]{}|;:'",.<>?/]/, message: t('passwordSpecialChar') },
        { regex: /^.{8,15}$/, message: t('passwordLimit') }
        //       { regex: /.{5,15}/, message: value?.length < 8 ? t('passwordLimit') : t('passwordLimitMax') }
      ]

      const errors = conditions.filter(({ regex }) => !regex.test(value)).map(({ message }) => message)

      return errors.length ? createError({ path, message: `${t('passwordMust')} ${errors.join(', ')}` }) : true
    })

  const schema = yup.object().shape({
    firstName: yup.string().trim().max(100, t('firstNameMaxLength')).required(t('firstName')),
    lastName: yup.string().trim().max(100, t('lastNameMaxLength')).required(t('lastName')),
    email: yup.string().email(t('invalidemail')).max(100, t('emailMaxLength')).required(t('email')),
    password: passwordSchema,
    country: yup.string().trim().max(100, t('countryMaxLength')).required(t('country')),
    city: yup.string().trim().max(100, t('cityMaxLength')).required(t('city')),
    address: yup.string().trim().max(100, t('addressMaxLength')).required(t('address')),

    postalCode: yup
      .string()
      .matches(/^\d{5,10}$/, t('postalCodeFormat'))
      .required(t('postalCode'))
  })

  const { lang } = useParams()
  const { settings } = useSettings()
  const theme = useTheme()
  const router = useRouter()
  const locale = useLocale()

  const illustration = '/images/illustrations/characters-with-objects/7.png'

  // React Hook Form with Yup Resolver
  const {
    control,
    register,
    setError,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(schema)
  })

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const onSubmit = async data => {
    try {
      setLoading(true)
      const requestPayload = {
        ...data,
        accountTypeId: accountTypeId
      }
      const response = await userService.register(requestPayload)
      const { result, status, description } = await responseHandler(response)
      if (status === '200') {
        toast.success(t('successfullyRegistered'))
        reset()
        router.push(getLocalizedURL(locale, 'confirm-email'))
      } else if (status == '400' && description == 'A duplicate email was found. Please use another email address.') {
        toast.error(t('duplicateEmail'))
      }
    } catch (err) {
      toast.error(t('error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex bs-full justify-center'>
      <Toaster
        position='top-right'
        reverseOrder={false}
        toastOptions={{
          duration: 4000
        }}
      />

      <div className='flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden'>
        <RegisterIllustration src={illustration} alt='character-illustration' className='scale-x-[-1]' />
      </div>

      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px] relative'>
        {/* LanguageDropdown inside the white form */}
        <div className='absolute top-4 right-4'>
          <LanguageDropdown defaultValue={locale} />
        </div>

        <Link
          href={getLocalizedURL(locale, '/')}
          className='absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]'
        >
          {/* <Logo /> */}
        </Link>

        <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-11 sm:mbs-14 md:mbs-0 pt-8'>
          <div className='flex flex-col gap-1'>
            <Typography variant='h4'>{t('adventure_starts_here')}🚀</Typography>
            <Typography>{t('makeAppManagementEasyAndFun')}</Typography>
          </div>
          <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
            <div className='flex gap-6'>
              <CustomTextField
                fullWidth
                label={t('firstNameLabel')}
                placeholder={t('firstNamePlaceholder')}
                {...register('firstName')}
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
              />
              <CustomTextField
                fullWidth
                label={t('lastNameLabel')}
                placeholder={t('lastNamePlaceholder')}
                {...register('lastName')}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
              />
            </div>

            <CustomTextField
              fullWidth
              label={t('emailLabel')}
              placeholder={t('emailPlaceholder')}
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <CustomTextField
              fullWidth
              label={t('passwordLabel')}
              placeholder={t('passwordPlaceholder')}
              type={isPasswordShown ? 'text' : 'password'}
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton edge='end' onClick={handleClickShowPassword} onMouseDown={e => e.preventDefault()}>
                      <i className={isPasswordShown ? 'bx-hide' : 'bx-show'} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <div className='flex gap-6'>
              {/* <CustomTextField
              fullWidth
              label={t('countryLabel')}
              placeholder={t('countryPlaceholder')}
              {...register('country')}
              error={!!errors.country}
              helperText={errors.country?.message}
            /> */}

              <Controller
                name='country'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    select
                    fullWidth
                    label={t('countryLabel')}
                    error={Boolean(errors.country)}
                    helperText={errors.country?.message}
                    {...field}
                    placeholder='SELECT COUNTRY'
                  >
                    <MenuItem value={''} disabled>
                      {t('selectCountry')}
                    </MenuItem>

                    {countries?.map(country => (
                      <MenuItem key={country.value} value={country.value}>
                        {country.label}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />

              <CustomTextField
                fullWidth
                label={t('cityLabel')}
                placeholder={t('cityPlaceholder')}
                {...register('city')}
                error={!!errors.city}
                helperText={errors.city?.message}
              />
            </div>

            <CustomTextField
              fullWidth
              label={t('addressLabel')}
              placeholder={t('addressPlaceholder')}
              {...register('address')}
              error={!!errors.address}
              helperText={errors.address?.message}
            />

            <CustomTextField
              fullWidth
              label={t('postalCodeLabel')}
              placeholder={t('postalCodePlaceholder')}
              {...register('postalCode')}
              error={!!errors.postalCode}
              helperText={errors.postalCode?.message}
            />

            <Button fullWidth variant='contained' type='submit'>
              {loading ? t('registeringButton') : t('registerButton')}
            </Button>

            <div className='flex justify-center items-center flex-wrap gap-2'>
              <Typography>{t('alreadyHaveAccount')}</Typography>
              <Typography component={Link} href={getLocalizedURL(locale, 'login')} color='primary'>
                {t('signInInstead')}
              </Typography>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
