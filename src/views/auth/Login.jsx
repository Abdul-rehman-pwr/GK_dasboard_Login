'use client'

import { useEffect, useState } from 'react'
import { Button, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAuth } from '@core/hooks/useAuth'
import { useLocale, useTranslations } from 'next-intl'
import toast, { Toaster } from 'react-hot-toast'
import FieldMapper from './FieldMapper'
import useLoginFields from './useLoginFields'
import useLoginValidation from './useLoginValidation'
import useLoginApi from './useLoginApi'
import LanguageDropdown from '@/components/shared/language-dropdown'
import Link from '@components/Link'
import getLocalizedURL from '@/utils/getLocalizedUrl'
import themeConfig from '@configs/themeConfig'

const LoginIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  blockSize: 'auto',
  maxBlockSize: '680px',
  maxInlineSize: '100%',
  margin: theme.spacing(12)
}))

export default function LoginPage() {
  const t = useTranslations()
  const auth = useAuth()
  const locale = useLocale()
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const illustration = '/images/illustrations/characters-with-objects/7.png'

  const fields = useLoginFields(t)
  const schema = useLoginValidation(t)
  const apiSpec = useLoginApi()

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onBlur'
  })

  const onSubmit = async data => {
    try {
      setApiError('')
      setLoading(true)
      await auth.login({ ...data, locale }, setApiError, apiSpec)
    } catch (err) {
      console.error(err)
      setApiError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (apiError) {
      toast.error(t('userNotVerfied'))
    }
  }, [apiError])

  return (
    <>
      <Toaster position='top-right' />
      <div className='flex justify-center'>
        <div className='hidden md:flex flex-1 items-center justify-center'>
          <LoginIllustration src={illustration} alt='login' />
        </div>

        <div className='flex flex-col justify-center items-center p-6 md:p-12 md:w-[480px] relative bg-backgroundPaper'>
          <div className='absolute top-4 right-4'>
            <LanguageDropdown defaultValue={locale} />
          </div>

          <Typography variant='h4'>{`${t('welcomeTo')} ${themeConfig.templateName}! 👋🏻`}</Typography>
          <Typography className='mb-6'>{t('signInMessage')}</Typography>

          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5 w-full'>
            <FieldMapper fields={fields} control={control} errors={errors} t={t} />

            <Button fullWidth variant='contained' type='submit' disabled={loading}>
              {loading ? t('loggingInButton') : t('loginButton')}
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}
