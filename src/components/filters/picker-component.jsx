'use client'

import { forwardRef } from 'react'
import TextField from '@mui/material/TextField'
import CustomTextField from '@/@core/components/mui/TextField'

const PickersComponent = forwardRef(({ value, label, error, onChange, showTimeSelect, ...props }, ref) => {
  return (
    <CustomTextField
      inputRef={ref}
      fullWidth
      {...props}
      label={label || ''}
      value={
        value
          ? new Date(value).toLocaleString('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              ...(showTimeSelect && {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              })
            })
          : ''
      }
      onChange={e => {
        try {
          const date = new Date(e.target.value).getTime()
          onChange(date)
        } catch (ex) {
          console.error(ex)
        }
      }}
    />
  )
})

export default PickersComponent
