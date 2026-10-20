import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import * as devicesService from '../services/devices.js'

function DeviceWorkOrdersPage() {
  const { id } = useParams()
  const [status, setStatus] = useState('loading')
  const [orders, setOrders] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    setStatus('loading')
    devicesService
      .getWorkOrders(id)
      .then((data) => {
        setOrders(data)
        setStatus(data.length === 0 ? 'empty' : 'success')
      })
      .catch((err) => {
        setError(err)
        setStatus('error')
      })
  }, [id])

  if (status === 'loading') return <p>Učitavanje naloga...</p>
  if (status === 'error') return <p role="alert">{error.message}</p>
  if (status === 'empty') return <p>Ovaj uređaj još nema radnih naloga.</p>

  return (
    <table>
      <thead>
        <tr>
          <th>Broj naloga</th>
          <th>Status</th>
          <th>Zaprimljeno</th>
          <th>Preuzeto</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id}>
            <td>{order.orderNumber}</td>
            <td>{order.status}</td>
            <td>{order.receivedAt}</td>
            <td>{order.pickupAt ?? '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default DeviceWorkOrdersPage