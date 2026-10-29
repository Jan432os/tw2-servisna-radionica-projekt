import * as http from './http.js'

export const login = (credentials) => http.post('/login', credentials)

export const register = (data) => http.post('/register', data)

export const getMe = () => http.get('/me')