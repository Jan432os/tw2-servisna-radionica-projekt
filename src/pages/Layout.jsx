import { NavLink, Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/authSlice.js'

function Layout() {
  const user = useSelector((state) => state.auth.user)
  const dispatch = useDispatch()

  return (
    <div>
      <header>
        <nav>
          <NavLink to="/devices">Uređaji</NavLink>{' '}
          {user ? (
            <>
              <span>Prijavljen: {user.name}</span>{' '}
              <button type="button" onClick={() => dispatch(logout())}>Odjava</button>
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