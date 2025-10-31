import React from 'react'
import { useFormContext } from 'react-hook-form'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import CustomTextField from '@core/components/mui/TextField'

const ShippingOptionsSection = () => {
  const { register, setValue, watch } = useFormContext()
  const pickup = watch('pickup')

  return (
    <Card>
      <CardHeader title='Shipping Options' />
      <CardContent>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <CustomTextField label='Shipping' {...register('shipping')} fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextField
              type='number'
              label='Shipping Cost Standard'
              {...register('shippingCostStandard')}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextField label='Express' {...register('express')} fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextField
              type='number'
              label='Express Cost Standard'
              {...register('expressCostStandard')}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextField label='Local Courier' {...register('localCourier')} fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextField
              type='number'
              label='Local Courier Cost Standard'
              {...register('localCourierCostStandard')}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Switch checked={pickup} onChange={e => setValue('pickup', e.target.checked)} />}
              label='Pickup Available'
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default ShippingOptionsSection
