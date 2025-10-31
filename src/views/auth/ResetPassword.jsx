'use client'

// React Imports
import { useState } from 'react'

// Next.js Imports
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

// MUI Imports
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'
import { styled, useTheme } from '@mui/material/styles'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { toast, Toaster } from 'react-hot-toast'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import { useLocale, useTranslations } from 'next-intl'
import getLocalizedURL from '@/utils/getLocalizedUrl'
import responseHandler from '@/utils/responseHandler'
import userService from '@/services/userService'

// Styled Component for Illustration
const ResetPasswordIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  maxHeight: 650,
  width: '100%',
  margin: theme.spacing(12),
  [theme.breakpoints.down(1536)]: {
    maxHeight: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxHeight: 450
  }
}))

const ResetPassword = () => {
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)
  const [loading, setLoading] = useState(false)

  const t = useTranslations()
  const theme = useTheme()
  const locale = useLocale()
  const router = useRouter()
  const searchParams = useSearchParams()
  const resetPassCode = searchParams.get('resetPasscode')

  const validationSchema = Yup.object().shape({
    newPassword: Yup.string().required(t('newPassword')).min(8, t('passwordLimit')),
    newPasswordRetype: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], t('passwordsMatch'))
      .required(t('confirmPassword'))
  })

  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      newPassword: '',
      newPasswordRetype: ''
    }
  })

  const onSubmit = async data => {
    // if (!resetPassCode) {
    //   toast.error(t('invalidResetCode'))
    //   return
    // }
    try {
      setLoading(true)
      const requestPayload = { ...data, resetPasscode: resetPassCode }
      const response = await userService.resetPassword(requestPayload)
      const { status, description } = responseHandler(response)

      if (status === '200') {
        toast.success(t('operationSuccessful'))
        router.push(getLocalizedURL(locale, 'login'))
      } else {
        toast.error(t('error'))
      }
    } catch (error) {
      toast.error(t('error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex h-full justify-center'>
      <Toaster position='top-right' reverseOrder={false} toastOptions={{ duration: 4000 }} />
      <div className='flex h-full items-center justify-center flex-1 min-h-[100vh] relative p-6 max-md:hidden'>
        <ResetPasswordIllustration
          src='/images/illustrations/characters-with-objects/11.png'
          alt='character-illustration'
          className={theme.direction === 'rtl' ? 'scale-x-[-1]' : ''}
        />
      </div>
      <div className='flex justify-center items-center h-full bg-backgroundPaper p-6 md:p-12 md:w-[480px]'>
        <Link href='/' className='absolute top-5 left-6 sm:top-[33px] sm:left-[38px]'>
          {/* <Logo /> */}
        </Link>
        <div className='flex flex-col gap-6 w-full sm:max-w-[400px] md:max-w-full'>
          <div className='flex flex-col gap-1'>
            <Typography variant='h4'>Reset Password 🔒</Typography>
            <Typography>{t('passwordRequirements')}</Typography>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className='flex flex-col gap-6'>
            <Controller
              name='newPassword'
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label={t('newPasswordLabel')}
                  placeholder={t('newPasswordPlaceholder')}
                  type={isPasswordShown ? 'text' : 'password'}
                  error={!!errors.newPassword}
                  helperText={errors.newPassword?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onClick={() => setIsPasswordShown(prev => !prev)}
                          onMouseDown={e => e.preventDefault()}
                        >
                          <i className={isPasswordShown ? 'bx-hide' : 'bx-show'} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              )}
            />
            <Controller
              name='newPasswordRetype'
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label={t('confirmPasswordLabel')}
                  placeholder={t('confirmPasswordPlaceholder')}
                  type={isConfirmPasswordShown ? 'text' : 'password'}
                  error={!!errors.newPasswordRetype}
                  helperText={errors.newPasswordRetype?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onClick={() => setIsConfirmPasswordShown(prev => !prev)}
                          onMouseDown={e => e.preventDefault()}
                        >
                          <i className={isConfirmPasswordShown ? 'bx-hide' : 'bx-show'} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              )}
            />
            <Button fullWidth variant='contained' type='submit' disabled={loading}>
              {loading ? t('loadingButton') : t('setNewPasswordButton')}
            </Button>
            <Typography className='flex justify-center items-center' color='primary'>
              <Link href={getLocalizedURL(locale, 'login')} className='flex items-center gap-1'>
                <span>{t('backToLogin')}</span>
              </Link>
            </Typography>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
