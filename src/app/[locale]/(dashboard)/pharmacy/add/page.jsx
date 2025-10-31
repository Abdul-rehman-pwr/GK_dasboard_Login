import Guard from '@/components/guard'
import { PERMISSIONS } from '@/utils/permissions'
import AddPharmacyView from '@/views/pharmacy/add'
import React from 'react'

const AddPharmacyPage = () => {
  return (
    <Guard permission={PERMISSIONS.PHARMACY.ADD}>
      <AddPharmacyView />
    </Guard>
  )
}

export default AddPharmacyPage
