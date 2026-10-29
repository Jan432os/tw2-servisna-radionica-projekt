import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'

function LoginPage() {
  const { login, status, error } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const from = location.state?.from?.pathname ?? '/devices'

  function handleSubmit(e) {
    e.preventDefault()
    login({ email, password })
      .then(() => navigate(from, { replace: true }))
      .catch(() => {})
  }

  return (
    <div className="col-12 col-md-6 col-lg-4">
      <h1>Prijava</h1>

      {error ? <p className="text-danger" role="alert">{error}</p> : null}

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">E-pošta</label>
          <input
            id="email"
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Lozinka</label>
          <input
            id="password"
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={status === 'loading'}>
          {status === 'loading' ? 'Prijava...' : 'Prijavi se'}
        </button>
      </form>
    </div>
  )
}

export default LoginPage