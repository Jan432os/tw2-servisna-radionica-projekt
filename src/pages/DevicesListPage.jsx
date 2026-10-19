import { useEffect, useState } from 'react'
import * as devicesService from '../services/devices.js'

function DevicesListPage() {
  const [status, setStatus] = useState('idle')
  const [devices, setDevices] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    setStatus('loading')
    devicesService
      .getAll({ _page: 1, _per_page: 10, _embed: 'client' })
      .then((response) => {
        setDevices(response.data)
        setStatus(response.data.length === 0 ? 'empty' : 'success')
      })
      .catch((err) => {
        setError(err)
        setStatus('error')
      })
  }, [])

  if (status === 'idle' || status === 'loading') {
    return <p>Učitavanje...</p>
  }

  if (status === 'error') {
    return <p role="alert">{error.message}</p>
  }

  if (status === 'empty') {
    return <p>Nema pronađenih uređaja.</p>
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Proizvođač</th>
          <th>Model</th>
          <th>Vrsta</th>
          <th>Serijski broj</th>
          <th>Klijent</th>
        </tr>
      </thead>
      <tbody>
        {devices.map((device) => (
          <tr key={device.id}>
            <td>{device.brand}</td>
            <td>{device.model}</td>
            <td>{device.type}</td>
            <td>{device.serialNumber}</td>
            <td>{device.client?.name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default DevicesListPage