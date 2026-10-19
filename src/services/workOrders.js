import * as http from './http.js'

const RESOURCE = '/work-orders'

export const getAll = (params) => http.get(RESOURCE, params)

export const getOne = (id) => http.get(`${RESOURCE}/${id}`, { _embed: 'device,service' })

export const create = (data) => http.post(RESOURCE, data)

export const update = (id, data) => http.put(`${RESOURCE}/${id}`, data)

export const remove = (id) => http.remove(`${RESOURCE}/${id}`)