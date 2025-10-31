'use client'

import signService from '@/services/signService'
import { Button } from '@mui/material'
import { useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'

const SignStatus = ({ status = 'error' }) => {
  const [isLoading, setIsLoading] = useState(false)
  const t = useTranslations()

  const updateUserInContextAndLocal = () => {
    const user = JSON.parse(localStorage.getItem('userData'))
    user.verimiAuthPending = false
    user.verimiAuthPendingReason = null
    user.verimiAuthPendingDescription = null
    localStorage.setItem('userData', JSON.stringify(user))
    localStorage.removeItem('orderItem')
    localStorage.removeItem('processId')
    localStorage.removeItem('stateId')
  }

  const updateSigningStatus = async () => {
    const processId = localStorage.getItem('processId')
    const stateId = localStorage.getItem('stateId')
    const orderId = localStorage.getItem('orderId')

    if (!processId || !stateId || !orderId) {
      return
    }

    const data = {
      orderId,
      stateId,
      processId
    }

    setIsLoading(true)
    try {
      const response = await signService.updateSigningStatus(data)
      console.log({ response: response.data })
      if (response.status === 200) {
        toast.success('Success')
        updateUserInContextAndLocal()
      } else {
        console.error('Unexpected response:', response)
        toast.error('Failed to initiate approval process.')
      }
    } catch (error) {
      console.error('Error during approval:', error)
      toast.error(error.response?.data?.message || 'An error occurred while approving. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const notifyParentAndClose = () => {
    if (window.opener) {
      window.opener.postMessage(
        {
          type: 'verimi-finished',
          status: status
        },
        '*'
      )
    }
    setTimeout(() => {
      window.close()
    }, 500)
  }

  useEffect(() => {
    if (status === 'success') {
      updateSigningStatus()
    }
  }, [status])

  const OrderApproved = () => {
    return (
      <>
        <svg
          className='mx-auto text-green-500 w-16 h-16 mb-4'
          fill='none'
          stroke='currentColor'
          strokeWidth={2}
          viewBox='0 0 24 24'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
        </svg>
        <h2 className='text-xl font-semibold text-gray-800'>{t('Order Approved!')}</h2>
        <p className='text-gray-600 mt-2'>{t('You can close this window')}</p>
      </>
    )
  }

  const OrderProcessing = () => {
    return (
      <>
        <div className='w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin mx-auto mb-4'></div>
        <h2 className='text-xl font-semibold text-gray-800'>{t('pleasewait')}</h2>
        <p className='text-gray-600 mt-2'>{t('processingOrder')}</p>
      </>
    )
  }

  return (
    <>
      <Toaster position='top-right' reverseOrder={false} toastOptions={{ duration: 4000 }} />
      <div className='grid items-center justify-center  '>
        <div className='px-8 py-10 text-center max-w-md animate-fade-in'>
          {status === 'success' ? (
            <>{isLoading ? <OrderProcessing /> : <OrderApproved />}</>
          ) : (
            <>
              <svg
                className='mx-auto text-red-500 w-16 h-16 mb-4'
                fill='none'
                stroke='currentColor'
                strokeWidth={2}
                viewBox='0 0 24 24'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
              </svg>
              <h2 className='text-xl font-semibold text-gray-800'>{t('Something went wrong')}</h2>
              <p className='text-gray-600 mt-2'>{t('closeWindow')}</p>
            </>
          )}
        </div>

        <Button onClick={notifyParentAndClose} disabled={isLoading} fullWidth variant='contained' type='submit'>
          {t('Close')}
        </Button>
      </div>
    </>
  )
}

export default SignStatus
