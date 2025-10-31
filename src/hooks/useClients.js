import { useState, useEffect } from 'react'

import responseHandler from '@/utils/responseHandler'
import toast from 'react-hot-toast'
import clientService from '@/services/clientService'
import { useTranslations } from 'next-intl'

const useClients = () => {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(false)
  const t = useTranslations()
  const getClients = async () => {
    setLoading(true)
    try {
      const response = await clientService.getAllClients()
      const { result, status, description } = responseHandler(response)

      if (status === '200') {
        setClients(result?.content)
      }
    } catch (err) {
      toast.error(t('somethingWentWrong'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getClients()
  }, [])

  return { clients, loading, refresh: getClients }
}

export default useClients
