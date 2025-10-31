import React, { useState, useEffect } from 'react'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import { toast, Toaster } from 'react-hot-toast'
import companyService from '@/services/companyService'
import responseHandler from '@/utils/responseHandler'
import FormFieldsRenderor from './FormFieldsRenderor'
import generateValidationSchema from './generateSchema'
import useCompanyFields from './formFields'
import { useTranslations } from 'next-intl'

const AddCompanyDetails = ({ setFormState }) => {
  const { formFields } = useCompanyFields()
  const t = useTranslations()
  const [formSubmitting, setFormSubmitting] = useState(false)
  const validationSchema = generateValidationSchema(t)
  const {
    handleSubmit,
    control,
    formState: { errors, isDirty }
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: formFields.reduce((acc, field) => {
      acc[field.name] = field.name === 'isThisPrimaryActivity' ? 'PRIMARY_ACTIVITY' : ''
      return acc
    }, {})
  })

  const onSubmit = async formData => {
    setFormSubmitting(true)
    try {
      const response = await companyService.createCompany(formData)
      const { result, status, description } = responseHandler(response)

      if (status == '200') {
        toast.success(t('companyInformationAddedSuccessfully'))
        setTimeout(() => {
          setFormState('edit')
        }, 2000)
        return
      } else {
        toast.error(result ? result[Object.keys(result)[0]] : description)
        return
      }
    } catch (err) {
      toast.error(t('response_processing_error'))
    } finally {
      setFormSubmitting(false)
    }
  }

  return (
    <Card>
      <Toaster position='top-right' reverseOrder={false} toastOptions={{ duration: 4000 }} />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={6}>
            {formFields?.map((field, index) => (
              <FormFieldsRenderor key={index} field={field} control={control} errors={errors} />
            ))}
            <Grid item xs={12} className='flex gap-4 flex-wrap'>
              <Button variant='contained' type='submit' disabled={!isDirty || formSubmitting}>
                {formSubmitting ? `${t('saving')}...` : t('saveChanges')}
              </Button>
              <Button variant='contained' color='error' type='reset' disabled={formSubmitting || !isDirty}>
                {t('reset')}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default AddCompanyDetails
