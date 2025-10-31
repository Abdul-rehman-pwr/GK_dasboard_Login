'use client'

import { Grid, FormHelperText } from '@mui/material'
import { Controller } from 'react-hook-form'
import FilterField from './filter-fields'

export default function FilterFieldsMapper({ fields, control, errors, setValue, trigger, currentValues }) {
  return (
    <Grid container className='gap-y-1' spacing={2}>
      {fields.map(field => (
        <Grid item xs={12} sm={6} key={field.name}>
          <Controller
            name={field.name}
            control={control}
            render={({ field: rhfField }) => (
              <FilterField
                field={field}
                value={rhfField.value}
                onChange={rhfField.onChange}
                error={errors[field.name]}
                setValue={setValue}
                trigger={trigger}
                currentValues={currentValues}
              />
            )}
          />
          {errors[field.name] && (
            <FormHelperText sx={{ color: 'error.main' }}>{errors[field.name]?.message}</FormHelperText>
          )}
        </Grid>
      ))}
    </Grid>
  )
}
