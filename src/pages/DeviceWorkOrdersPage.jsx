import { useParams } from 'react-router-dom'
import * as devicesService from '../services/devices.js'
import { useFetch } from '../hooks/useFetch.js'

function DeviceWorkOrdersPage() {
  const { id } = useParams()
  const { status, data: orders, error } = useFetch(() => devicesService.getWorkOrders(id), [id])

  if (status === 'loading') return <p>Učitavanje naloga...</p>
  if (status === 'error') return <p role="alert">{error.message}</p>
  if (orders.length === 0) return <p>Ovaj uređaj još nema radnih naloga.</p>

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