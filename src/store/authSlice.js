import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as authService from '../services/auth.js'

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { token, user } = await authService.login(credentials)
    localStorage.setItem('token', token)
    return user
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const restoreSession = createAsyncThunk('auth/restore', async (_, { rejectWithValue }) => {
  try {
    return await authService.getMe()
  } catch (error) {
    localStorage.removeItem('token')
    return rejectWithValue(error.message)
  }
})

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  status: 'idle',
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      localStorage.removeItem('token')
      state.user = null
      state.token = null
      state.status = 'idle'
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'success'
        state.user = action.payload
        state.token = localStorage.getItem('token')
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'error'
        state.error = action.payload
        state.user = null
        state.token = null
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.user = action.payload
      })
      .addCase(restoreSession.rejected, (state) => {
        state.user = null
        state.token = null
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer