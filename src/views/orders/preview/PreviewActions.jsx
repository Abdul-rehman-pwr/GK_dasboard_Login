'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import { useLocale, useTranslations } from 'next-intl'
import getLocalizedURL from '@/utils/getLocalizedUrl'
import { Box, Checkbox, Typography } from '@mui/material'
import questions from '@/data/questions.json'
import signService from '@/services/signService'
import toast, { Toaster } from 'react-hot-toast'
import { Icon } from '@iconify/react'
import QuestionItem from '../detail/questionItem'
import PDFExample from './InvoicePdf'
import { PrescriptionPDF } from './prescription'
import { pdf } from '@react-pdf/renderer'
import { useAuth } from '@/@core/hooks/useAuth'
import { useSearchParams, useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'
import { InvoicePDF } from './invoice'
import { useFormattedPrice } from '@/hooks/useFormattedPrice'
import TrackOrder from '@/views/orders/preview/TrackOrder'
import CanView from '@/@core/components/can/can-view'
import { PERMISSIONS } from '@/utils/permissions'
import { formatToGermanDate } from '@/utils/germanDate'
import DownloadInvoiceButton from './download-invoice-pdf'

const PreviewActions = ({ id, heyFlowId, answers = {}, orderDetail }) => {
  const [loading, setLoading] = useState(false)
  const locale = useLocale()
  const t = useTranslations()
  const auth = useAuth()
  const searchParams = useSearchParams()
  const user = JSON.parse(localStorage.getItem('userData'))
  const [checked, setChecked] = useState(false)
  const { formatPrice } = useFormattedPrice()
  const router = useRouter()
  const customerDateOfBirth = answers['date_of_birth'] ?? ''

  const {
    customerAddress,
    products = [],
    signedStatus,
    doctorApprovalStatus,
    signedAt,
    signed,
    billing,
    orderTrackerURL,
    deliveryExternalOrderId
  } = orderDetail

  const pharmacyCut = billing?.pharmacyCut ?? 0
  const getKongPlatformFee = billing?.getKongPlatformFee ?? 0
  const total = billing?.total ?? 0

  const mergedData = questions.map(q => ({
    ...q,
    answer: answers[q.answerKey] ?? ''
  }))

  const generatePDFBuffer = async ({ orderId, doctorName, customerAddress, products, doctorAddress }) => {
    const pdfDoc = (
      <PrescriptionPDF
        orderId={orderId}
        doctorName={doctorName}
        customerAddress={customerAddress}
        products={products}
        doctorAddress={doctorAddress}
        customerDateOfBirth={doctorAddress.dateOfBirth}
      />
    )
    const asBuffer = await pdf(pdfDoc).toBlob()
    return asBuffer
  }

  const generateInvoicePDFBuffer = async orderDetail => {
    const pdfDoc = (
      <InvoicePDF
        orderId={orderDetail.id}
        customerAddress={orderDetail?.customerAddress}
        products={orderDetail?.products}
        billing={orderDetail?.billing}
        orderDetail={orderDetail}
        pharmacyName={orderDetail.products[0]?.pharmacyName}
        pharmacyStreet={orderDetail.products[0]?.pharmacyStreet}
        pharmacyCity={orderDetail.products[0]?.pharmacyCity}
        pharmacyPlz={orderDetail.products[0]?.pharmacyPlz}
        pharmacyVatId={orderDetail.products[0]?.vatId}
        customerDateOfBirth={customerDateOfBirth ? formatToGermanDate(customerDateOfBirth) : '01.01.1980'}
        couponName={orderDetail?.couponName}
        discount={orderDetail?.billing?.discount}
      />
    )
    const asBuffer = await pdf(pdfDoc).toBlob()
    return asBuffer
  }

  const convertBlobToBase64 = blob => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onloadend = () => {
        const base64data = reader.result?.split(',')[1] // remove the "data:application/pdf;base64," prefix
        resolve(base64data)
      }

      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }

  const handleApproveAndSign = async () => {
    setLoading(true)

    // invoicepdf
    const invoicePdfBlob = await generateInvoicePDFBuffer(orderDetail)
    const invoicePdfBase64 = await convertBlobToBase64(invoicePdfBlob)
    localStorage.setItem('invoicePdfBase64', invoicePdfBase64)

    const doctorName = `${auth?.user?.firstName ?? 'Doctor'} ${auth?.user?.lastName ?? ''}`
    const orderId = searchParams.get('id')
    const userData = JSON.parse(localStorage.getItem('userData'))

    const doctorAddress = {
      address: userData?.address ?? 'Musterstraße 1',
      postalCode: userData?.postalCode ?? '10115',
      dateOfBirth: customerDateOfBirth ? formatToGermanDate(customerDateOfBirth) : '01.01.1980',
      city: userData?.city ?? 'Berlin',
      phone: userData?.phone ?? '+49 30 12345678'
    }
    const orderData = {
      orderId,
      doctorName,
      products,
      customerAddress,
      billing,
      doctorAddress
    }

    const pdfBlob = await generatePDFBuffer(orderData)
    const pdfBase64 = await convertBlobToBase64(pdfBlob)
    const uuid = uuidv4()
    try {
      const response = await signService.authorizeVerimiUser(uuid)

      if (response.status === 200) {
        const url = response.data.redirectUrl
        localStorage.setItem('pdfBase64', pdfBase64)
        localStorage.setItem('invoicePdfBase64', invoicePdfBase64)
        localStorage.setItem('orderId', orderId)
        openPopup(url)
      } else {
        console.error('Unexpected response:', response)
        toast.error('Failed to initiate approval process.')
      }
    } catch (error) {
      console.error('Error during approval:', error)
      console.error('Error during approval:', error.response)
      toast.error(error.response?.data?.message || 'An error occurred while approving. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGetVerimiCode = async () => {
    try {
      const myHeaders = new Headers()
      myHeaders.append(
        'Cookie',
        'ory_hydra_login_csrf_3297972852=MTc1MTEwMjQ3OXw3LU5jTkUtQ0VqZU5NSHhmV0tEWmxfOGJ0QTlabzNkWWZuNTBNOG5JRV9YdkV3R05OQ2VRSjNUdXdYZDBCalE2UXlnSVNJUWVqVWFiX2pSQndLRHk0RExHd1dNR2hvYkxWT3JfQ21iRFRneTRWcVZEejdRQmJaOGtYQ1FufLmyJTqqpkVidPKBvO2Tft8fk6h8O7OEQZpiVRYOysFI'
      )

      const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      }

      fetch(
        'https://web.uat.verimi.cloud/oauth2/auth?response_type=code&scope=login idcard passport id_data&client_id=getkong_qes&redirect_uri=https://getkong-dashboard-frontend-dev.internal.pwr.dev/en/processing',
        requestOptions
      )
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.error(error))
    } catch (error) {
      console.error('Error during code:', error)
    }
  }

  const openPopup = url => {
    const width = 500
    const height = 700
    const left = window.screenX + (window.innerWidth - width) / 2
    const top = window.screenY + (window.innerHeight - height) / 2
    window.open(url, '_blank', `width=${width},height=${height},left=${left},top=${top}`)
  }

  const handleRejection = async () => {
    const orderId = searchParams.get('id')
    const data = {
      doctorApprovalStatus: 'REJECTED',
      orderId
    }

    try {
      const response = await signService.updateOrderStatus(data)
      if (response.status === 200) {
        const url = response.data.description
        toast.success('Success.')
        window.location.reload()
      } else {
        console.error('Unexpected response:', response)
        toast.error('Failed to initiate approval process.')
      }
    } catch (error) {
      console.error('Error during approval:', error)
      toast.error(error.response?.data?.message || 'An error occurred while approving. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const downloadPDF = (orderId, data) => {
    const byteCharacters = atob(data)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], { type: 'application/pdf' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    const orderIdWithPad = orderId.toString().padStart(3, '0')
    const timestamp = new Date(signedAt).getTime()
    link.download = `ORD-${orderIdWithPad}-${timestamp}.pdf`
    link.click()
  }

  const handleDownload = async () => {
    const orderId = searchParams.get('id')
    try {
      const response = await signService.downloadPDF(orderId)
      if (response.status === 200) {
        const status = response.data.status
        const description = response.data.description

        if (status == '200') {
          downloadPDF(orderId, response.data.data)
        } else {
          toast.error(description)
        }
      } else {
        console.error('Unexpected response:', response)
        toast.error('Failed to initiate approval process.')
      }
    } catch (error) {
      console.error('Error during approval:', error)
      toast.error(error.response?.data?.message || 'An error occurred while approving. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const handleMessage = event => {
      const status = event.data?.status
      if (typeof event.data === 'object' && event.data?.type === 'verimi-finished') {
        const url = new URL(window.location.href)
        url.searchParams.set('status', status)
        window.location.href = url.toString()
      }
    }
    window.addEventListener('message', handleMessage)
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  const generateApprovalButtonText = () => {
    switch (doctorApprovalStatus) {
      case 'APPROVED_NOT_SIGNED':
        return t('Sign')
      default:
        return t('Approve & Sign')
    }
  }

  const actionDisabled = user?.verimiAuthPending == true

  return (
    <>
      <Toaster position='top-right' reverseOrder={false} toastOptions={{ duration: 4000 }} />

      {doctorApprovalStatus !== 'REJECTED' && (
        <Card className='rounded-3xl overflow-hidden shadow-xl border border-gray-100 bg-gradient-to-br from-white via-gray-50 to-gray-100'>
          <CardContent className='flex flex-col gap-6 p-6 sm:p-8'>
            <div className='flex items-center gap-3 text-gray-800'>
              <Icon icon='mdi:account-heart-outline' width={28} className='text-primary' />
              <h3 className='text-xl sm:text-2xl font-semibold tracking-tight'>{t('Doctor Approval')}</h3>
            </div>
            <p className='text-sm sm:text-base text-gray-600'>{t('approveOrRejectByAssessment')}</p>

            {actionDisabled && !signed && (
              <div className='space-y-4'>
                <Box className='flex items-start gap-2 bg-orange-50 border-l-4 border-orange-400 p-3 rounded-md'>
                  <Icon icon='mdi:alert-circle' className='text-orange-500 mt-0.5' width={24} height={24} />
                  <p className='text-sm sm:text-base text-gray-700'>{t(user?.verimiAuthPendingDescription)}</p>
                </Box>

                {/* Checkbox with Label */}
                <Box className='flex items-start gap-1'>
                  <Checkbox
                    checked={checked}
                    onChange={() => setChecked(!checked)}
                    color='primary'
                    size='medium'
                    icon={<Icon icon='mdi:checkbox-blank-outline' width={22} />}
                    checkedIcon={<Icon icon='mdi:checkbox-marked' width={22} />}
                  />

                  <Typography className='text-base text-gray-700' sx={{ marginTop: '5px' }}>
                    {t('codeReg')}
                  </Typography>
                </Box>
              </div>
            )}

            {/* // checkbox */}

            {!signed && (doctorApprovalStatus == 'PENDING' || doctorApprovalStatus == 'APPROVED_NOT_SIGNED') && (
              <Box className='flex flex-col gap-4'>
                <Button
                  fullWidth
                  startIcon={<Icon icon='mdi:check-bold' width={24} />}
                  color='success'
                  variant='contained'
                  className='!capitalize !text-base !rounded-xl !py-3 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200'
                  disabled={loading || (!checked && actionDisabled)}
                  onClick={handleApproveAndSign}
                >
                  {loading ? t('Approving') : generateApprovalButtonText()}
                </Button>

                <Button
                  fullWidth
                  startIcon={<Icon icon='mdi:cancel' width={24} />}
                  color='error'
                  variant='outlined'
                  className='!capitalize !text-base !rounded-xl !py-3  hover:shadow-md transition-all duration-200'
                  disabled={loading || (!checked && actionDisabled)}
                  onClick={handleRejection}
                >
                  {t('Reject')}
                </Button>
              </Box>
            )}
            {/* FOR  TESTING PDF LOCALLY: COMMENT IT ON DEV, STAGE and LIVE ENV */}
            {/* <DownloadInvoiceButton orderDetail={orderDetail} customerDateOfBirth={customerDateOfBirth} /> */}
            {signed && (
              <Box>
                <Button
                  fullWidth
                  startIcon={<Icon icon='mdi:download' width={24} />}
                  color='primary'
                  variant='outlined'
                  className='!capitalize !text-base mb-2 !rounded-xl !py-3  hover:shadow-md transition-all duration-200'
                  onClick={handleDownload}
                >
                  {t('Download PDF')}
                </Button>
                <h4 className='text-xl sm:text-2xl font-semibold tracking-tight'>{t('Signed')}</h4>
                <p className='text-sm sm:text-base text-gray-600'>
                  {t('at')} {signedAt}
                </p>
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {/* <PDFExample
        orderDetail={orderDetail}
        customerDateOfBirth={customerDateOfBirth}
      /> */}

      <Box className='rounded-3xl overflow-hidden shadow-xl border border-gray-100 bg-gradient-to-br from-white via-gray-50 to-gray-100 mt-4'>
        <Box sx={{ px: 6, py: 8 }}>
          <div className='space-y-0'>
            {mergedData?.slice(0, 2)?.map((q, i) => (
              <QuestionItem key={i} type={q.type} question={q.question} answer={q.answer} index={i} />
            ))}
          </div>
          <Button
            fullWidth
            component={Link}
            color='primary'
            variant='outlined'
            className='!capitalize !text-base !rounded-xl !py-3 hover:shadow-md transition-all duration-200 mt-4'
            href={getLocalizedURL(locale, `orders/details?id=${heyFlowId}`)}
          >
            {t('View Questionarie')}
          </Button>
        </Box>
      </Box>
      <CanView permission={PERMISSIONS.ORDER.FOOTER_TOTAL}>
        <Box className='rounded-3xl overflow-hidden shadow-xl border border-gray-100 bg-gradient-to-br from-white via-gray-50 to-gray-100 mt-4'>
          <Box sx={{ px: 6, py: 8 }} className='flex flex-col gap-2'>
            <div className='flex items-center  justify-between'>
              <Typography>{t('pharmacyCut')}:</Typography>
              <Typography variant='h6'>€ {formatPrice(pharmacyCut)}</Typography>
            </div>

            <div className='flex items-center gap-3 justify-between'>
              <Typography>{t('getKongPlatformFee')}:</Typography>
              <Typography variant='h6'>€ {formatPrice(getKongPlatformFee)}</Typography>
            </div>

            <div className='flex items-center gap-3 justify-between'>
              <Typography>{t('total')}:</Typography>
              <Typography variant='h6'>€ {formatPrice(total)}</Typography>
            </div>
          </Box>
        </Box>
      </CanView>
      <CanView permission={PERMISSIONS.ORDER.TRACK_ORDER}>
        <TrackOrder deliveryExternalOrderId={deliveryExternalOrderId} orderTrackerURL={orderTrackerURL} />
      </CanView>
    </>
  )
}

export default PreviewActions
