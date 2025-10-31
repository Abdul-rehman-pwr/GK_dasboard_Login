'use client'

import { useState, useEffect, useMemo } from 'react'
import { Typography, Box, Slide, Button, IconButton } from '@mui/material'
import { useRouter, useSearchParams } from 'next/navigation'
import questions from '@/data/questions.json'
import orderService from '@/services/orderService'
import SimpleAnswerQuestion from './simpleAnswerQuestion'
import { BiArrowBack } from 'react-icons/bi'
import { useTranslations } from 'next-intl'

export default function OrderDetail() {
  const t = useTranslations()
  const [answers, setAnswers] = useState({})
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  const getAnswers = async heyFlowId => {
    try {
      const res = await orderService.getEligibilityForm({ heyFlowId })
      setAnswers(res?.data ?? {})
    } catch (error) {
      console.error('Error fetching answers:', error)
      setAnswers({})
    }
  }
  useEffect(() => {
    if (id) {
      getAnswers(id)
      setMounted(true)
    }
  }, [id])

  const mergedData = useMemo(() => {
    return Array.isArray(questions)
      ? questions.map(q => ({
          ...q,
          answer: answers?.[q.answerKey] ?? ''
        }))
      : []
  }, [questions, answers])

  return (
    <Slide direction='up' in={mounted} timeout={400}>
      <Box className=' mx-auto rounded-3xl overflow-hidden shadow-xl border border-gray-100 bg-gradient-to-br from-white via-gray-50 to-gray-100'>
        <Box className='px-6 sm:px-10 py-6 border-b border-gray-200 bg-gray-50'>
          <Box className=' flex items-center gap-2 '>
            <IconButton onClick={() => router.back()} className='rounded-full hover:bg-gray-200' aria-label='Go back'>
              <BiArrowBack />
            </IconButton>
            <Typography variant='h4' component='h1' className='font-bold text-gray-800 tracking-wide'>
              {t('Patient Questionnaire')}
            </Typography>
          </Box>
          <Typography variant='body2' className='text-gray-500 mt-1 ml-2'>
            {t('Review the submitted answers below before proceeding with approval')}
          </Typography>
        </Box>

        {/* <AnswerQuestions questions={mergedData} /> */}
        {/* <StyledAnswerQuestion questions={mergedData} /> */}
        <SimpleAnswerQuestion questions={mergedData} />
      </Box>
    </Slide>
  )
}
