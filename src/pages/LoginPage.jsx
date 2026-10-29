import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../store/authSlice.js'

function LoginPage() {
  const dispatch = useDispatch()
  const status = useSelector((state) => state.auth.status)
  const error = useSelector((state) => state.auth.error)
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const from = location.state?.from?.pathname ?? '/devices'

  function handleSubmit(e) {
    e.preventDefault()
    dispatch(login({ email, password }))
      .unwrap()
      .then(() => navigate(from, { replace: true }))
      .catch(() => {})
  }

  return (
    <div>
      <h1>Prijava</h1>

      {error ? <p role="alert">{error}</p> : null}

      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="email">E-pošta</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div>
          <label htmlFor="password">Lozinka</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        <button type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Prijava...' : 'Prijavi se'}
        </button>
      </form>
    </div>
  )
}

export default LoginPage