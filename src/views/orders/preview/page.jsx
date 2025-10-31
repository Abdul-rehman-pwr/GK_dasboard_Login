'use client'

// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import PreviewActions from './PreviewActions'
import PreviewCard from './PreviewCard'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import orderService from '@/services/orderService'
import OrderPreviewSkeleton from '@/components/skeleton/order-preview-skeleton'
import PageHeader from '@/components/shared/page-header'
import { useTranslations } from 'next-intl'

const Preview = ({ invoiceData }) => {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const t = useTranslations()
  const [answers, setAnswers] = useState({})
  const [orderDetail, setOrderDetail] = useState({})
  const [loading, setLoading] = useState(false)

  // Handle Print Button Click
  const handleButtonClick = () => {
    window.print()
  }

  // Fetch Order Detail
  const getOrder = async orderId => {
    try {
      setLoading(true)
      const response = await orderService.getOrderById(orderId)
      if (response?.status === 200) {
        const ordersData = response?.data?.data ?? {}
        const heyFlowId = ordersData.heyflowId
        setOrderDetail(ordersData)
        getAnswers(heyFlowId)
      } else {
        console.error('Unexpected status:', response?.status)
        setOrderDetail({})
      }
    } catch (error) {
      console.error('Error fetching order:', error)
      setOrderDetail({})
    } finally {
      setLoading(false)
    }
  }

  const getAnswers = async heyFlowId => {
    try {
      const res = await orderService.getEligibilityForm({ heyFlowId: heyFlowId })
      setAnswers(res?.data ?? {})
    } catch (error) {
      console.error('Error fetching answers:', error)
      setAnswers({})
    }
  }

  useEffect(() => {
    if (id) {
      getOrder(id)
    }
  }, [id])

  return (
    <>
      <PageHeader
        heading={t('order')}
        breadcrumbs={[
          {
            label: t('Orders'),
            href: '/orders'
          },
          {
            label: `${t('order')} #${id}`
          }
        ]}
      />
      <Grid container spacing={6}>
        {loading ? (
          <Grid item xs={12}>
            <OrderPreviewSkeleton />
          </Grid>
        ) : (
          <>
            <Grid item xs={12} lg={8} xl={9}>
              <PreviewCard
                onlineServiceFee={answers?.doctor_fee}
                invoiceData={invoiceData}
                id={id}
                orderDetail={orderDetail}
                loading={loading}
              />
            </Grid>
            <Grid item xs={12} lg={4} xl={3}>
              <PreviewActions
                id={id}
                heyFlowId={orderDetail.heyflowId}
                answers={answers}
                orderDetail={orderDetail}
                onButtonClick={handleButtonClick}
              />
            </Grid>
          </>
        )}
      </Grid>
    </>
  )
}

export default Preview
