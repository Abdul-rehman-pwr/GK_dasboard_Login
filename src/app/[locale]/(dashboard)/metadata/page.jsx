// MUI Imports
// Component Imports
import Guard from '@/components/guard'
import LoadingFallback from '@/components/shared/loading'
import { PERMISSIONS } from '@/utils/permissions'
import ProductsMetadataListView from '@/views/metadata/list'

import { Suspense } from 'react'

const ProductsMetadataList = async () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Guard permission={PERMISSIONS.PRODUCT.LIST}>
        <ProductsMetadataListView />
      </Guard>
    </Suspense>
  )
}

export default ProductsMetadataList
