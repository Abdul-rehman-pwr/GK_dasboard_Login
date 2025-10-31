// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import HorizontalWithSubtitle from '@components/card-statistics/HorizontalWithSubtitle'
import { useEffect, useState } from 'react'
import clientService from '@/services/clientService'
import responseHandler from '@/utils/responseHandler'
import toast from 'react-hot-toast'
import { useTranslations } from 'next-intl'

// Component
const UserListCards = () => {
  const t = useTranslations()
  const [info, setInfo] = useState({
    privateClientCount: 0,
    publicClientCount: 0,
    totalClientCount: 0
  })

  const getStatsInfo = async () => {
    try {
      const response = await clientService.getClientStats()
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

  // useEffect(() => {
  //   getStatsInfo()
  // }, [])

  const data = [
    {
      title: t('totalClients'),
      stats: info.totalClientCount.toString(),
      avatarIcon: 'bx-group',
      avatarColor: 'primary',
      trend: 'positive',
      trendNumber: '29%',
      subtitle: t('totalClients')
    },
    {
      title: t('businessOrganization'),
      stats: info.publicClientCount.toString(),
      avatarIcon: 'bx-building',
      avatarColor: 'error',
      trend: 'positive',
      trendNumber: '18%',
      subtitle: t('totalBusinessClients')
    },
    {
      title: t('privateIndividualorOrganization'),
      stats: info.privateClientCount.toString(),
      avatarIcon: 'bx-user',
      avatarColor: 'success',
      trend: 'negative',
      trendNumber: '14%',
      subtitle: t('totalPrivateClients')
    }
  ]

  return (
    <Grid container spacing={6} justifyContent='space-evenly'>
      {data.map((item, i) => (
        <Grid key={i} item xs={12} sm={6} md={3}>
          <HorizontalWithSubtitle {...item} />
        </Grid>
      ))}
    </Grid>
  )
}

export default UserListCards
