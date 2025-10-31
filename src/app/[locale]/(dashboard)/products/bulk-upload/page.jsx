import Guard from '@/components/guard'
import { PERMISSIONS } from '@/utils/permissions'
import BulkUploadView from '@/views/products/bulkUpload'
import ComingSoon from '@/views/products/bulkUpload/ComingSoon'
import React from 'react'

const ProductBulkUpload = () => {
  return (
    <Guard permission={PERMISSIONS.PRODUCT.BULK_UPLOAD_PRODUCTS}>
      <ComingSoon />
      {/* <BulkUploadView /> */}
    </Guard>
  )
}

export default ProductBulkUpload
