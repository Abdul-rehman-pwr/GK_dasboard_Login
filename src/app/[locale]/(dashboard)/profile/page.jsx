// Next Imports
import dynamic from 'next/dynamic'

// Component Imports
import AccountSettings from '@views/profile/account-settings'
import { Suspense } from 'react'
import LoadingFallback from '@/components/shared/loading'

const AccountTab = dynamic(() => import('@views/profile/account-settings/account'))
const CompanyTab = dynamic(() => import('@/views/profile/account-settings/company'))
const TaxTab = dynamic(() => import('@/views/profile/account-settings/taxes'))

// Vars
const tabContentList = () => ({
  account: <AccountTab />,
  company: <CompanyTab />,
  tax: <TaxTab />
})

export function generateStaticParams() {
  return [
    { locale: 'en', profile: ['profile'] },
    { locale: 'de', profile: ['profile'] }
  ]
}

const AccountSettingsPage = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AccountSettings tabContentList={tabContentList()} />
    </Suspense>
  )
}

export default AccountSettingsPage
