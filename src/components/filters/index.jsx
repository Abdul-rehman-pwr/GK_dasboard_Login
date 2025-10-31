'use client'

import { Card, CardHeader, CardContent, Box, Typography, Collapse, IconButton } from '@mui/material'
import { FaAngleDown, FaAngleUp, FaFilter } from 'react-icons/fa6'
import { useForm } from 'react-hook-form'
import { useState, useMemo } from 'react'
import FilterFieldsMapper from './filter-fields-mapper'
import FilterButtons from './filter-buttons'
import { useTranslations } from 'next-intl'
import { formatField } from '@/utils/formatFilters'

export default function Filters({ fields = [], submit = () => {}, dataPassToAPI, loading = false }) {
  const [isOpen, setIsOpen] = useState(false)
  const t = useTranslations()

  const defaultValues = useMemo(() => {
    return fields.reduce((acc, field) => {
      acc[field.name] = field.defaultValue !== undefined ? field.defaultValue : ''
      return acc
    }, {})
  }, [fields])

  const methods = useForm({
    defaultValues,
    mode: 'onChange',

    context: { isFromToValidation: true }
  })

  const {
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
    setValue,
    trigger
  } = methods

  const currentValues = watch()

  const formattedData = useMemo(() => {
    if (!currentValues || !fields.length) return []

    return Object.entries(currentValues)
      .filter(([_, value]) => value !== null && value !== undefined && value !== '')
      .flatMap(([key, value]) => {
        const field = fields.find(f => f.name === key)
        return formatField(key, value, field)
      })
  }, [currentValues, fields])

  const onSubmit = () => {
    submit({ ...dataPassToAPI, values: formattedData })
  }

  const handleReset = () => {
    reset(defaultValues)

    submit({ ...dataPassToAPI, values: [] })
  }

  return (
    <Card>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FaFilter />
            <Typography sx={{ fontSize: '1.05rem' }}>{t('Filters')}</Typography>
          </Box>
        }
        action={
          <IconButton size='sm' onClick={() => setIsOpen(x => !x)}>
            {isOpen ? <FaAngleUp size={16} /> : <FaAngleDown size={16} />}
          </IconButton>
        }
      />
      <Collapse in={isOpen}>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FilterFieldsMapper
              fields={fields}
              control={control}
              errors={errors}
              setValue={setValue}
              trigger={trigger}
              currentValues={currentValues}
            />
            <Box mt={3}>
              <FilterButtons formattedData={formattedData} loading={loading} handleReset={handleReset} />
            </Box>
          </form>
        </CardContent>
      </Collapse>
    </Card>
  )
}
