import LoadingFallback from '@/components/shared/loading'
import EditProductPage from '@/views/products/edit'
import React, { Suspense } from 'react'

const EditProductView = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <EditProductPage />
    </Suspense>
  )
}

export default EditProductView
