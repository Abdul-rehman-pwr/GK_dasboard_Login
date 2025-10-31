import React from 'react'
import { useTranslations } from 'next-intl'

export default function QuestionItem({ question, answer, index, type }) {
  const t = useTranslations()

  return (
    <div className='py-4 border-b border-gray-100 last:border-b-0'>
      <div className='flex flex-col space-y-2'>
        <p className='text-gray-600 text-sm leading-relaxed whitespace-pre-line'>{t(question)}</p>

        <p className='font-semibold text-gray-900 text-base leading-relaxed'>{answer || t('notAnswered')}</p>
      </div>
    </div>
  )
}
