// Component Imports
import Guard from '@/components/guard'
import LoadingFallback from '@/components/shared/loading'
import { PERMISSIONS } from '@/utils/permissions'
import PharmacyAdminListView from '@/views/admins'

import { Suspense } from 'react'

const UserListApp = async () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Guard permission={PERMISSIONS.PHARMACY_ADMIN.LIST}>
        <PharmacyAdminListView />
      </Guard>
    </Suspense>
  )
}

export default UserListApp
