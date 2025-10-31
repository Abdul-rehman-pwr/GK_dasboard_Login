'use client'

import React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import { Box, Typography } from '@mui/material'
import { Icon } from '@iconify/react'
import { useTranslations } from 'next-intl'

const TrackOrder = ({ deliveryExternalOrderId, orderTrackerURL }) => {
  const t = useTranslations()

  const trackOrder = deliveryExternalOrderId != null || orderTrackerURL != null

  if (!trackOrder) return null

  return (
    <Card className='rounded-3xl mt-4 overflow-hidden shadow-xl border border-gray-100 bg-gradient-to-br from-white via-gray-50 to-gray-100'>
      <CardContent className='flex flex-col gap-6 p-6 sm:p-8'>
        <div className='flex items-center gap-3 text-gray-800'>
          <Icon icon='mdi:truck-delivery-outline' width={28} className='text-primary' />
          <h3 className='text-xl sm:text-2xl font-semibold tracking-tight'>{t('Track Order')}</h3>
        </div>

        <Box className='flex flex-col gap-4'>
          {orderTrackerURL && (
            <Button
              fullWidth
              href={orderTrackerURL}
              target='_blank'
              color='primary'
              variant='contained'
              className='!capitalize !text-base !rounded-xl !py-3 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200'
            >
              {t('Track your Order')}
            </Button>
          )}

          {deliveryExternalOrderId && (
            <Box className='flex flex-col justify-between'>
              <Typography className='text-sm sm:text-base font-bold text-gray-700'>
                {t('External Delivery Order ID')}
              </Typography>
              <Typography className='text-sm text-gray-700'>{deliveryExternalOrderId}</Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}

export default TrackOrder
