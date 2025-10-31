'use client'

import { Grid, Typography, Box, Container } from '@mui/material'
import { useTranslations } from 'next-intl'
import HomeCards from './HomeCards'
import { useAuth } from '@/@core/hooks/useAuth'

const Home = () => {
  const t = useTranslations()
  const auth = useAuth()

  return (
    <Container maxWidth='lg' sx={{ mt: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant='h3' component='h1' gutterBottom>
          {t('welcome')} <span className='text-primary'>{auth?.user?.firstName ?? 'Doctor'}!</span>
        </Typography>
      </Box>
    </Container>
  )
}

export default Home
