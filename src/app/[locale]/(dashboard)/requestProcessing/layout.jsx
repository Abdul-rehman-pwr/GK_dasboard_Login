import Providers from '@components/Providers'

// Util Imports
import getModes from '@/utils/getModes'
import { Suspense } from 'react'
import LoadingFallback from '@/components/shared/loading'

const Layout = async ({ children }) => {
  // Vars
  const direction = 'ltr'
  return (
    <Providers direction={direction}>
      <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
    </Providers>
  )
}

export default Layout
