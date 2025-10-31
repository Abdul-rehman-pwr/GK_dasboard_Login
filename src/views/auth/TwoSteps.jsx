'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import { useRouter, useSearchParams } from 'next/navigation'

// MUI Imports
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'

// Third-party Imports
import { OTPInput } from 'input-otp'
import classnames from 'classnames'

// Component Imports
import Form from '@components/Form'
import Link from '@components/Link'
import Logo from '@components/layout/shared/Logo'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'

// Style Imports
import styles from '@/libs/styles/inputOtp.module.css'
import userService from '@/services/userService'
import authConfig from '@/configs/auth'
import { toast, Toaster } from 'react-hot-toast'
import responseHandler from '@/utils/responseHandler'
import getLocalizedURL from '@/utils/getLocalizedUrl'
import { useLocale } from 'next-intl'
import { useAuth } from '@core/hooks/useAuth'
import otherService from '@/services/otherService'
import { useDispatch } from 'react-redux'
import { setTemplates } from '@/store/slices/templateSlice'
import templateService from '@/services/templatesService'

// Styled Custom Components
const TwoStepsIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  blockSize: 'auto',
  maxBlockSize: 650,
  maxInlineSize: '100%',
  margin: theme.spacing(12),
  [theme.breakpoints.down(1536)]: {
    maxBlockSize: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxBlockSize: 450
  }
}))

const Slot = props => {
  return (
    <div className={classnames(styles.slot, { [styles.slotActive]: props.isActive })}>
      {props.char !== null && <div>{props.char}</div>}
      {props.hasFakeCaret && <FakeCaret />}
    </div>
  )
}

const FakeCaret = () => {
  return (
    <div className={styles.fakeCaret}>
      <div className='w-px h-5 bg-textPrimary' />
    </div>
  )
}

const TwoSteps = () => {
  const [otp, setOtp] = useState(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { settings } = useSettings()
  const theme = useTheme()
  const auth = useAuth()

  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const locale = useLocale()
  const dispatch = useDispatch()

  const verifyAccount = async () => {
    try {
      setLoading(true)
      const requestPayload = {
        email,
        passcode: otp
      }
      const response = await userService.loginWithPasscode(requestPayload)
      const { result, status, description } = responseHandler(response)
      if (status === '200') {
        const userData = result
        auth.setUser(userData)
        localStorage.setItem(authConfig.storageTokenKeyName, userData.userToken.sessionToken)
        localStorage.setItem('userData', JSON.stringify(userData))
        toast.success(t('accountVerified'))
        const templateResponse = await templateService.getTemplates()

        const templatesData = templateResponse?.data?.data?.content

        if (templatesData) {
          dispatch(setTemplates(templatesData))
        }
        router.push(getLocalizedURL(locale, 'home'))
      } else {
        toast.error(t('error'))
      }
    } catch (err) {
      toast.error(t('error'))
    } finally {
      setLoading(false)
    }
  }

  const resend = async () => {
    try {
      setLoading(true)
      const requestPayload = {
        email
      }
      const response = await userService.resendLoginPasscode(requestPayload)
      const { result, status, description } = responseHandler(response)
      if (status === '200') {
        toast.success(t('otpResentSuccessfully'))
      } else {
        toast.error(t('error'))
      }
    } catch (err) {
      toast.error(t('error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex bs-full justify-center'>
      <Toaster position='top-right' reverseOrder={false} toastOptions={{ duration: 4000 }} />
      <div
        className={classnames(
          'flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden',
          {
            'border-ie': settings.skin === 'bordered'
          }
        )}
      >
        <TwoStepsIllustration
          src='/images/illustrations/characters-with-objects/12.png'
          alt='character-illustration'
          className={classnames({ 'scale-x-[-1]': theme.direction === 'rtl' })}
        />
      </div>
      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
        <Link href={'/'} className='absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]'>
          {/* <Logo /> */}
        </Link>
        <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-11 sm:mbs-14 md:mbs-0'>
          <div className='flex flex-col gap-1'>
            <Typography variant='h4'>Two Step Verification 💬</Typography>
            <Typography>
              We sent a verification code to your mobile. Enter the code from the email in the field below.
            </Typography>
            <Typography variant='h6'>{email}</Typography>
          </div>
          <Form noValidate autoComplete='off' className='flex flex-col gap-6'>
            <div className='flex flex-col gap-2'>
              <Typography>Type your 6 digit security code</Typography>
              <OTPInput
                onChange={setOtp}
                value={otp ?? ''}
                maxLength={6}
                containerClassName='group flex items-center'
                render={({ slots }) => (
                  <div className='flex items-center justify-between w-full gap-4'>
                    {slots.slice(0, 6).map((slot, idx) => (
                      <Slot key={idx} {...slot} />
                    ))}
                  </div>
                )}
              />
            </div>
            <Button fullWidth variant='contained' type='button' onClick={verifyAccount} disabled={loading}>
              {loading ? 'Verifying...' : 'Verify my account'}
            </Button>
            <div className='flex justify-center items-center flex-wrap gap-2'>
              <Typography>Didn&#39;t get the code?</Typography>
              <Typography
                color='primary'
                className='hover:cursor-pointer'
                onClick={e => {
                  e.preventDefault()
                  resend()
                }}
              >
                Resend
              </Typography>
            </div>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default TwoSteps
