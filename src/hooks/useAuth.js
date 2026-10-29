import { useDispatch, useSelector } from 'react-redux'
import { login, logout } from '../store/authSlice.js'

export function useAuth() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const token = useSelector((state) => state.auth.token)
  const status = useSelector((state) => state.auth.status)
  const error = useSelector((state) => state.auth.error)

  return {
    user,
    token,
    status,
    error,
    login: (credentials) => dispatch(login(credentials)).unwrap(),
    logout: () => dispatch(logout()),
  }
}