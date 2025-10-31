import pharmacyServices from '@/services/pharmacy-services'
import { createAsyncThunk } from '@reduxjs/toolkit'

export const getPharmacies = createAsyncThunk('pharmacy/getPharmacies', async payload => {
  const response = await pharmacyServices.getPharmacies(payload)

  return response.data
})
