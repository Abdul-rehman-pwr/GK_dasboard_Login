// store/slices/userSlice.js
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isLoggedIn: false,
  userDetails: null
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true
      state.userDetails = action.payload
    },
    logout: state => {
      state.isLoggedIn = false
      state.userDetails = null
    }
  }
})

export const { login, logout } = userSlice.actions
export default userSlice.reducer
