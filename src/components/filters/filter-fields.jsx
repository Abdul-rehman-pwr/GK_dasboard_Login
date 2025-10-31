'use client'

import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  FormHelperText,
  Box,
  InputAdornment,
  IconButton
} from '@mui/material'
import DatePicker from 'react-datepicker'
import DatePickerWrapper from '@/@core/styles/libs/react-datepicker'
import PickersComponent from './picker-component'
import CustomTextField from '@/@core/components/mui/TextField'
import { GridCloseIcon } from '@mui/x-data-grid'

export default function FilterField({ field, value, onChange, error, setValue, trigger, currentValues }) {
  if (field.type === 'select') {
    return (
      <Box>
        <CustomTextField
          select
          fullWidth
          label={field.label}
          value={value ?? ''}
          onChange={onChange}
          error={Boolean(error)}
          helperText={error?.message}
          variant='filled'
          size='small'
          InputLabelProps={{ shrink: true }}
        >
          {field.options?.map((option, index) => (
            <MenuItem key={index} value={option.value} disabled={option?.disabled || false}>
              {option.label}
            </MenuItem>
          ))}
        </CustomTextField>
      </Box>
    )
  } else if (field.type === 'date-range') {
    const startDate = value?.[0] !== null ? `${new Date(value[0]).toLocaleDateString()}` : ''
    const endDate = value?.[1] !== null ? ` - ${new Date(value[1]).toLocaleDateString()}` : ''
    const formattedValue = `${startDate}${endDate}`

    return (
      <DatePickerWrapper>
        <DatePicker
          selectsRange
          monthsShown={2}
          startDate={value?.[0] ? new Date(value[0]) : null}
          endDate={value?.[1] ? new Date(value[1]) : null}
          onChange={dates => {
            const [start, end] = dates || []
            onChange([start ? start.getTime() : null, end ? end.getTime() : null])
          }}
          isClearable
          placeholderText={`${field.label}`}
          customInput={<CustomTextField fullWidth value={formattedValue} label={field.label || ''} />}
        />
      </DatePickerWrapper>
    )
  } else if (field.type === 'autocomplete') {
    return (
      <Autocomplete
        options={field.options || []}
        id={field.name}
        value={field.options?.find(opt => opt.value === value) || null}
        onChange={(_, newVal) => {
          setValue(field.name, newVal?.value ?? null)
        }}
        getOptionLabel={option => option?.label || ''}
        isOptionEqualToValue={(option, val) => option?.value === val?.value}
        renderInput={params => (
          <CustomTextField
            {...params}
            fullWidth
            label={field.label}
            placeholder={field.placeholder || 'Type Here'}
            error={Boolean(error)}
            helperText={error?.message}
          />
        )}
      />
    )
  } else {
    return (
      <Box>
        <CustomTextField
          label={field.label}
          fullWidth
          type={field.type}
          value={value || ''}
          onChange={onChange}
          placeholder={field.placeholder || 'Type Here'}
          error={Boolean(error)}
          helperText={error?.message}
          variant='filled'
          size='small'
          InputLabelProps={{ shrink: true }}
        />
      </Box>
    )
  }
}
