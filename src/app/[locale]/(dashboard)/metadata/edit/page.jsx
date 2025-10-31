import Guard from '@/components/guard'
import { PERMISSIONS } from '@/utils/permissions'
import EditProductMetadataForm from '@/views/metadata/edit'
import React from 'react'

const ProductAdd = () => {
  return (
    <Guard permission={PERMISSIONS.PRODUCT.ADD}>
      <EditProductMetadataForm />
    </Guard>
  )
}

export default ProductAdd
