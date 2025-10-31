// Component Imports
import LoadingFallback from '@/components/shared/loading'
import TwoSteps from '@views/auth/TwoSteps'
import { Suspense } from 'react'

export function generateStaticParams() {
  return [
    { locale: 'en', 'two-steps': ['two-steps'] },
    { locale: 'de', 'two-steps': ['two-steps'] }
  ]
}

const TwoStepsPage = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <TwoSteps />
    </Suspense>
  )
}

export default TwoStepsPage
