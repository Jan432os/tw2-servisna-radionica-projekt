import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div>
      <h1>Stranica ne postoji</h1>
      <p><Link to="/devices">Natrag na popis uređaja</Link></p>
    </div>
  )
}

export default NotFoundPage