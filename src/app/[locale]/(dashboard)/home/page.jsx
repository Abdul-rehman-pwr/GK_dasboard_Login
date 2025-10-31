import LoadingFallback from '@/components/shared/loading'
import HomeView from '@/views/home'
import Home from '@/views/home/Home'
import { Suspense } from 'react'

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'de' }]
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <HomeView />
    </Suspense>
  )
}
