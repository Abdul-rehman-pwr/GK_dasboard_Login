'use client'

import React from 'react'
import { Card, CardContent, Typography, Grow, Box, Divider } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Icon } from '@iconify/react'

const QuestionCard = styled(Card)(({ theme }) => ({
  transition: 'all 0.3s ease',
  borderRadius: theme.spacing(4),
  background: `linear-gradient(to bottom right, ${theme.palette.background.paper}, ${theme.palette.grey[50]})`,
  '&:hover': {
    transform: 'scale(1.01)',
    boxShadow: theme.shadows[4]
  }
}))

export default function AnswerQuestions({ questions = [] }) {
  return (
    <Box className='space-y-6'>
      {questions.map((q, i) => {
        const isAnswered = q.answer?.trim()

        return (
          <Grow in key={i} timeout={400 + i * 100}>
            <QuestionCard elevation={1}>
              <CardContent className='p-6 sm:p-8'>
                <Box className='flex items-start gap-3 mb-4'>
                  <Icon
                    icon={isAnswered ? 'ph:chat-circle-text-duotone' : 'ph:chat-circle-dots-duotone'}
                    className={`text-2xl mt-1 ${isAnswered ? 'text-blue-500' : 'text-gray-400'}`}
                  />
                  <Typography variant='h6' component='h3' className='text-gray-800 font-semibold leading-snug'>
                    {q.question}
                  </Typography>
                </Box>

                <Divider className='mb-4' />

                <Typography variant='body1' className={`pl-1 ${isAnswered ? 'text-gray-700' : 'italic text-gray-400'}`}>
                  {isAnswered ? q.answer : 'Not answered'}
                </Typography>
              </CardContent>
            </QuestionCard>
          </Grow>
        )
      })}
    </Box>
  )
}
