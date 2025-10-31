'use client'
import React from 'react'
import { Card, CardContent } from '@mui/material'
import { useLocale, useTranslations } from 'next-intl'
import LanguageDropdown from '@/components/shared/language-dropdown'

const EmailConfirm = () => {
  const t = useTranslations()
  const locale = useLocale()

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-100 to-purple-200'>
      <div className='absolute top-4 right-4'>
        <LanguageDropdown defaultValue={locale} />
      </div>
      <Card className='bg-white text-purple-800 p-8 rounded-2xl shadow-xl max-w-md text-center border border-purple-300'>
        <CardContent>
          <div className='flex flex-col items-center'>
            <h2 className='text-2xl font-bold mb-2'>{t('verifyYourEmail')}</h2>
            <p className='mb-6 text-gray-700'>{t('confirmationLinkSent')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default EmailConfirm
