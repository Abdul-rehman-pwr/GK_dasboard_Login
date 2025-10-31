import Guard from '@/components/guard'
import { PERMISSIONS } from '@/utils/permissions'
import AddProductMetadataForm from '@/views/metadata/add/page'
import AddProductPage from '@/views/products/add/page'
import React from 'react'

const ProductAddMetaData = () => {
  return (
    <Guard permission={PERMISSIONS.PRODUCT.ADD}>
      <AddProductMetadataForm />
    </Guard>
  )
}

export default ProductAddMetaData
