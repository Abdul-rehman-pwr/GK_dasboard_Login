import React, { useEffect, useState } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import pharmacyServices from '@/services/pharmacy-services'
import CustomTextField from '@/@core/components/mui/TextField'
import { Controller, useWatch } from 'react-hook-form'

const PharmacyAutoComplete = ({ setValue, value = {}, errors, control, disabled = false }) => {
  const [data, setData] = useState([]) // full pharmacy objects
  const [options, setOptions] = useState([]) // { label, value }
  const [inputValue, setInputValue] = useState('')
  const [selectedOption, setSelectedOption] = useState({ label: '', value: '' })

  const fetchPharmacies = async () => {
    try {
      const payload = {
        page: 0,
        size: 100,
        source: 'custom',
        values: []
      }
      const res = await pharmacyServices.getPharmacies(payload)
      if (res.status == 200 || res.status == 201) {
        const fetched = res.data.content || []
        setData(fetched)
        const mappedOptions = fetched.map(p => ({
          label: p.pharmacyName,
          value: p.pharmacyId
        }))
        setOptions(mappedOptions)
        if (mappedOptions.length === 1) {
          handlePharmacyAuto(fetched, mappedOptions[0])
        }
      }
    } catch (err) {
      console.error('Failed to fetch pharmacies:', err)
    }
  }

  const handlePharmacyAuto = (data, newValue) => {
    setSelectedOption(newValue)
    const selectedPharmacy = data.find(p => p.pharmacyId === newValue.value)
    if (selectedPharmacy) {
      setValue('pharmacyId', selectedPharmacy.pharmacyId)
      setValue('pharmacyName', selectedPharmacy.pharmacyName)
      setValue('pharmacyDomain', selectedPharmacy.domain)
      setValue('source', selectedPharmacy.source)
      console.log('Selected Pharmacy:', selectedPharmacy.pharmacyId)
    }
  }

  useEffect(() => {
    fetchPharmacies()
  }, [])

  useEffect(() => {
    if (value?.label && value?.value) {
      setSelectedOption(value)
    }
  }, [value])

  const handleChange = (event, newValue) => {
    if (newValue) {
      setSelectedOption(newValue)
      const selectedPharmacy = data.find(p => p.pharmacyId === newValue.value)
      if (selectedPharmacy) {
        setValue('pharmacyId', selectedPharmacy.pharmacyId)
        setValue('pharmacyName', selectedPharmacy.pharmacyName)
        setValue('pharmacyDomain', selectedPharmacy.domain)
        setValue('source', selectedPharmacy.source)
      }
    } else {
      // Clear values if nothing selected
      setValue('pharmacyId', '')
      setValue('pharmacyName', '')
      setValue('pharmacyDomain', '')
      setValue('source', '')
    }
  }

  return (
    <Controller
      name='pharmacyId'
      control={control}
      render={({ field }) => (
        <Autocomplete
          fullWidth
          options={options}
          getOptionLabel={option => option.label || ''}
          isOptionEqualToValue={(option, value) => option.value === value}
          value={options.find(opt => opt.value === field.value) || null}
          onChange={(e, newValue) => {
            if (newValue) {
              field.onChange(newValue.value)
              handlePharmacyAuto(data, newValue)
            } else {
              field.onChange('')
              setValue('pharmacyName', '')
              setValue('pharmacyDomain', '')
              setValue('source', '')
            }
          }}
          inputValue={inputValue}
          onInputChange={(e, newVal) => setInputValue(newVal)}
          disabled={disabled}
          renderInput={params => (
            <CustomTextField
              {...params}
              label='Pharmacy'
              placeholder='Search Pharmacy'
              error={!!errors?.pharmacyId}
              helperText={errors?.pharmacyId?.message}
            />
          )}
        />
      )}
    />
  )
}

export default PharmacyAutoComplete
