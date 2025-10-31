'use client'

import Typography from '@mui/material/Typography'
import { useTranslations } from 'next-intl'

const ComingSoon = () => {
  const t = useTranslations()
  return (
    <div className='flex items-center flex-col text-center min-bs-[100dvh] p-6'>
      <div className='is-[90vw] sm:is-[unset]'>
        <div className='flex flex-col gap-2 is-[90vw] sm:is-[unset] mbe-6'>
          <Typography variant='h3'>{t('bulkUploadHeading')}</Typography>
          <Typography>{t('bulkUploadDescription')}</Typography>
        </div>
      </div>
      <img
        alt='bulk-upload-illustration'
        src='/images/illustrations/characters-with-objects/7.png'
        className='object-cover bs-[327px] sm:bs-[400px] md:bs-[450px] lg:bs-[500px] mbs-10 md:mbs-14'
      />
    </div>
  )
}

export default ComingSoon
