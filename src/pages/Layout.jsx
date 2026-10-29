import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../store/AuthContext.jsx'

function Layout() {
  const { user, logout } = useAuth()

  return (
    <div>
      <header>
        <nav>
          <NavLink to="/devices">Uređaji</NavLink>{' '}
          {user ? (
            <>
              <span>Prijavljen: {user.name}</span>{' '}
              <button type="button" onClick={logout}>Odjava</button>
            </>
          ) : (
            <NavLink to="/login">Prijava</NavLink>
          )}
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout