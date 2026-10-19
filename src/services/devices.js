import * as http from './http.js'

const RESOURCE = '/devices'

export const getAll = (params) => http.get(RESOURCE, params)

export const getOne = (id) => http.get(`${RESOURCE}/${id}`, { _embed: 'client' })

export const create = (data) => http.post(RESOURCE, data)

export const update = (id, data) => http.put(`${RESOURCE}/${id}`, data)

export const remove = (id) => http.remove(`${RESOURCE}/${id}`)

export const getWorkOrders = (deviceId) => http.get(`${RESOURCE}/${deviceId}/work-orders`)