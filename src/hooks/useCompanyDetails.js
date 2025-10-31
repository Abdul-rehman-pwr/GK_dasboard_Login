import { useState, useEffect } from 'react'

import companyService from '@/services/companyService'
import responseHandler from '@/utils/responseHandler'
import toast from 'react-hot-toast'

const useCompanyDetails = () => {
  const [supplierDetail, setSupplierDetail] = useState(null)
  const [loading, setLoading] = useState(false)

  const getCompanyDetails = async () => {
    setLoading(true)
    try {
      const response = await companyService.getCompanyDetail()
      const { result, status, description } = responseHandler(response)
      if (status === '200') {
        if (result !== 'NOT_FOUND') {
          const mappedData = {
            companyName: result.companyName || '',
            isThisPrimaryActivity: result.isThisPrimaryActivity || 'PRIMARY_ACTIVITY',
            companyAccountType: result.companyAccountType || '',
            state: result.state || '',
            taxOffice: result.taxOffice || '',
            iban: result.iban,
            bic: result.bic,
            vatnumber: result.vatnumber,
            userInfo: result.userAccount
          }
          setSupplierDetail(mappedData)
        }
      } else {
        toast.error(t('noRecordsFound'))
      }
    } catch (err) {
      // toast.error(err?.message || 'An error occurred.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getCompanyDetails()
  }, [])

  return { supplierDetail, loading, refresh: getCompanyDetails }
}

export default useCompanyDetails
