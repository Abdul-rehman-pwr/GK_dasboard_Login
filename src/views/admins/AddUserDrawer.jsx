import { useState, useMemo, useEffect } from 'react'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import { useForm, FormProvider } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { toast } from 'react-hot-toast'
import { useTranslations } from 'next-intl'
import clientService from '@/services/clientService'
import responseHandler from '@/utils/responseHandler'
import FieldRenderer from './field-renderor'
import { countries, USERTYPES } from '@/configs/app'
import { getClientValidationSchema } from './validation'
import { FaExclamationTriangle } from 'react-icons/fa'
import userService from '@/services/userService'

const defaultValues = {
  firstName: '',
  lastName: '',
  email: '',
  city: '',
  phoneNumber: '',
  password: ''
}

const AddUserDrawer = ({ open, handleClose, successCallBack, user, editMode }) => {
  const [loading, setLoading] = useState(false)
  const t = useTranslations()

  const fields = [
    { label: t('firstName'), field: 'firstName', type: 'text', required: true },
    { label: t('lastName'), field: 'lastName', type: 'text', required: true },
    { label: 'Email', field: 'email', type: 'email', required: true },
    { label: t('cityLabel'), field: 'city', type: 'text', required: false },
    { label: `${t('phoneNumber')}`, field: 'phoneNumber', type: 'tel', required: false },
    { label: t('password'), field: 'password', type: 'password', required: true }
  ]

  const methods = useForm({
    resolver: yupResolver(getClientValidationSchema(t)),
    defaultValues
  })

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = methods

  useEffect(() => {
    reset(editMode && user ? { ...defaultValues, ...user } : defaultValues)
  }, [editMode, user, reset])

  const onSubmit = async data => {
    try {
      setLoading(true)
      const requestPayload = { ...data, accountTypeId: USERTYPES.pharmacy_admin }
      let response
      if (editMode) {
        response = await userService.addUser(user.id, requestPayload)
      } else {
        response = await userService.addUser(requestPayload)
      }

      const { result, status, description } = await responseHandler(response)

      if (status === '200') {
        successCallBack(description)
        reset({})
        toast.success(editMode ? t('pharmacyAdminSavedSuccessfully') : t('pharmacyAdminCreatedSuccessfully'))
        handleClose()
      } else {
        toast.error(description || t('error'))
      }
    } catch (err) {
      toast.error(t('error'))
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    handleClose()
    reset({})
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
        <Typography variant='h5'>{editMode ? t('pharmacyAdmin') : t('addPharmacyAdmin')}</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='bx-x text-textPrimary text-2xl' />
        </IconButton>
      </div>

      <div className='p-6'>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
            {fields.map(field => (
              <FieldRenderer key={field.field} control={control} field={field} errors={errors} />
            ))}
            <div className='flex items-center gap-4'>
              <Button variant='contained' type='submit' disabled={loading}>
                {loading ? `${t('saving')}...` : t('submit')}
              </Button>
              <Button variant='tonal' color='error' type='reset' onClick={handleReset}>
                {t('cancel')}
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </Drawer>
  )
}

export default AddUserDrawer
