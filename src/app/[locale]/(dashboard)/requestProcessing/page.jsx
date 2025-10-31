'use client'

import pharmacyServices from '@/services/pharmacy-services'
import getLocalizedURL from '@/utils/getLocalizedUrl'
import { useLocale, useTranslations } from 'next-intl'
import { useSearchParams, useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { toast } from 'react-hot-toast'

const RequestProcessingPage = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const source = searchParams.get('source')
  const pharmacyId = searchParams.get('pharmacyId')
  const locale = useLocale()
  const t = useTranslations()

  const handleConnectAdyen = async () => {
    const redirectUrl = `${process.env.NEXT_PUBLIC_ADYEN_REDIRECT_URL}/${locale}/pharmacy/list?source=${source}`
    try {
      const res = await pharmacyServices.connectAdyen(pharmacyId, source, redirectUrl)
      if (res.status == 200 || res.status == 201) {
        router.push(getLocalizedURL(locale, `pharmacy/list?source=${source}`))
      }
    } catch (error) {
      router.push(getLocalizedURL(locale, `pharmacy/list?source=${source}`))
    }
  }

  useEffect(() => {
    if (source && pharmacyId) {
      handleConnectAdyen()
    }
  }, [source, pharmacyId, router])

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='text-center'>
        <div className='w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin mx-auto mb-4'></div>
        <h1 className='text-xl font-semibold text-gray-700'>{t('processingRequest')}</h1>
        <p className='text-gray-500 mt-2'>{t('adyenProcessingRequest')}</p>
      </div>
    </div>
  )
}

export default RequestProcessingPage
