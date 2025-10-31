'use client'

// Component Imports
import Providers from '@components/Providers'
import BlankLayout from '@layouts/BlankLayout'
import getModes from '@/utils/getModes'
import { Suspense } from 'react'
import LoadingFallback from '@/components/shared/loading'

const Layout = ({ children }) => {
  // Vars
  const direction = 'ltr'
  const systemMode = getModes()

  return (
    <Providers direction={direction}>
      <Suspense
        fallback={
          <div>
            <LoadingFallback />
          </div>
        }
      >
        <BlankLayout systemMode={systemMode}>{children}</BlankLayout>
      </Suspense>
    </Providers>
  )
}

export default Layout
