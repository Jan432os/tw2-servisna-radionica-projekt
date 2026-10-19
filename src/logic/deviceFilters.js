function getValue(device, key) {
  if (key === 'client') return device.client?.name ?? ''
  return device[key]
}

const SEARCHABLE_FIELDS = ['brand', 'model', 'serialNumber', 'client']

export function filterByType(devices, type) {
  if (!type) return devices
  return devices.filter((device) => device.type === type)
}

export function searchDevices(devices, term) {
  const query = term.trim().toLowerCase()
  if (!query) return devices
  return devices.filter((device) =>
    SEARCHABLE_FIELDS.some((field) => String(getValue(device, field)).toLowerCase().includes(query)),
  )
}

export function sortDevices(devices, sortKey, direction) {
  if (!sortKey) return devices
  const factor = direction === 'desc' ? -1 : 1
  return [...devices].sort((a, b) => {
    const valueA = getValue(a, sortKey)
    const valueB = getValue(b, sortKey)
    if (valueA === valueB) return 0
    return valueA > valueB ? factor : -factor
  })
}

export function paginate(devices, page, perPage) {
  const start = (page - 1) * perPage
  return devices.slice(start, start + perPage)
}