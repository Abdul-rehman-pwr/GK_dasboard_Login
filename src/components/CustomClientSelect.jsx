import React from 'react'
import { MenuItem } from '@mui/material'
import CustomTextField from '@/@core/components/mui/TextField'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'

const CustomClientSelect = ({
  options,
  value,
  onChange,
  error,
  helperText,
  disabled = false,
  maxItems = 5,
  className = '',
  isBelowSmScreen = false
}) => {
  const defaultClasses = classNames('min-is-[220px] mb-2', { 'is-1/2': isBelowSmScreen }, className)
  const t = useTranslations()
  return (
    <CustomTextField
      select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={defaultClasses}
      error={error}
      helperText={helperText}
    >
      {options && options.length > 0 ? (
        options.slice(0, maxItems).map(
          (option, index) =>
            option?.name?.trim() && (
              <MenuItem key={index} value={option.id}>
                {option.name}
              </MenuItem>
            )
        )
      ) : (
        <MenuItem value='' disabled>
          {t('noClients')}
        </MenuItem>
      )}
    </CustomTextField>
  )
}

export default CustomClientSelect
