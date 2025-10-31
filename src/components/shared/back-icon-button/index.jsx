'use client '
import Link from '@/components/Link'
import { IconButton } from '@mui/material'
import React from 'react'
import { BiArrowBack } from 'react-icons/bi'
import { useLocale } from 'next-intl'

const BackIconButton = ({ href = '/orders' }) => {
  const locale = useLocale()
  return (
    <Link href={`/${locale}${href}`}>
      <IconButton className='rounded-full hover:bg-gray-200' aria-label='Go back'>
        <BiArrowBack />
      </IconButton>
    </Link>
  )
}

export default BackIconButton
