import { useEffect, useRef, useState } from 'react'

export function useFetch(fetchFn, deps = []) {
  const [status, setStatus] = useState('loading')
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const fetchFnRef = useRef(fetchFn)
  fetchFnRef.current = fetchFn

  useEffect(() => {
    let cancelled = false
    setStatus('loading')
    setError(null)

    fetchFnRef.current()
      .then((result) => {
        if (cancelled) return
        setData(result)
        setStatus('success')
      })
      .catch((err) => {
        if (cancelled) return
        setError(err)
        setStatus('error')
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { status, data, error }
}