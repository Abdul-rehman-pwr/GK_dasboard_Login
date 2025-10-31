import CustomTextField from '@/@core/components/mui/TextField'
import { Autocomplete } from '@mui/material'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

const AutoCompleteField = ({ field, value, onChange, error }) => {
  const t = useTranslations()
  const [inputValue, setInputValue] = useState('')

  // Filter options based on typed text
  const filteredOptions = (field.options || []).filter(opt =>
    opt.label?.toLowerCase().includes(inputValue.toLowerCase())
  )

  return (
    <Autocomplete
      fullWidth
      options={filteredOptions}
      getOptionLabel={option => option.label || ''}
      isOptionEqualToValue={(option, val) => option.value === val?.value}
      value={field.options?.find(opt => opt.value === value) || null}
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
        />
      )}
    />
  )
}
export default AutoCompleteField
