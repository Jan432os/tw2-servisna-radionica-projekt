import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useParams } from 'react-router-dom'
import * as devicesService from '../services/devices.js'

function DeviceDetailPage() {
  const { id } = useParams()
  const [status, setStatus] = useState('loading')
  const [device, setDevice] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    setStatus('loading')
    devicesService
      .getOne(id)
      .then((data) => {
        setDevice(data)
        setStatus('success')
      })
      .catch((err) => {
        setError(err)
        setStatus('error')
      })
  }, [id])

  if (status === 'loading') return <p>Učitavanje...</p>
  if (status === 'error') return <p role="alert">{error.message}</p>

  return (
    <div>
      <p><Link to="/devices">&larr; Natrag na popis</Link></p>
      <h1>{device.brand} {device.model}</h1>
      <p>Vrsta: {device.type}</p>
      <p>Serijski broj: {device.serialNumber}</p>
      <p>Klijent: {device.client?.name} ({device.client?.email})</p>

      <nav>
        <NavLink to="work-orders">Radni nalozi</NavLink>
      </nav>

      <Outlet />
    </div>
  )
}

export default DeviceDetailPage