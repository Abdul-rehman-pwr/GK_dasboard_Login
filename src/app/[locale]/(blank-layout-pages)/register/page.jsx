// Component Imports
import LoadingFallback from '@/components/shared/loading'
import Register from '@/views/auth/Register'
import { Suspense } from 'react'

export function generateStaticParams() {
  return [
    { locale: 'en', register: ['register'] },
    { locale: 'de', register: ['register'] }
  ]
}

const RegisterPage = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Register />
    </Suspense>
  )
}

export default RegisterPage
