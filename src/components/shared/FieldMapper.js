'use client'
import { Controller } from 'react-hook-form'
import CustomTextField from '@core/components/mui/TextField'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import { useState } from 'react'

export default function FieldMapper({ fields, control, errors, t }) {
  const [showPassword, setShowPassword] = useState(false)
  const togglePassword = () => setShowPassword(p => !p)

  return fields.map(field => (
    <Controller
      key={field.name}
      name={field.name}
      control={control}
      render={({ field: controllerField }) => (
        <CustomTextField
          {...controllerField}
          fullWidth={field.fullWidth}
          autoFocus={field.autoFocus}
          label={field.label}
          placeholder={field.placeholder}
          type={field.type === 'password' ? (showPassword ? 'text' : 'password') : field.type}
          error={!!errors[field.name]}
          helperText={errors[field.name]?.message}
          InputProps={
            field.endAdornment
              ? {
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton edge='end' onClick={togglePassword} onMouseDown={e => e.preventDefault()}>
                        <i className={showPassword ? 'bx-hide' : 'bx-show'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }
              : undefined
          }
        />
      )}
    />
  ))
}
