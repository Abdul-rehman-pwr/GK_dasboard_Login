// store/store.js
import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

// Import your slices
import userReducer from './slices/userSlice'
import templatesReducer from './slices/templateSlice'
import pharmacySlice from '@/store/slices/pharmacy-slice'
const persistConfig = {
  key: 'templates',
  storage
}

const persistedTemplateReducer = persistReducer(persistConfig, templatesReducer)

const store = configureStore({
  reducer: {
    templateReducer: persistedTemplateReducer,
    pharmacy: pharmacySlice
  }
})

export const persistor = persistStore(store)

export default store
