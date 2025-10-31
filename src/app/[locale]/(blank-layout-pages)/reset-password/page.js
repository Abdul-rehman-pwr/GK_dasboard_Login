// Component Imports
import LoadingFallback from '@/components/shared/loading'
import ResetPassword from '@/views/auth/ResetPassword'
import { Suspense } from 'react'

export function generateStaticParams() {
  return [
    { locale: 'en', 'reset-password': ['reset-password'] },
    { locale: 'de', 'reset-password': ['reset-password'] }
  ]
}

const ResetPasswordPage = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ResetPassword />
    </Suspense>
  )
}

export default ResetPasswordPage
