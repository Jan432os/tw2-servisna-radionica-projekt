import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice.js'
import devicesReducer from './devicesSlice.js'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    devices: devicesReducer,
  },
})