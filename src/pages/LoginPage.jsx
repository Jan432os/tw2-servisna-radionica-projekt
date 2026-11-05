import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import FormField from '../components/FormField.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'

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

      {error ? <ErrorMessage message={error} /> : null}

      <form onSubmit={handleSubmit} noValidate>
        <FormField id="email" label="E-pošta" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <FormField id="password" label="Lozinka" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button type="submit" className="btn btn-primary" disabled={status === 'loading'}>
          {status === 'loading' ? 'Prijava...' : 'Prijavi se'}
        </button>
      </form>
    </div>
  )
}

export default LoginPage