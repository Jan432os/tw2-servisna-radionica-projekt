import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import * as devicesService from '../services/devices.js'
import * as clientsService from '../services/clients.js'
import { createDevice, updateDevice } from '../store/devicesSlice.js'
import { validateDevice } from '../logic/deviceValidation.js'

const DEVICE_TYPES = ['laptop', 'phone', 'tablet', 'desktop', 'console']
const EMPTY_FORM = { clientId: '', type: '', brand: '', model: '', serialNumber: '' }

function DeviceFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [status, setStatus] = useState(isEdit ? 'loading' : 'idle')
  const [error, setError] = useState(null)
  const [clients, setClients] = useState([])
  const [values, setValues] = useState(EMPTY_FORM)
  const [fieldErrors, setFieldErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    clientsService.getAll().then(setClients).catch(() => setClients([]))
  }, [])

  useEffect(() => {
    if (!isEdit) return
    devicesService
      .getOne(id)
      .then((device) => {
        setValues({
          clientId: String(device.clientId),
          type: device.type,
          brand: device.brand,
          model: device.model,
          serialNumber: device.serialNumber,
        })
        setStatus('success')
      })
      .catch((err) => {
        setError(err)
        setStatus('error')
      })
  }, [id, isEdit])

  function handleChange(field) {
    return (e) => setValues((prev) => ({ ...prev, [field]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (isSubmitting) return

    const errors = validateDevice(values)
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    const payload = { ...values, clientId: Number(values.clientId) }

    setIsSubmitting(true)
    const action = isEdit ? updateDevice({ id, data: payload }) : createDevice(payload)

    dispatch(action)
      .unwrap()
      .then((device) => navigate(`/devices/${device.id}`))
      .catch((err) => {
        if (err.kind === 'validation' && err.fields) {
          setFieldErrors(err.fields)
        } else {
          setError(err)
        }
      })
      .finally(() => setIsSubmitting(false))
  }

  if (isEdit && status === 'loading') return <p>Učitavanje...</p>
  if (isEdit && status === 'error') return <p role="alert">{error.message}</p>

  return (
    <div>
      <h1>{isEdit ? 'Uređivanje uređaja' : 'Novi uređaj'}</h1>

      {error ? <p role="alert">{error.message}</p> : null}

      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="clientId">Klijent</label>
          <select id="clientId" value={values.clientId} onChange={handleChange('clientId')}>
            <option value="">Odaberite klijenta</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
          </select>
          {fieldErrors.clientId ? <p role="alert">{fieldErrors.clientId}</p> : null}
        </div>

        <div>
          <label htmlFor="type">Vrsta</label>
          <select id="type" value={values.type} onChange={handleChange('type')}>
            <option value="">Odaberite vrstu</option>
            {DEVICE_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {fieldErrors.type ? <p role="alert">{fieldErrors.type}</p> : null}
        </div>

        <div>
          <label htmlFor="brand">Proizvođač</label>
          <input id="brand" type="text" value={values.brand} onChange={handleChange('brand')} />
          {fieldErrors.brand ? <p role="alert">{fieldErrors.brand}</p> : null}
        </div>

        <div>
          <label htmlFor="model">Model</label>
          <input id="model" type="text" value={values.model} onChange={handleChange('model')} />
          {fieldErrors.model ? <p role="alert">{fieldErrors.model}</p> : null}
        </div>

        <div>
          <label htmlFor="serialNumber">Serijski broj</label>
          <input id="serialNumber" type="text" value={values.serialNumber} onChange={handleChange('serialNumber')} />
          {fieldErrors.serialNumber ? <p role="alert">{fieldErrors.serialNumber}</p> : null}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Spremanje...' : 'Spremi'}
        </button>
      </form>
    </div>
  )
}

export default DeviceFormPage