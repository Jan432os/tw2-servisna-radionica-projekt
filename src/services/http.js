import axios from 'axios'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

export class RequestError extends Error {
  constructor({ message, kind, status, fields }) {
    super(message)
    this.name = 'RequestError'
    this.kind = kind
    this.status = status
    this.fields = fields ?? {}
  }
}

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

client.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[http]', error)

    if (!error.response) {
      throw new RequestError({
        message: 'Poslužitelj nije dostupan. Provjerite radi li i pokušajte ponovno.',
        kind: 'network',
      })
    }

    const { status, data } = error.response

    if (status === 401) {
      throw new RequestError({
        message: 'Prijava je istekla. Prijavite se ponovno.',
        kind: 'auth',
        status,
      })
    }

    if (status >= 500) {
      throw new RequestError({
        message: 'Pogreška na poslužitelju. Pokušajte kasnije.',
        kind: 'server',
        status,
      })
    }

    throw new RequestError({
      message: data?.message ?? 'Zahtjev nije uspio.',
      kind: 'validation',
      status,
      fields: data?.fields,
    })
  },
)

export const get = (path, params) => client.get(path, { params }).then((r) => r.data)

export const post = (path, body) => client.post(path, body).then((r) => r.data)

export const put = (path, body) => client.put(path, body).then((r) => r.data)

export const remove = (path) => client.delete(path).then((r) => r.data)