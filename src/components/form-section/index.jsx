'use client'

import React from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import MenuItem from '@mui/material/MenuItem'
import CustomTextField from '@core/components/mui/TextField'
import PharmacyAdminAutocompleteField from './pharmacy-admin-autocomplete'
import AutoCompleteField from './autocomplete'
import PharmacyAutocompleteField from './pharmacies-autocomplete'
import { useUserPermissions } from '@/hooks/useUserPermissions'
import CountriesAutocompleteField from './countries-autocomplete'

const FormSection = ({ title, fields, style, fieldGridSize, cannaleo = false, addPharmacy = false, status = null }) => {
  const { control } = useFormContext()
  const { permissions } = useUserPermissions()

  const cannaleoPharmacyEditAbleFields = [
    'priceBumpPercentage',
    'priorityRanking',
    'vatId',
    'collectPointId',
    'platformFee',
    'legalName',
    'country',
    'userId',
    'enabled',
    'source'
  ]

  return (
    <Card sx={{ ...style }}>
      <CardHeader title={title} />
      <CardContent>
        <Grid container spacing={4}>
          {fields.map(field => {
            const gridSize = field.gridSize || fieldGridSize || 6
            let fieldComponent = null
            const hasPermission = field.permission ? permissions.has(field.permission) : true
            const hide = field.hideIfNoPermission && !hasPermission
            if (hide) return null
            const disabled = field.permission ? !permissions.has(field.permission) : false
            const fieldEnableBasedOnSource = cannaleo ? cannaleoPharmacyEditAbleFields.includes(field.name) : true
            const fieldName = fieldEnableBasedOnSource ? `${field?.label}${field.required ? '*' : ''}` : field?.label
            if (field.name === 'enabled' && addPharmacy) return
            const enabledFieldDisabled = status !== 'COMPLETED'

            switch (field.type) {
              case 'switch':
                fieldComponent = (
                  <Controller
                    name={field.name}
                    control={control}
                    disabled={field.disabled || !fieldEnableBasedOnSource}
                    render={({ field: controllerField }) => (
                      <FormControlLabel
                        control={
                          <Switch
                            checked={Boolean(controllerField.value)}
                            onChange={e => controllerField.onChange(e.target.checked)}
                            disabled={field.disabled || !fieldEnableBasedOnSource}
                          />
                        }
                        label={fieldName}
                      />
                    )}
                  />
                )
                break
              case 'select':
                fieldComponent = (
                  <Controller
                    name={field.name}
                    control={control}
                    disabled={field.disabled || !fieldEnableBasedOnSource}
                    rules={(!cannaleo ? field.validation : {}) || {}}
                    render={({ field: controllerField, fieldState }) => (
                      <CustomTextField
                        {...controllerField}
                        label={fieldName}
                        select
                        fullWidth
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                      >
                        {cannaleo && field.name === 'source' ? (
                          <MenuItem key={'Cannaleo'} value={'cannaleo'}>
                            Cannaleo
                          </MenuItem>
                        ) : null}
                        {field.options?.map(opt => (
                          <MenuItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </MenuItem>
                        ))}
                      </CustomTextField>
                    )}
                  />
                )
                break
              case 'autocomplete':
                fieldComponent = (
                  <Controller
                    name={field.name}
                    control={control}
                    rules={(!cannaleo ? field.validation : {}) || {}}
                    disabled={field.disabled || !fieldEnableBasedOnSource}
                    render={({ field: controllerField, fieldState }) => (
                      <AutoCompleteField
                        field={field}
                        value={controllerField.value}
                        onChange={controllerField.onChange}
                        error={fieldState.error}
                        disabled={field.disabled || !fieldEnableBasedOnSource}
                      />
                    )}
                  />
                )
                break
              case 'pharmacyAdminAutocomplete':
                fieldComponent = (
                  <Controller
                    name={field.name}
                    control={control}
                    disabled={field.disabled || !fieldEnableBasedOnSource}
                    rules={(!cannaleo ? field.validation : {}) || {}}
                    render={({ field: controllerField, fieldState }) => (
                      <PharmacyAdminAutocompleteField
                        field={field}
                        value={controllerField.value}
                        onChange={controllerField.onChange}
                        error={fieldState.error}
                        disabled={field.disabled || !fieldEnableBasedOnSource}
                      />
                    )}
                  />
                )
                break
              case 'pharmacyAutocomplete':
                fieldComponent = (
                  <Controller
                    name={field.name}
                    control={control}
                    rules={(!cannaleo ? field.validation : {}) || {}}
                    disabled={field.disabled || !fieldEnableBasedOnSource}
                    render={({ field: controllerField, fieldState }) => (
                      <PharmacyAutocompleteField
                        field={field}
                        value={controllerField.value}
                        onChange={controllerField.onChange}
                        error={fieldState.error}
                        disabled={field.disabled || !fieldEnableBasedOnSource}
                      />
                    )}
                  />
                )
                break
              case 'countryAutocomplete':
                fieldComponent = (
                  <Controller
                    name={field.name}
                    control={control}
                    disabled={field.disabled || !fieldEnableBasedOnSource}
                    rules={(!cannaleo ? field.validation : {}) || {}}
                    render={({ field: controllerField, fieldState }) => (
                      <CountriesAutocompleteField
                        field={field}
                        value={controllerField.value}
                        onChange={controllerField.onChange}
                        error={fieldState.error}
                        disabled={field.disabled || !fieldEnableBasedOnSource}
                      />
                    )}
                  />
                )
                break
              default:
                fieldComponent = (
                  <Controller
                    name={field.name}
                    control={control}
                    rules={(!cannaleo ? field.validation : {}) || {}}
                    render={({ field: controllerField, fieldState }) => (
                      <CustomTextField
                        {...controllerField}
                        label={fieldName}
                        type={field.type}
                        fullWidth
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        disabled={field.disabled || disabled || !fieldEnableBasedOnSource}
                      />
                    )}
                  />
                )
                break
            }

            return (
              <Grid item xs={12} md={gridSize} key={field.name}>
                {fieldComponent}
              </Grid>
            )
          })}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default FormSection
