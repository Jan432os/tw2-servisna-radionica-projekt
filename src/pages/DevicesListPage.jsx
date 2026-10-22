import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as devicesService from '../services/devices.js'
import { filterByType, searchDevices, sortDevices, paginate } from '../logic/deviceFilters.js'

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
  const [status, setStatus] = useState('idle')
  const [devices, setDevices] = useState([])
  const [error, setError] = useState(null)

  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [sortKey, setSortKey] = useState(null)
  const [sortDirection, setSortDirection] = useState('asc')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)

  useEffect(() => {
    setStatus('loading')
    devicesService
      .getAll({ _embed: 'client' })
      .then((data) => {
        setDevices(data)
        setStatus('success')
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
      <p><Link to="/devices/new">+ Novi uređaj</Link></p>

      <div>
        <label htmlFor="search">Pretraga</label>
        <input
          id="search"
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setPage(1)
          }}
          placeholder="Proizvođač, model, serijski broj ili klijent"
        />

        <label htmlFor="type-filter">Vrsta</label>
        <select
          id="type-filter"
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

        <label htmlFor="per-page">Po stranici</label>
        <select
          id="per-page"
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

      {totalItems === 0 ? (
        <p>Nema pronađenih uređaja za zadane uvjete.</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                {COLUMNS.map((column) => (
                  <th key={column.key}>
                    <button type="button" onClick={() => handleSort(column.key)}>
                      {column.label}
                      {sortKey === column.key ? (sortDirection === 'asc' ? ' ▲' : ' ▼') : ''}
                    </button>
                  </th>
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

          <div>
            <button type="button" disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)}>
              Prethodna
            </button>
            <span> Stranica {currentPage} / {totalPages} ({totalItems} uređaja) </span>
            <button type="button" disabled={currentPage >= totalPages} onClick={() => setPage(currentPage + 1)}>
              Sljedeća
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default DevicesListPage