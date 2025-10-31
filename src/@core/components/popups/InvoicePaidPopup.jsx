import { useState } from 'react'
import { Modal, Box, Typography, TextField, MenuItem, Button, IconButton } from '@mui/material'
import { AiOutlineClose } from 'react-icons/ai'
import CustomTextField from '../mui/TextField'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import { useTranslations } from 'next-intl'
import usePaymentOptions from '@/hooks/usePaymentOptions'

export default function PaymentPopup({ open, handleClose, onSubmit }) {
  const [payment, setPayment] = useState('')
  const [paymentDate, setPaymentDate] = useState(null)
  const [errors, setErrors] = useState({ payment: false, paymentDate: false })
  const { PAYMENT_METHODS } = usePaymentOptions()
  const t = useTranslations()

  const validateFields = () => {
    const newErrors = {
      payment: !payment,
      paymentDate: !paymentDate
    }
    setErrors(newErrors)
    return !newErrors.payment && !newErrors.paymentDate
  }

  const handleContinue = () => {
    if (!validateFields()) return // Stop submission if validation fails
    onSubmit({
      paymentDate: payment,
      paymentMode: new Date(paymentDate).getTime()
    })
    setPayment('')
    setPaymentDate(null)
    handleClose()
  }

  const handleCloseModal = () => {
    setPayment('')
    setPaymentDate(null)
    setErrors({ payment: false, paymentDate: false }) // Reset errors on close
    handleClose()
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <Box className='bg-white rounded-2xl shadow-lg p-6 w-96 mx-auto mt-20 relative'>
        <IconButton className='absolute top-2 right-2' onClick={handleCloseModal}>
          <AiOutlineClose size={20} />
        </IconButton>

        <Typography variant='h6' className='mb-4 text-gray-700'>
          {t('computeTaxes')}
        </Typography>

        <Typography className='mb-2 text-sm text-gray-600'>{t('computeTaxes')}</Typography>
        <TextField
          select
          fullWidth
          value={payment}
          onChange={e => setPayment(e.target.value)}
          variant='outlined'
          placeholder='Type to search'
          className='mb-2 bg-gray-50'
          error={errors.payment}
          helperText={errors.payment ? t('PaymentMethod') : ''}
        >
          {PAYMENT_METHODS?.map(method => (
            <MenuItem key={method.value} value={method.value}>
              {method.label}
            </MenuItem>
          ))}
        </TextField>

        <Typography className='mb-2 text-sm text-gray-600'>{t('paymentdate')}</Typography>
        <AppReactDatepicker
          boxProps={{ className: 'is-full' }}
          selected={paymentDate}
          placeholderText='MM/DD/YYYY'
          dateFormat='MM/dd/yyyy'
          onChange={setPaymentDate}
          customInput={
            <CustomTextField
              fullWidth
              style={{ minWidth: '100px', flexShrink: 0 }}
              error={errors.paymentDate}
              helperText={errors.paymentDate ? t('paymentRequired') : ''}
            />
          }
        />

        <Button
          fullWidth
          variant='contained'
          className='text-white py-2 rounded-lg mt-4'
          onClick={handleContinue}
          disabled={!payment || !paymentDate} // Disable button if fields are empty
        >
          {t('continue')}
        </Button>
      </Box>
    </Modal>
  )
}
