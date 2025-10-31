import React from 'react'
import { useFormContext } from 'react-hook-form'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import CustomTextField from '@core/components/mui/TextField'

const FeesPricingSection = () => {
  const { register } = useFormContext()

  return (
    <Card>
      <CardHeader title='Fees & Pricing' />
      <CardContent>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <CustomTextField type='number' label='Doctor Fee' {...register('doctorFee')} fullWidth />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomTextField type='number' label='Platform Fee' {...register('platformFee')} fullWidth />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomTextField
              type='number'
              label='Price Bump Percentage'
              {...register('priceBumpPercentage')}
              fullWidth
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default FeesPricingSection
