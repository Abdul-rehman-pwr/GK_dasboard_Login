import React from 'react'
import { useFormContext } from 'react-hook-form'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import CustomTextField from '@core/components/mui/TextField'

const AdditionalDetailsSection = () => {
  const { register, watch, setValue } = useFormContext()
  const isEnabled = watch('isEnabled')

  return (
    <Card>
      <CardHeader title='Additional Details' />
      <CardContent>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <CustomTextField label='Source' {...register('source')} fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextField type='number' label='Priority Ranking' {...register('priorityRanking')} fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextField label='Collect Point ID' {...register('collectPointId')} fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextField label='Collect Point Name' {...register('collectPointName')} fullWidth />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Switch checked={isEnabled} onChange={e => setValue('isEnabled', e.target.checked)} />}
              label='Is Enabled'
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default AdditionalDetailsSection
