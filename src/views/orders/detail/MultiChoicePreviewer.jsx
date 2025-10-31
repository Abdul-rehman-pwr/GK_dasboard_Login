import React from 'react'

const MultiChoicePreviewer = ({ answer = '' }) => {
  const options = answer
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)

  return (
    <ul className='list-none  space-y-1'>
      {options.map((option, index) => (
        <li key={index} className='font-semibold text-gray-900 text-base leading-relaxed '>
          {option}
        </li>
      ))}
    </ul>
  )
}

export default MultiChoicePreviewer
