// Component Imports
import LoadingFallback from '@/components/shared/loading'
import OrderList from '@/views/orders/list/page'
import { Suspense } from 'react'
import Guard from '@/components/guard'
import { PERMISSIONS } from '@/utils/permissions'
const UserListApp = async () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Guard permission={PERMISSIONS.ORDER.LIST}>
        <OrderList />
      </Guard>
    </Suspense>
  )
}

export default UserListApp
