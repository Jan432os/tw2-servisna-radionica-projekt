import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import * as devicesService from '../services/devices.js'
import { removeDevice } from '../store/devicesSlice.js'
import { useFetch } from '../hooks/useFetch.js'
import { useAuth } from '../hooks/useAuth.js'
import ErrorMessage from '../components/ErrorMessage.jsx'
import ConfirmButton from '../components/ConfirmButton.jsx'

function DeviceDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useAuth()
  const [deleteError, setDeleteError] = useState(null)

  const { status, data: device, error } = useFetch(() => devicesService.getOne(id), [id])

  function handleDelete() {
    dispatch(removeDevice(id))
      .unwrap()
      .then(() => navigate('/devices'))
      .catch((err) => setDeleteError(err))
  }

  if (status === 'loading') return <p>Učitavanje...</p>
  if (status === 'error') return <ErrorMessage message={error.message} />

  return (
    <div>
      <p><Link to="/devices">&larr; Natrag na popis</Link></p>
      <h1>{device.brand} {device.model}</h1>
      <p>Vrsta: {device.type}</p>
      <p>Serijski broj: {device.serialNumber}</p>
      <p>Klijent: {device.client?.name} ({device.client?.email})</p>
      {deleteError ? <ErrorMessage message={deleteError.message} /> : null}

      <nav className="d-flex gap-2 mb-3">
        {user ? (
          <>
            <Link className="btn btn-secondary btn-sm" to={`/devices/${id}/edit`}>Uredi</Link>
            <ConfirmButton
              className="btn btn-danger btn-sm"
              confirmMessage="Sigurno želite obrisati ovaj uređaj? Brišu se i njegovi radni nalozi."
              onConfirm={handleDelete}
            >
              Obriši
            </ConfirmButton>
          </>
        ) : null}
        <NavLink className="btn btn-outline-primary btn-sm" to="work-orders">Radni nalozi</NavLink>
      </nav>

      <Outlet />
    </div>
  )
}

export default DeviceDetailPage