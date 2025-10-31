// Next Imports
import Link from 'next/link'

// MUI Imports
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { Suspense } from 'react'
import LoadingFallback from '@/components/shared/loading'

const Failure = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <div className='flex items-center flex-col text-center justify-center min-h-screen p-6'>
        {/* Message Section */}
        <div className='flex flex-col gap-2 w-[90vw] sm:w-auto mb-6'>
          <Typography variant='h1' className='text-red-600 text-6xl sm:text-8xl font-bold'>
            FAILURE
          </Typography>
          <Typography variant='h4' color='error'>
            Something Went Wrong ⚠️
          </Typography>
          <Typography variant='body1' color='textSecondary'>
            Unfortunately, we could not complete your request. Please try again later.
          </Typography>
        </div>

        {/* Login Button */}
        <Button href='/en/login' component={Link} variant='contained' color='error' size='large'>
          Go to Login
        </Button>

        {/* Illustration */}
        <img
          alt='Error illustration'
          src='/images/illustrations/characters-with-objects/13.png'
          className='object-cover h-[327px] sm:h-[400px] md:h-[450px] lg:h-[500px] mt-6'
        />
      </div>
    </Suspense>
  )
}

export default Failure
