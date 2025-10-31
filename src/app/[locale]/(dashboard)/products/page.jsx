// MUI Imports
// Component Imports
import Guard from '@/components/guard'
import LoadingFallback from '@/components/shared/loading'
import { PERMISSIONS } from '@/utils/permissions'
import ProductListView from '@/views/products/list'

import { Suspense } from 'react'

const ProductsList = async () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Guard permission={PERMISSIONS.PRODUCT.LIST}>
        <ProductListView />
      </Guard>
    </Suspense>
  )
}

export default ProductsList
