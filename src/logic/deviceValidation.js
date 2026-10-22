const SERIAL_PATTERN = /^[A-Z0-9]{8,14}$/
const DEVICE_TYPES = ['laptop', 'phone', 'tablet', 'desktop', 'console']

export function validateDevice(values) {
  const errors = {}

  if (!values.clientId) {
    errors.clientId = 'Odaberite klijenta.'
  }

  if (!values.type || !DEVICE_TYPES.includes(values.type)) {
    errors.type = 'Odaberite vrstu uređaja.'
  }

  const brand = values.brand?.trim() ?? ''
  if (!brand) {
    errors.brand = 'Unesite proizvođača.'
  } else if (brand.length < 2 || brand.length > 40) {
    errors.brand = 'Proizvođač mora imati 2 do 40 znakova.'
  }

  const model = values.model?.trim() ?? ''
  if (!model) {
    errors.model = 'Unesite model.'
  } else if (model.length > 60) {
    errors.model = 'Model smije imati najviše 60 znakova.'
  }

  const serialNumber = values.serialNumber?.trim() ?? ''
  if (!serialNumber) {
    errors.serialNumber = 'Unesite serijski broj.'
  } else if (!SERIAL_PATTERN.test(serialNumber)) {
    errors.serialNumber = 'Serijski broj mora imati 8 do 14 velikih slova i znamenaka.'
  }

  return errors
}