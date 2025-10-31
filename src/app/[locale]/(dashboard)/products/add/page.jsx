import Guard from '@/components/guard'
import { PERMISSIONS } from '@/utils/permissions'
import AddProductPage from '@/views/products/add/page'
import React from 'react'

const ProductAdd = () => {
  return (
    <Guard permission={PERMISSIONS.PRODUCT.ADD}>
      <AddProductPage />
    </Guard>
  )
}

export default ProductAdd
