'use client'

import React from 'react'
import { Box, Button, Typography } from '@mui/material'
import Link from 'next/link'
import getLocalizedURL from '@/utils/getLocalizedUrl'
import { useLocale, useTranslations } from 'next-intl'

const ProductListHeader = () => {
  const locale = useLocale()
  const t = useTranslations()

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 4
      }}
    >
      <Typography variant='h4' sx={{ fontWeight: 600 }}>
        {t('products')}
      </Typography>

      <Link href={getLocalizedURL(locale, `products/add`)} passHref>
        <Button variant='contained' color='primary'>
          {t('addProduct')}
        </Button>
      </Link>
    </Box>
  )
}

export default ProductListHeader
