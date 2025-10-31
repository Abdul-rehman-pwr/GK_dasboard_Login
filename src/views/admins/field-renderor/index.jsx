'use client'
import { Controller } from 'react-hook-form'
import { Autocomplete, MenuItem } from '@mui/material'
import CustomTextField from '@core/components/mui/TextField'
import { useTranslations } from 'next-intl'

const FieldRenderer = ({ field, errors, control }) => {
  const t = useTranslations()

  return (
    <Controller
      name={field.field}
      control={control}
      render={({ field: controllerField }) => {
        switch (field.type) {
          case 'text':
          case 'email':
          case 'tel':
          case 'textarea':
          case 'password':
            return (
              <CustomTextField
                {...controllerField}
                fullWidth
                label={`${field.label}${field.required ? '*' : ''}`}
                placeholder={field.label}
                error={Boolean(errors[field.field])}
                helperText={errors[field.field]?.message}
                multiline={field.type === 'textarea'}
              />
            )

          case 'select':
            return (
              <CustomTextField
                select
                fullWidth
                label={field.label}
                {...controllerField}
                error={Boolean(errors[field.field])}
                helperText={errors[field.field]?.message}
              >
                {field.options.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {t(`${option.label}`)}
                  </MenuItem>
                ))}
              </CustomTextField>
            )

          case 'auto-select':
            return (
              <Autocomplete
                {...controllerField}
                options={field.options}
                getOptionLabel={option => option.label}
                renderInput={params => (
                  <CustomTextField
                    {...params}
                    fullWidth
                    label={field.label}
                    error={Boolean(errors[field.field])}
                    helperText={errors[field.field]?.message}
                  />
                )}
                onChange={(_, value) => controllerField.onChange(value?.value)}
                renderOption={(props, option) => (
                  <MenuItem {...props} value={option.value}>
                    {option.label}
                  </MenuItem>
                )}
                value={field.options.find(option => option.value === controllerField.value) || null}
              />
            )

          default:
            return null
        }
      }}
    />
  )
}

export default FieldRenderer
