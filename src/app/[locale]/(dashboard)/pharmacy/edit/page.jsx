import LoadingFallback from '@/components/shared/loading'
import EditPharmacyView from '@/views/pharmacy/edit'
import React, { Suspense } from 'react'

const EditPharmacyPage = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <EditPharmacyView />
    </Suspense>
  )
}

export default EditPharmacyPage
