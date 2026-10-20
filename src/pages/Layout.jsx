import { NavLink, Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div>
      <header>
        <nav>
          <NavLink to="/devices">Uređaji</NavLink>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout