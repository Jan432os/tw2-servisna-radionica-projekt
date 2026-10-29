import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as devicesService from '../services/devices.js'

export const fetchDevices = createAsyncThunk('devices/fetchAll', async () => {
  return devicesService.getAll({ _embed: 'client' })
})

export const createDevice = createAsyncThunk('devices/create', async (data, { rejectWithValue }) => {
  try {
    return await devicesService.create(data)
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const updateDevice = createAsyncThunk('devices/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    return await devicesService.update(id, data)
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const removeDevice = createAsyncThunk('devices/remove', async (id, { rejectWithValue }) => {
  try {
    await devicesService.remove(id)
    return id
  } catch (error) {
    return rejectWithValue(error)
  }
})

const initialState = {
  items: [],
  status: 'idle',
  loaded: false,
  error: null,
}

const devicesSlice = createSlice({
  name: 'devices',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDevices.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchDevices.fulfilled, (state, action) => {
        state.status = 'success'
        state.items = action.payload
        state.loaded = true
      })
      .addCase(fetchDevices.rejected, (state, action) => {
        state.status = 'error'
        state.error = action.error.message
      })
      .addCase(createDevice.fulfilled, (state) => {
        state.loaded = false
      })
      .addCase(updateDevice.fulfilled, (state) => {
        state.loaded = false
      })
      .addCase(removeDevice.fulfilled, (state) => {
        state.loaded = false
      })
  },
})

export default devicesSlice.reducer