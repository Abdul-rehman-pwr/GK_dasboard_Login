'use client'

import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, MenuItem, TextField, Box } from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { LoadingButton } from '@mui/lab'
import pharmacyServices from '@/services/pharmacy-services'
import { useSearchParams } from 'next/navigation'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useTranslations } from 'next-intl'

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']

const WorkingHourFormDialog = ({ data = [], open, onClose, editingRow, onSuccess, onFailure = () => {} }) => {
  const t = useTranslations()
  const searchParams = useSearchParams()
  const pharmacyId = searchParams.get('pharmacyId')
  const source = searchParams.get('source')

  const getTimeForInput = epoch => {
    const date = new Date(epoch)
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${hours}:${minutes}`
  }

  const timeSchema = Yup.string()
    .required(t('openingTimeRequired'))
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, t('timeValidation'))

  const validationSchema = Yup.object().shape({
    openingTime: timeSchema,
    closingTime: timeSchema.test('is-greater', t('closingTimeRequired'), function (value) {
      const { openingTime } = this.parent
      if (!openingTime || !value) return true

      // Convert "HH:mm" to minutes
      const [openHour, openMinute] = openingTime.split(':').map(Number)
      const [closeHour, closeMinute] = value.split(':').map(Number)

      const openTotal = openHour * 60 + openMinute
      const closeTotal = closeHour * 60 + closeMinute

      return closeTotal > openTotal
    }),
    bufferTime: Yup.number()
      .transform((value, originalValue) => {
        return originalValue === '' ? null : value
      })
      .required(t('bufferTimeRequired'))
      .min(0, t('bufferTimeValidation')),
    source: Yup.string().optional(),
    pharmacyId: Yup.string().required(t('pharmacyIdRequired')),
    dayOfWeek: Yup.string().required(t('dayOfWeekRequired'))
  })

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting }
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      openingTime: '',
      closingTime: '',
      bufferTime: 0,
      source: source,
      pharmacyId: pharmacyId,
      dayOfWeek: ''
    }
  })

  useEffect(() => {
    if (editingRow) {
      reset({
        openingTime: getTimeForInput(editingRow.openingTime),
        closingTime: getTimeForInput(editingRow.closingTime),
        bufferTime: editingRow.bufferTime ?? '',
        source: editingRow.source,
        pharmacyId: editingRow.pharmacyId,
        dayOfWeek: editingRow.dayOfWeek
      })
    } else {
      reset({ dayOfWeek: '', openingTime: '', closingTime: '', bufferTime: 0, source: source, pharmacyId: pharmacyId })
    }
  }, [editingRow, reset])

  const getEpoch = time => {
    const today = new Date()
    const [hour, minute] = time.split(':')
    return new Date(today.getFullYear(), today.getMonth(), today.getDate(), parseInt(hour), parseInt(minute)).getTime()
  }

  const onSubmit = async values => {
    const openingDate = getEpoch(values.openingTime)
    const closingDate = getEpoch(values.closingTime)

    const payload = {
      ...values,
      openingTime: openingDate,
      closingTime: closingDate
    }

    const resetForm = () =>
      reset({
        dayOfWeek: '',
        openingTime: '',
        closingTime: '',
        bufferTime: 0,
        source: source,
        pharmacyId: pharmacyId
      })

    const createWorkingHour = new Promise((resolve, reject) => {
      pharmacyServices
        .createWorkingHour(payload)
        .then(response => {
          if (response?.status == 200) {
            onSuccess()
            resolve(response?.description || t('operationSuccessful'))
          } else {
            onFailure()
            reject(response?.description || t('error'))
          }
        })
        .catch(error => {
          reject(error || t('error'))
        })
        .finally(() => {
          resetForm()
          onFailure()
        })
    })

    await toast.promise(createWorkingHour, {
      loading: t('savingWorkingHours'),
      success: msg => msg,
      error: err => err
    })
  }

  const returnRemainingDays = () => {
    if (editingRow) return DAYS
    if (data.length) {
      const usedDays = data?.map(d => d.dayOfWeek) || []
      const remainingDays = DAYS.filter(day => !usedDays?.includes(day))
      return remainingDays || []
    } else {
      return DAYS
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='xs'>
      <DialogTitle>{editingRow ? t('editWorkingHour') : t('addWorkingHour')}</DialogTitle>
      <Box component='form' onSubmit={handleSubmit(onSubmit)} sx={{ pt: 0 }}>
        <DialogContent sx={{ pt: 0 }}>
          <Controller
            name='dayOfWeek'
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label={t('day')}
                disabled={Boolean(editingRow)}
                select
                fullWidth
                margin='normal'
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              >
                {returnRemainingDays().map(day => (
                  <MenuItem key={day} value={day}>
                    {t(day)}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          <Controller
            name='openingTime'
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label={t('startTime')}
                type='time'
                fullWidth
                margin='normal'
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                InputLabelProps={{ shrink: true }}
              />
            )}
          />

          <Controller
            name='closingTime'
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label={t('endTime')}
                type='time'
                fullWidth
                margin='normal'
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                InputLabelProps={{ shrink: true }}
              />
            )}
          />

          <Controller
            name='bufferTime'
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label={t('bufferMinutes')}
                type='number'
                fullWidth
                margin='normal'
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                inputProps={{ min: 0 }}
              />
            )}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>{t('cancel')}</Button>
          <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
            {editingRow ? t('update') : t('add')}
          </LoadingButton>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

export default WorkingHourFormDialog
