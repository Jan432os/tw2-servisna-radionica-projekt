import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'

function Layout() {
  const { user, logout } = useAuth()

  return (
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark px-3">
        <NavLink className="navbar-brand" to="/devices">Servisna radionica</NavLink>
        <div className="d-flex align-items-center gap-3 ms-auto">
          {user ? (
            <>
              <span className="text-light">Prijavljen: {user.name}</span>
              <button type="button" className="btn btn-outline-light btn-sm" onClick={logout}>
                Odjava
              </button>
            </>
          ) : (
            <NavLink className="btn btn-outline-light btn-sm" to="/login">Prijava</NavLink>
          )}
        </div>
      </nav>
      <main className="container py-4">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout