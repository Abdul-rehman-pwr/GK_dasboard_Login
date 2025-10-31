import React from 'react'
import QuestionItem from './questionItem'

export default function SimpleAnswerQuestion({ questions = [] }) {
  return (
    <div className='px-6 '>
      <div className='p-6'>
        {/* <h2 className='text-lg font-semibold text-gray-900 mb-6'>Patient Questionnaire</h2> */}
        <div className='space-y-0'>
          {questions?.map((q, i) => (
            <QuestionItem key={i} type={q.type} question={q.question} answer={q.answer} index={i} />
          ))}
        </div>
      </div>

      {questions?.length === 0 && (
        <div className='p-6 text-center'>
          <p className='text-gray-500'>No questions available</p>
        </div>
      )}
    </div>
  )
}
