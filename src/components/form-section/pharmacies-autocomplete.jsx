'use client'

import React, { useEffect, useState } from 'react'
import { Autocomplete, CircularProgress } from '@mui/material'
import { useTranslations } from 'next-intl'
import CustomTextField from '@/@core/components/mui/TextField'
import pharmacyServices from '@/services/pharmacy-services'

const PharmacyAutocompleteField = ({ value, onChange, error, field, disabled }) => {
  const t = useTranslations()
  const [options, setOptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const payload = {
        page: 0,
        size: 100,
        source: 'custom',
        values: []
      }
      try {
        const res = await pharmacyServices.getPharmacies(payload)
        if (res?.status == 200) {
          const mapped = res?.data?.content?.map(admin => ({
            label: admin.pharmacyName,
            value: admin.pharmacyId
          }))
          setOptions(mapped)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredOptions = options.filter(opt => opt.label?.toLowerCase().includes(inputValue.toLowerCase()))

  return (
    <Autocomplete
      fullWidth
      loading={loading}
      disabled={disabled}
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

export default PharmacyAutocompleteField
