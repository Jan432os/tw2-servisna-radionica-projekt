import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDevices } from '../store/devicesSlice.js'
import { filterByType, searchDevices, sortDevices, paginate } from '../logic/deviceFilters.js'
import { useAuth } from '../hooks/useAuth.js'
import ErrorMessage from '../components/ErrorMessage.jsx'
import Pagination from '../components/Pagination.jsx'
import SortableHeader from '../components/SortableHeader.jsx'

const DEVICE_TYPES = ['laptop', 'phone', 'tablet', 'desktop', 'console']
const PER_PAGE_OPTIONS = [10, 20, 50]
const COLUMNS = [
  { key: 'brand', label: 'Proizvođač' },
  { key: 'model', label: 'Model' },
  { key: 'type', label: 'Vrsta' },
  { key: 'serialNumber', label: 'Serijski broj' },
  { key: 'client', label: 'Klijent' },
]

function DevicesListPage() {
  const { user } = useAuth()
  const dispatch = useDispatch()
  const devices = useSelector((state) => state.devices.items)
  const status = useSelector((state) => state.devices.status)
  const loaded = useSelector((state) => state.devices.loaded)
  const error = useSelector((state) => state.devices.error)

  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [sortKey, setSortKey] = useState(null)
  const [sortDirection, setSortDirection] = useState('asc')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)

  useEffect(() => {
    if (!loaded) {
      dispatch(fetchDevices())
    }
  }, [loaded, dispatch])

  if (!loaded && status === 'loading') {
    return <p>Učitavanje...</p>
  }

  if (status === 'error') {
    return <ErrorMessage message={error} />
  }

  const countsByType = devices.reduce((acc, device) => {
    acc[device.type] = (acc[device.type] ?? 0) + 1
    return acc
  }, {})

  const filtered = filterByType(devices, typeFilter)
  const searched = searchDevices(filtered, searchTerm)
  const sorted = sortDevices(searched, sortKey, sortDirection)

  const totalItems = sorted.length
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage))
  const currentPage = Math.min(page, totalPages)
  const pageItems = paginate(sorted, currentPage, perPage)

  function handleSort(key) {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }

  return (
    <div>
      <h1>Uređaji</h1>

      <p className="text-muted small">
        Ukupno {devices.length} uređaja — po vrsti:{' '}
        {Object.entries(countsByType).map(([type, count]) => `${type}: ${count}`).join(', ')}
      </p>

      {user ? (
        <p><Link className="btn btn-primary btn-sm" to="/devices/new">+ Novi uređaj</Link></p>
      ) : null}

      <div className="row g-2 mb-3">
        <div className="col-12 col-md-5">
          <label htmlFor="search" className="form-label">Pretraga</label>
          <input
            id="search"
            type="text"
            className="form-control"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setPage(1)
            }}
            placeholder="Proizvođač, model, serijski broj ili klijent"
          />
        </div>

        <div className="col-6 col-md-4">
          <label htmlFor="type-filter" className="form-label">Vrsta</label>
          <select
            id="type-filter"
            className="form-select"
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value)
              setPage(1)
            }}
          >
            <option value="">Sve vrste</option>
            {DEVICE_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="col-6 col-md-3">
          <label htmlFor="per-page" className="form-label">Po stranici</label>
          <select
            id="per-page"
            className="form-select"
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value))
              setPage(1)
            }}
          >
            {PER_PAGE_OPTIONS.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      </div>

      {totalItems === 0 ? (
        <p>Nema pronađenih uređaja za zadane uvjete.</p>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead>
                <tr>
                  {COLUMNS.map((column) => (
                    <SortableHeader
                      key={column.key}
                      label={column.label}
                      sortKey={column.key}
                      currentSortKey={sortKey}
                      direction={sortDirection}
                      onSort={handleSort}
                    />
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageItems.map((device) => (
                  <tr key={device.id}>
                    <td><Link to={`/devices/${device.id}`}>{device.brand}</Link></td>
                    <td>{device.model}</td>
                    <td>{device.type}</td>
                    <td>{device.serialNumber}</td>
                    <td>{device.client?.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            onPrev={() => setPage(currentPage - 1)}
            onNext={() => setPage(currentPage + 1)}
          />
        </>
      )}
    </div>
  )
}

export default DevicesListPage