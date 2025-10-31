import React from 'react'
import { useFormContext } from 'react-hook-form'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import CustomTextField from '@core/components/mui/TextField'

const AddressSection = () => {
  const { register } = useFormContext()

  return (
    <Card>
      <CardHeader title='Address' />
      <CardContent>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <CustomTextField label='Street' {...register('street')} fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextField label='Postal Code (PLZ)' {...register('plz')} fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextField label='City' {...register('city')} fullWidth />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default AddressSection
