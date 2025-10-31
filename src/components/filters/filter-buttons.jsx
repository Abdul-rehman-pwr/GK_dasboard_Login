'use client'

import { Box } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { useTranslations } from 'next-intl'

export default function FilterButtons({ loading, handleReset, formattedData }) {
  const t = useTranslations()
  return (
    <Box display='flex' gap={2} justifyContent='flex-end'>
      <LoadingButton
        disabled={!formattedData?.length}
        loading={loading}
        onClick={handleReset}
        variant='outlined'
        type='button'
      >
        {t('clear')}
      </LoadingButton>
      <LoadingButton loading={loading} variant='contained' type='submit'>
        {t('search')}
      </LoadingButton>
    </Box>
  )
}
