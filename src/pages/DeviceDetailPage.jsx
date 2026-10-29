import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import * as devicesService from '../services/devices.js'
import { removeDevice } from '../store/devicesSlice.js'
import { useFetch } from '../hooks/useFetch.js'
import { useAuth } from '../hooks/useAuth.js'

function DeviceDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useAuth()
  const [deleteError, setDeleteError] = useState(null)

  const { status, data: device, error } = useFetch(() => devicesService.getOne(id), [id])

  function handleDelete() {
    const confirmed = window.confirm('Sigurno želite obrisati ovaj uređaj? Brišu se i njegovi radni nalozi.')
    if (!confirmed) return

    dispatch(removeDevice(id))
      .unwrap()
      .then(() => navigate('/devices'))
      .catch((err) => setDeleteError(err))
  }

  if (status === 'loading') return <p>Učitavanje...</p>
  if (status === 'error') return <p role="alert">{error.message}</p>

  return (
    <div>
      <p><Link to="/devices">&larr; Natrag na popis</Link></p>
      <h1>{device.brand} {device.model}</h1>
      <p>Vrsta: {device.type}</p>
      <p>Serijski broj: {device.serialNumber}</p>
      <p>Klijent: {device.client?.name} ({device.client?.email})</p>
      {deleteError ? <p role="alert">{deleteError.message}</p> : null}

      <nav>
        {user ? (
          <>
            <Link to={`/devices/${id}/edit`}>Uredi</Link>{' '}
            <button type="button" onClick={handleDelete}>Obriši</button>{' '}
          </>
        ) : null}
        <NavLink to="work-orders">Radni nalozi</NavLink>
      </nav>

      <Outlet />
    </div>
  )
}

export default DeviceDetailPage