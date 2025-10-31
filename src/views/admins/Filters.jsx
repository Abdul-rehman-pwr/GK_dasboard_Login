import { useState, useEffect, useMemo } from 'react'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import { useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { countries } from '@/configs/app'
import FieldRenderer from './field-renderor'

const Filters = ({ open, handleClose, filters = [], setFilters = () => {} }) => {
  const [loading, setLoading] = useState(false)
  const t = useTranslations()

  const fields = [
    { label: t('clientName'), field: 'name', type: 'text' },
    { label: 'Email', field: 'email', type: 'email' },
    // { label: 'Company Name', field: 'company', type: 'text' },
    {
      label: t('countryLabel'),
      field: 'country',
      type: 'auto-select',
      options: countries
    },
    {
      label: t('clientType'),
      field: 'clientType',
      type: 'select',
      options: [
        { value: 'PUBLIC', label: 'businessOrganization' },
        { value: 'PRIVATE', label: 'privateIndividualorOrganization' }
      ]
    }
  ]

  const defaultValues = useMemo(() => {
    return fields.reduce(
      (acc, { field }) => {
        const appliedFilter = filters.find(filter => filter.fieldName === field)
        acc[field] = appliedFilter ? appliedFilter.fieldValue : ''
        return acc
      },
      {
        clientType: filters.find(f => f.fieldName === 'clientType')?.fieldValue || 'Business',
        country: filters.find(f => f.fieldName === 'country')?.fieldValue || ''
      }
    )
  }, [filters])

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues
  })

  useEffect(() => {
    if (open) {
      reset(defaultValues)
    }
  }, [open, defaultValues, reset])

  const onSubmit = data => {
    const filterFields = [...fields]

    const newFilters = filterFields
      .filter(({ field, default: defaultValue }) => data[field] && data[field] !== defaultValue)
      .map(({ field }) => ({
        fieldName: field,
        fieldValue: data[field],
        searchOperator: 'LIKE'
      }))

    setFilters(newFilters)
    handleClose()
  }

  const handleReset = () => {
    handleClose()
    reset(defaultValues)
    setFilters([])
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleReset}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <div className='flex items-center justify-between p-6'>
        <Typography variant='h5'>{t('addFilters')}</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='bx-x text-textPrimary text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <div className='p-6 flex-1'>
        <form onSubmit={handleSubmit(onSubmit)} className='flex  justify-between flex-col h-full'>
          <div className='flex flex-1 flex-col gap-6'>
            {fields?.map(field => (
              <FieldRenderer key={field.field} control={control} field={field} errors={errors} />
            ))}
          </div>
          <div className='flex items-center gap-4'>
            <Button variant='contained' type='submit' disabled={loading}>
              {loading ? 'Saving...' : t('applyFilters')}
            </Button>
            <Button variant='tonal' color='error' type='reset' onClick={handleReset}>
              {t('clearFilters')}
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  )
}

export default Filters
