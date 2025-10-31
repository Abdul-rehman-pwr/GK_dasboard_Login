'use client'

import React from 'react'
import Image from 'next/image'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'

const LoadingFallback = () => {
  return (
    <div className=' flex items-center justify-center h-screen bg-gray-100'>
      <Box position='relative' display='inline-flex'>
        <CircularProgress className='text-green-600' size={60} thickness={2} />

        <Box position='absolute' top='50%' left='50%' sx={{ transform: 'translate(-50%, -50%)' }}>
          <Image src='/logo_getKong.png' alt='Loading...' width={32} height={32} />
        </Box>
      </Box>
    </div>
  )
}

export default LoadingFallback
