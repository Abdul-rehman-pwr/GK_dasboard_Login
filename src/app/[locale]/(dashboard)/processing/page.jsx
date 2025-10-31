'use client'

import { FRONTEND_BASE_URL } from '@/configs/app'
import signService from '@/services/signService'
import { useLocale, useTranslations } from 'next-intl'
import { useSearchParams, useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { toast } from 'react-hot-toast'

const ProcessingPage = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const code = searchParams.get('code')
  const stateId = searchParams.get('state')
  const error = searchParams.get('error')
  const errorReason = searchParams.get('error_reason')
  const errorDescription = searchParams.get('error_description')
  const locale = useLocale()
  const t = useTranslations()

  const getSigningURL = async (code, stateId) => {
    const pdfBase64 = localStorage.getItem('pdfBase64')
    const invoicePdfBase64 = localStorage.getItem('invoicePdfBase64')
    const orderIdRaw = localStorage.getItem('orderId')
    const orderId = orderIdRaw.toString().padStart(3, '0')
    const timestamp = Date.now()
    const fileName = `ORD-${orderId}-${timestamp}.pdf`

    const data = {
      doctorApprovalStatus: 'APPROVED_NOT_SIGNED',
      invoiceBase64Data: invoicePdfBase64,
      verimiCode: code,
      stateId,
      orderId,
      document: {
        documentId: 'prescription-123',
        documentData: pdfBase64,
        filename: fileName,
        title: 'Doctor Prescription',
        description: 'Digitally signed prescription for patient',
        showDocument: 'MANDATORY',
        legalEntity: 'getKong GmbH',
        signatures: [
          {
            signaturePage: 1,
            signaturePosX: 1,
            signaturePosY: 530,
            signatureWidth: 450,
            signatureHeight: 50
          }
        ]
      },

      fixedSignatory: false,
      onSuccessUrl: FRONTEND_BASE_URL + '/de/success?',
      onFailureUrl: FRONTEND_BASE_URL + '/de/error?'
    }

    try {
      const response = await signService.updateOrderStatus(data)
      if (response.status === 200) {
        const url = response.data.redirectUrl
        const parsedUrl = new URL(url)
        const processId = parsedUrl.searchParams.get('processId')
        localStorage.setItem('processId', processId)
        router.replace(url)
      } else {
        console.error('Unexpected response:', response)
        toast.error('Failed to initiate approval process.')
      }
    } catch (error) {
      console.error('Error during approval:', error)
      toast.error(error.response?.data?.message || 'An error occurred while approving. Please try again.')
    }
  }

  const submitError = async (stateId, errorDescription, errorReason) => {
    const data = {
      stateId: stateId,
      verimiAuthPendingReason: errorReason,
      verimiAuthPendingDescription: errorDescription
    }
    try {
      const response = await signService.setAuthorizationPending(data)
      if (response.status === 200) {
        updateUserInContextAndLocal(errorDescription, errorReason)
      } else {
        console.error('Unexpected response:', response)
        toast.error('Failed to initiate approval process.')
      }
    } catch (error) {
      console.error('Error during approval:', error)
      toast.error(error.response?.data?.message || 'An error occurred while approving. Please try again.')
    }
  }

  const updateUserInContextAndLocal = (errorDescription, errorReason) => {
    const user = JSON.parse(localStorage.getItem('userData'))
    user.verimiAuthPending = true
    user.verimiAuthPendingReason = errorReason
    user.verimiAuthPendingDescription = errorDescription
    localStorage.setItem('userData', JSON.stringify(user))
  }

  useEffect(() => {
    if (error === 'access_denied') {
      console.log(errorDescription)
      submitError(stateId, errorDescription, errorReason).then(() => {
        setTimeout(() => {
          router.replace(`/${locale}/error`)
        }, 1000)
      })
    } else if (code && stateId) {
      localStorage.setItem('stateId', stateId)
      localStorage.setItem('code', code)
      getSigningURL(code, stateId).then(url => {
        setTimeout(() => {
          router.replace(url)
        }, 1000)
      })
    }
  }, [code, stateId, router, error])

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='text-center'>
        <div className='w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin mx-auto mb-4'></div>
        <h1 className='text-xl font-semibold text-gray-700'>{t('processingRequest')}</h1>
        <p className='text-gray-500 mt-2'>{t('waitingOperationPerform')}</p>
      </div>
    </div>
  )
}

export default ProcessingPage
