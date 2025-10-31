'use client'
import { useState, useEffect } from 'react'
import invoiceService from '@/services/invoiceService'
import responseHandler from '@/utils/responseHandler'
import { convertToDefaultValues } from '@/utils/convertToDefaultValues'

const useFetchInvoiceData = (id, tab) => {
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
        const response =
          tab === 'invoices' || tab === 'recurringInvoices'
            ? await invoiceService.getByInvoiceId(id)
            : await invoiceService.getBySentInvoiceId(id)

        const { result, status, description } = responseHandler(response)

        if (status === '200') {
          setData(convertToDefaultValues(result))
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
  }, [id, tab])

  return { data, loading, error }
}

export default useFetchInvoiceData
