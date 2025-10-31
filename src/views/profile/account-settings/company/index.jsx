'use client'
import { useState, useEffect } from 'react'
import companyService from '@/services/companyService'
import Grid from '@mui/material/Grid'
import responseHandler from '@/utils/responseHandler'
import AddCompanyDetails from './AddCompanyDetails'
import EditCompanyDetails from './EditCompanyDetails'
import LoadingFallback from '@/components/shared/loading'

const Security = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [formState, setFormState] = useState('')
  const getCompanyDetails = async () => {
    setLoading(true)
    try {
      const response = await companyService.getCompanyDetail()
      const { result, status } = responseHandler(response)

      if (status == '200') {
        setData(result)
        setLoading(false)
      }
    } catch (err) {
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    if (data) {
      setFormState('edit')
    }
  }, [data, formState])
  useEffect(() => {
    getCompanyDetails()
  }, [formState])

  if (loading) return <LoadingFallback />
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        {formState === 'edit' ? (
          <EditCompanyDetails loading={loading} data={data} getCompanyDetails={getCompanyDetails} />
        ) : (
          <AddCompanyDetails setData={setData} setFormState={setFormState} loading={loading} data={data} />
        )}
      </Grid>
    </Grid>
  )
}

export default Security
