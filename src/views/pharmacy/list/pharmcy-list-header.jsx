'use client'

import React from 'react'
import { Box, Button, Typography } from '@mui/material'
import Link from 'next/link'
import getLocalizedURL from '@/utils/getLocalizedUrl'
import { useLocale, useTranslations } from 'next-intl'
import CanView from '@/@core/components/can/can-view'
import { PERMISSIONS } from '@/utils/permissions'

const PharmacyListHeader = () => {
  const locale = useLocale()
  const t = useTranslations()

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <Typography variant='h4' sx={{ fontWeight: 600 }}>
        {t('pharmacies')}
      </Typography>
      <CanView permission={PERMISSIONS.PHARMACY.ADD}>
        <Link href={getLocalizedURL(locale, `pharmacy/add`)} passHref>
          <Button variant='contained' color='primary'>
            {t('addPharmacy')}
          </Button>
        </Link>
      </CanView>
    </Box>
  )
}

export default PharmacyListHeader
