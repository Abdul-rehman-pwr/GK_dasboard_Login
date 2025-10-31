// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import HorizontalWithSubtitle from '@components/card-statistics/HorizontalWithSubtitle'
import { useEffect, useState } from 'react'
import clientService from '@/services/clientService'
import responseHandler from '@/utils/responseHandler'
import toast from 'react-hot-toast'
import { useTranslations } from 'next-intl'

// Vars
const HomeCards = () => {
  const t = useTranslations()
  const [info, setInfo] = useState({
    privateClientCount: 0,
    publicClientCount: 0,
    totalClientCount: 0,
    invoiceCount: 0,
    quoteCount: 0
  })

  const getStatsInfo = async () => {
    try {
      const response = await clientService.gethomeStats()
      const { result, status, description } = responseHandler(response)
      if (status === '200') {
        setInfo(result)
      } else {
        toast.error(t('error'))
      }
    } catch (err) {
      toast.error(t('error'))
    }
  }

  useEffect(() => {
    getStatsInfo()
  }, [])

  const data = [
    {
      title: t('Invoices'),
      stats: info.invoiceCount || '0',
      avatarIcon: 'bx-receipt', // Icon for Invoices
      avatarColor: 'primary',
      trend: 'positive',
      trendNumber: '29%',
      subtitle: t('totalInvoices')
    },
    {
      title: t('quotes'),
      stats: info.quoteCount || '0',
      avatarIcon: 'bx-file', // Icon for Quotes
      avatarColor: 'error',
      trend: 'positive',
      trendNumber: '18%',
      subtitle: t('totalQuotes')
    },
    {
      title: t('Clients'),
      stats: info.clientCount || '0',
      avatarIcon: 'bx-user-check', // Icon for Clients
      avatarColor: 'success',
      trend: 'negative',
      trendNumber: '14%',
      subtitle: t('totalClients')
    }
  ]

  return (
    <Grid container spacing={6}>
      {data.map((item, i) => (
        <Grid key={i} item xs={12} sm={6} md={4}>
          <HorizontalWithSubtitle {...item} />
        </Grid>
      ))}
    </Grid>
  )
}

export default HomeCards
