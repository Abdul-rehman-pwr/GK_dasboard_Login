import LoadingFallback from '@/components/shared/loading'
import ForgotPassword from '@views/auth/ForgotPassword'
import { Suspense } from 'react'

export function generateStaticParams() {
  return [
    { locale: 'en', login: ['forgot-password'] },
    { locale: 'de', login: ['forgot-password'] }
  ]
}
const ForgotPasswordPage = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ForgotPassword />
    </Suspense>
  )
}

export default ForgotPasswordPage
