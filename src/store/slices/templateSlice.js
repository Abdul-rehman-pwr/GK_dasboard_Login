import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  templates: []
}

const templateSlice = createSlice({
  name: 'templates',
  initialState,
  reducers: {
    setTemplates: (state, action) => {
      state.templates = action.payload
    }
  }
})

export const { setTemplates } = templateSlice.actions
export default templateSlice.reducer
