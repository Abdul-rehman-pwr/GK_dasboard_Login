'use client'

// React Imports
import { Fragment, useState } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { useTranslations } from 'next-intl'

const ConfirmationDialog = ({
  open,
  type,
  heading,
  text,
  onProceed = () => {},
  onCancel = () => {},
  loading = false
}) => {
  const Wrapper = type === 'suspend-account' ? 'div' : Fragment
  const t = useTranslations()
  const handleConfirmation = value => {
    if (value) {
      // YES
      onProceed()
    } else {
      // NO
      onCancel()
    }
  }

  return (
    <Dialog fullWidth maxWidth='xs' open={open} onClose={onCancel}>
      <DialogContent className='flex items-center flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        <i className='bx-error-circle text-[88px] mbe-6 text-warning' />
        <Wrapper
          {...(type === 'suspend-account' && {
            className: 'flex flex-col items-center gap-2'
          })}
        >
          <Typography variant='h4'>{heading}</Typography>
          <Typography color='text.primary'>{text}</Typography>
        </Wrapper>
      </DialogContent>
      <DialogActions className='max-sm:flex-col max-sm:gap-4 justify-center pbs-0 sm:pbe-16 sm:pli-16'>
        <Button
          variant='contained'
          onClick={() => handleConfirmation(true)}
          disabled={loading}
          className='max-sm:is-full'
        >
          {t('yes')}
        </Button>
        <Button
          variant='tonal'
          color='secondary'
          onClick={() => {
            handleConfirmation(false)
          }}
          disabled={loading}
          className='max-sm:mis-0 max-sm:is-full'
        >
          {t('cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmationDialog
