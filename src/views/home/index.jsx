'use client'
import React from 'react'
import { styled } from '@mui/material/styles'
import { useTranslations } from 'next-intl'
import { Typography } from '@mui/material'

const LoginIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  blockSize: 'auto',
  maxBlockSize: '380px',
  maxInlineSize: '100%',
  margin: theme.spacing(12),
  [theme.breakpoints.down(1536)]: {
    maxBlockSize: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxBlockSize: 450
  }
}))
const HomeView = () => {
  const illustration = '/images/illustrations/characters-with-objects/7.png'
  const t = useTranslations()

  return (
    <div className='flex w-full flex-col justify-center items-center'>
      <Typography variant='h3' component='h1' className='text-center' gutterBottom>
        {t('welcome')}
      </Typography>
      <Typography className=' text-sm  text-center' gutterBottom>
        {t('dashboardDescription')}
      </Typography>
      <LoginIllustration src={illustration} alt='character-illustration' className='scale-x-[-1]' />
    </div>
  )
}

export default HomeView
