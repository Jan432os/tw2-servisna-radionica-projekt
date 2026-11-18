import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/store.js'
import { logout, restoreSession } from './store/authSlice.js'
import { setUnauthorizedHandler } from './services/http.js'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import App from './App.jsx'

// Istek prijave obrađuje se na jednom mjestu: presretač u http.js javi se ovamo,
// a store počisti korisnika i token.
setUnauthorizedHandler(() => store.dispatch(logout()))

if (localStorage.getItem('token')) {
  store.dispatch(restoreSession())
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)