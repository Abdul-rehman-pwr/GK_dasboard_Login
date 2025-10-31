'use client'

import React, { useEffect, useState } from 'react'
import { Autocomplete, CircularProgress } from '@mui/material'
import { useTranslations } from 'next-intl'
import CustomTextField from '@/@core/components/mui/TextField'
import pharmacyServices from '@/services/pharmacy-services'
import countries from './countries.json'

const CountriesAutocompleteField = ({ value, onChange, error, field, disabled }) => {
  const t = useTranslations()
  const [options, setOptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    const mapped = countries.map(country => ({
      label: country.name.common,
      value: country.cca2
    }))
    const sorted = mapped.sort((a, b) => a.label.localeCompare(b.label))
    setOptions(sorted)
  }, [])

  const filteredOptions = options.filter(opt => opt.label?.toLowerCase().includes(inputValue.toLowerCase()))

  return (
    <Autocomplete
      fullWidth
      disabled={disabled}
      loading={loading}
      options={filteredOptions}
      getOptionLabel={option => option.label || ''}
      isOptionEqualToValue={(option, val) => option.value === val?.value}
      value={options.find(opt => opt.value === value) || null}
      onInputChange={(_, newInputValue) => {
        setInputValue(newInputValue)
      }}
      onChange={(e, newValue) => {
        onChange(newValue?.value || '')
      }}
      renderInput={params => (
        <CustomTextField
          {...params}
          label={`${t(field.label)}${field?.validation?.required ? '*' : ''}`}
          error={Boolean(error)}
          placeholder={field.placeholder || 'Type here'}
          helperText={error?.message}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            )
          }}
        />
      )}
    />
  )
}

export default CountriesAutocompleteField
