// components/StyledAnswerQuestion.jsx
import React from 'react'
import clsx from 'clsx'

import PendingIcon from '@/icons/pending-icon'
import InfoIcon from '@/icons/info-icon'
import AnsweredIcon from '@/icons/answered-icon'

export default function StyledAnswerQuestion({ questions = [] }) {
  return (
    <div className='space-y-6'>
      {questions.map((q, i) => {
        const isAnswered = q.answer?.trim()
        const isLongAnswer = q.answer?.length > 100

        return (
          <div
            key={i}
            className={clsx(
              'group relative transition-all duration-500 ease-out',
              i % 2 === 0 ? 'animate-fade-in' : 'animate-scale-in'
            )}
            style={{ animationDelay: `${i * 150}ms` }}
          >
            <div
              className={clsx(
                'relative rounded-2xl border-2 transition-all duration-300 overflow-hidden group-hover:scale-[1.02] shadow-md hover:shadow-lg',
                isAnswered
                  ? 'border-blue-200 bg-gradient-to-br from-white to-blue-50 hover:border-blue-300'
                  : 'border-orange-200 bg-gradient-to-br from-white to-orange-50 hover:border-orange-300'
              )}
            >
              <div
                className={clsx(
                  'absolute top-0 left-0 w-full h-1',
                  isAnswered
                    ? 'bg-gradient-to-r from-blue-500 to-teal-500'
                    : 'bg-gradient-to-r from-orange-400 to-red-400'
                )}
              />

              <div className='p-6 sm:p-8'>
                <div className='flex items-start gap-4 mb-6'>
                  <div
                    className={clsx(
                      'flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300',
                      isAnswered ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'
                    )}
                  >
                    {isAnswered ? <AnsweredIcon className='w-5 h-5' /> : <PendingIcon className='w-5 h-5' />}
                  </div>

                  <div className='flex-1'>
                    <div className='flex items-center gap-2 mb-2'>
                      <span
                        className={clsx(
                          'text-xs font-semibold px-3 py-1 rounded-full',
                          isAnswered ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                        )}
                      >
                        Q{i + 1}
                      </span>
                      <span
                        className={clsx(
                          'text-xs font-semibold px-3 py-1 rounded-full',
                          isAnswered ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        )}
                      >
                        {isAnswered ? 'Answered' : 'Not Answered'}
                      </span>
                    </div>

                    <h3 className='text-base font-normal text-slate-800 leading-tight'>{q.question}</h3>
                  </div>
                </div>

                <div
                  className={clsx(
                    'w-full h-px mb-6',
                    isAnswered
                      ? 'bg-gradient-to-r from-blue-200 to-transparent'
                      : 'bg-gradient-to-r from-orange-200 to-transparent'
                  )}
                />

                <div className='relative'>
                  {isAnswered ? (
                    <div className={clsx('prose max-w-none', isLongAnswer ? 'text-sm' : 'text-base')}>
                      <div className='relative'>
                        <div className='absolute -left-3 top-0 w-0.5 h-full bg-gradient-to-b from-blue-400 to-teal-400 rounded-full' />
                        <p className=' text-base  md:text-lg font-semibold  lg:text-xl   text-slate-700 leading-relaxed pl-6 mb-0'>
                          {q.answer}
                        </p>
                      </div>
                      {isLongAnswer && (
                        <div className='flex justify-end mt-3'>
                          <span className='text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full'>
                            {q.answer.length} characters
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className='flex items-center gap-3 text-slate-500 italic pl-6'>
                      <InfoIcon className='w-5 h-5 flex-shrink-0' />
                      <span>No answer provided yet</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      })}

      {questions.length === 0 && (
        <div className='text-center py-12'>
          <InfoIcon className='w-16 h-16 text-slate-300 mx-auto mb-4' />
          <p className='text-slate-500 text-lg'>No questions available</p>
        </div>
      )}
    </div>
  )
}
