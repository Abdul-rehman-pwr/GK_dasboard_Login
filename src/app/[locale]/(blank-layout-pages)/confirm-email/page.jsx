// Component Imports
import LoadingFallback from '@/components/shared/loading'
import EmailConfirm from '@/views/auth/ConfirmEmail'
import Login from '@/views/auth/Login'
import { Suspense } from 'react'

export function generateStaticParams() {
  return [
    { locale: 'en', login: ['login'] },
    { locale: 'de', login: ['login'] }
  ]
}

const ConfirmEmail = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <EmailConfirm />
    </Suspense>
  )
}

export default ConfirmEmail
