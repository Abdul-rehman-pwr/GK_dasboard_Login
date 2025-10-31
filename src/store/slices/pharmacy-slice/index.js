import { createSlice } from '@reduxjs/toolkit'
import { getPharmacies } from '@/store/actions/pharmacy-actions'
const pharmacySlice = createSlice({
  name: 'pharmacy',
  initialState: {
    data: {}
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getPharmacies.fulfilled, (state, action) => {
      console.log({ action })
      state.data = action?.payload || {}
    })
  }
})

export default pharmacySlice.reducer
