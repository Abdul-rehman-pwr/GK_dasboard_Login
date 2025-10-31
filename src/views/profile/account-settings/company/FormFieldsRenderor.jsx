import React from 'react'
import { Controller } from 'react-hook-form'
import CustomTextField from '@/@core/components/mui/TextField'
import { MenuItem, Grid } from '@mui/material'

const FormFieldsRenderor = ({ field, control, errors }) => {
  return (
    <Grid item xs={12} sm={6} key={field.name}>
      <Controller
        name={field.name}
        control={control}
        render={({ field: controllerField }) => {
          switch (field.type) {
            case 'text':
              return (
                <CustomTextField
                  {...controllerField}
                  fullWidth
                  label={field.label}
                  placeholder={`Enter ${field.label}`}
                  error={!!errors[field.name]}
                  helperText={errors[field.name]?.message}
                />
              )
            case 'select':
              return (
                <CustomTextField
                  {...controllerField}
                  select
                  fullWidth
                  label={field.label}
                  error={!!errors[field.name]}
                  helperText={errors[field.name]?.message}
                >
                  {field.options.map(option => (
                    <MenuItem key={option.label} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </CustomTextField>
              )
            default:
              return null
          }
        }}
      />
    </Grid>
  )
}

export default FormFieldsRenderor
