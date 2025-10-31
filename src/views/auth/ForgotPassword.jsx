'use client'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// MUI Imports
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { styled, useTheme } from '@mui/material/styles'

// Third-party Imports
import classnames from 'classnames'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from 'axios'

// Component Imports
import Logo from '@components/layout/shared/Logo'
import CustomTextField from '@core/components/mui/TextField'
import getLocalizedURL from '@/utils/getLocalizedUrl'
import { useLocale, useTranslations } from 'next-intl'
import responseHandler from '@/utils/responseHandler'
import userService from '@/services/userService'
import { useState } from 'react'
import { toast, Toaster } from 'react-hot-toast'

// Styled Custom Components
const ForgotPasswordIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  blockSize: 'auto',
  maxBlockSize: 650,
  maxInlineSize: '100%',
  margin: theme.spacing(12),
  [theme.breakpoints.down(1536)]: {
    maxBlockSize: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxBlockSize: 450
  }
}))

const ForgotPassword = () => {
  const theme = useTheme()
  const locale = useLocale()
  const [loading, setLoading] = useState(false)
  const t = useTranslations()
  const illustration = '/images/illustrations/characters-with-objects/10.png'

  // Validation Schema
  const schema = yup.object({
    email: yup.string().required(t('email')).email(t('invalidemail'))
  })

  // useForm Hook
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: ''
    }
  })

  // Submit Handler
  const onSubmit = async data => {
    try {
      setLoading(true)
      const response = await userService.forgotPassword(data)
      const { result, status, description } = responseHandler(response)
      if (status === '200') {
        toast.success(t('operationSuccessful'))
      } else {
        toast.error(t('error'))
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
        <ForgotPasswordIllustration
          src={illustration}
          alt='character-illustration'
          className={classnames({ 'scale-x-[-1]': theme.direction === 'rtl' })}
        />
      </div>
      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
        <Link
          href={getLocalizedURL(locale, 'login')}
          className='absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]'
        >
          {/* <Logo /> */}
        </Link>
        <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-11 sm:mbs-14 md:mbs-0'>
          <div className='flex flex-col gap-1'>
            <Typography variant='h4'>{t('forgotPassword')} 🔒</Typography>
            <Typography>{t('enterYourEmail')}</Typography>
          </div>
          <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
            <CustomTextField
              autoFocus
              fullWidth
              label={t('emailLabel')}
              placeholder={t('emailPlaceholder')}
              error={!!errors.email}
              helperText={errors.email?.message}
              {...register('email')}
            />

            <Button fullWidth variant='contained' type='submit' disabled={isSubmitting}>
              {isSubmitting ? t('sendingButton') : t('sendResetLinkButton')}
            </Button>

            <Typography className='flex justify-center items-center' color='primary'>
              <Link href={getLocalizedURL(locale, 'login')} className='flex items-center gap-1.5'>
                <span>{t('backToLogin')}</span>
              </Link>
            </Typography>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
