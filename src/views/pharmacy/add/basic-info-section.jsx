import React from 'react'
import { useFormContext } from 'react-hook-form'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import CustomTextField from '@core/components/mui/TextField'

const BasicInformationSection = () => {
  const { register } = useFormContext()

  return (
    <Card>
      <CardHeader title='Basic Information' />
      <CardContent>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <CustomTextField label='Pharmacy Name' {...register('pharmacyName')} fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextField label='Official Name' {...register('officialName')} fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextField label='Domain' {...register('domain')} fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextField label='Email' {...register('email')} fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextField label='Phone Number' {...register('phoneNumber')} fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextField label='Connected Account ID' {...register('connectedAccountId')} fullWidth />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default BasicInformationSection
