import { createContext, useContext, useEffect, useReducer } from 'react'
import * as authService from '../services/auth.js'

const AuthContext = createContext(null)

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  status: 'idle',
  error: null,
}

function reducer(state, action) {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, status: 'loading', error: null }
    case 'LOGIN_SUCCESS':
      return { ...state, status: 'success', user: action.user, token: action.token, error: null }
    case 'LOGIN_ERROR':
      return { ...state, status: 'error', error: action.error, user: null, token: null }
    case 'LOGOUT':
      return { ...state, status: 'idle', user: null, token: null, error: null }
    case 'RESTORED':
      return { ...state, user: action.user }
    default:
      return state
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    if (!state.token) return
    authService
      .getMe()
      .then((user) => dispatch({ type: 'RESTORED', user }))
      .catch(() => {
        localStorage.removeItem('token')
        dispatch({ type: 'LOGOUT' })
      })
  }, [])

  function login(credentials) {
    dispatch({ type: 'LOGIN_START' })
    return authService
      .login(credentials)
      .then(({ token, user }) => {
        localStorage.setItem('token', token)
        dispatch({ type: 'LOGIN_SUCCESS', token, user })
        return user
      })
      .catch((error) => {
        dispatch({ type: 'LOGIN_ERROR', error })
        throw error
      })
  }

  function logout() {
    localStorage.removeItem('token')
    dispatch({ type: 'LOGOUT' })
  }

  return <AuthContext.Provider value={{ ...state, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth mora biti korišten unutar AuthProvider')
  return context
}