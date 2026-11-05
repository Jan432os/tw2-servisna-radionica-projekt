import { useParams } from 'react-router-dom'
import * as devicesService from '../services/devices.js'
import { useFetch } from '../hooks/useFetch.js'
import ErrorMessage from '../components/ErrorMessage.jsx'

function DeviceWorkOrdersPage() {
  const { id } = useParams()
  const { status, data: orders, error } = useFetch(() => devicesService.getWorkOrders(id), [id])

  if (status === 'loading') return <p>Učitavanje naloga...</p>
  if (status === 'error') return <ErrorMessage message={error.message} />
  if (orders.length === 0) return <p>Ovaj uređaj još nema radnih naloga.</p>

  return (
    <div className="table-responsive">
      <table className="table table-sm table-striped">
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
    </div>
  )
}

export default DeviceWorkOrdersPage