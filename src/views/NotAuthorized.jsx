'use client'

// Next Imports
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

// MUI Imports
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useTranslations } from 'next-intl'

const NotAuthorized = () => {
  const router = useRouter()
  const t = useTranslations()
  // Hooks
  const handleBack = () => {
    router.back()
  }

  return (
    <div className='flex items-center flex-col text-center  min-bs-[100dvh] p-6'>
      <div className='flex flex-col gap-2 is-[90vw] sm:is-[unset] mbe-6'>
        <Typography variant='h4'> {t('permissionDeniedDescription')} 🔐</Typography>
      </div>
      <img
        alt='error-401-illustration'
        src='/images/illustrations/characters-with-objects/8.png'
        className='object-cover bs-[327px] sm:bs-[400px] md:bs-[450px] lg:bs-[500px] mbs-6'
      />
    </div>
  )
}

export default NotAuthorized
