import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div className="text-center py-5">
      <h1>Stranica ne postoji</h1>
      <p><Link className="btn btn-primary" to="/devices">Natrag na popis uređaja</Link></p>
    </div>
  )
}

export default NotFoundPage