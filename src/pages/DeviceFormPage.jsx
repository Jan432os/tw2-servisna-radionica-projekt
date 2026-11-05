import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import * as devicesService from '../services/devices.js'
import * as clientsService from '../services/clients.js'
import { createDevice, updateDevice } from '../store/devicesSlice.js'
import { validateDevice } from '../logic/deviceValidation.js'
import { useFetch } from '../hooks/useFetch.js'
import FormField from '../components/FormField.jsx'
import SelectField from '../components/SelectField.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'

const DEVICE_TYPES = ['laptop', 'phone', 'tablet', 'desktop', 'console']
const EMPTY_FORM = { clientId: '', type: '', brand: '', model: '', serialNumber: '' }

function DeviceFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { data: clients } = useFetch(() => clientsService.getAll(), [])
  const { status: loadStatus, data: existingDevice, error: loadError } = useFetch(
    () => (isEdit ? devicesService.getOne(id) : Promise.resolve(null)),
    [id, isEdit],
  )

  const [values, setValues] = useState(EMPTY_FORM)
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitError, setSubmitError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (existingDevice) {
      setValues({
        clientId: String(existingDevice.clientId),
        type: existingDevice.type,
        brand: existingDevice.brand,
        model: existingDevice.model,
        serialNumber: existingDevice.serialNumber,
      })
    }
  }, [existingDevice])

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
          setSubmitError(err)
        }
      })
      .finally(() => setIsSubmitting(false))
  }

  if (isEdit && loadStatus === 'loading') return <p>Učitavanje...</p>
  if (isEdit && loadStatus === 'error') return <ErrorMessage message={loadError.message} />

  const clientOptions = (clients ?? []).map((client) => ({ value: client.id, label: client.name }))
  const typeOptions = DEVICE_TYPES.map((type) => ({ value: type, label: type }))

  return (
    <div className="col-12 col-md-8 col-lg-6">
      <h1>{isEdit ? 'Uređivanje uređaja' : 'Novi uređaj'}</h1>

      {submitError ? <ErrorMessage message={submitError.message} /> : null}

      <form onSubmit={handleSubmit} noValidate>
        <SelectField
          id="clientId"
          label="Klijent"
          value={values.clientId}
          onChange={handleChange('clientId')}
          options={clientOptions}
          placeholder="Odaberite klijenta"
          error={fieldErrors.clientId}
        />

        <SelectField
          id="type"
          label="Vrsta"
          value={values.type}
          onChange={handleChange('type')}
          options={typeOptions}
          placeholder="Odaberite vrstu"
          error={fieldErrors.type}
        />

        <FormField
          id="brand"
          label="Proizvođač"
          value={values.brand}
          onChange={handleChange('brand')}
          error={fieldErrors.brand}
        />

        <FormField
          id="model"
          label="Model"
          value={values.model}
          onChange={handleChange('model')}
          error={fieldErrors.model}
        />

        <FormField
          id="serialNumber"
          label="Serijski broj"
          value={values.serialNumber}
          onChange={handleChange('serialNumber')}
          error={fieldErrors.serialNumber}
        />

        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Spremanje...' : 'Spremi'}
        </button>
      </form>
    </div>
  )
}

export default DeviceFormPage