'use client'
import { useState, useEffect } from 'react'
import invoiceService from '@/services/invoiceService'
import responseHandler from '@/utils/responseHandler'

const useFetchRecurringInvoiceById = id => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        return
      }

      setLoading(true)
      try {
        const response = await invoiceService.getRecurringInvoiceById(id)

        const { result, status, description } = responseHandler(response)
        if (status === '200') {
          setData(result)
        } else {
          setError(description)
        }
      } catch (err) {
        setError(err?.message || 'An error occurred.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  return { data, loading, error }
}

export default useFetchRecurringInvoiceById
