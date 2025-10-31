// Component Imports
import LoadingFallback from '@/components/shared/loading'
import Login from '@/views/auth/Login'
import { Suspense } from 'react'

export function generateStaticParams() {
  return [
    { locale: 'en', login: ['login'] },
    { locale: 'de', login: ['login'] }
  ]
}

const LoginPage = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Login />
    </Suspense>
  )
}

export default LoginPage
