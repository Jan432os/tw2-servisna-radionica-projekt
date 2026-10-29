import { Routes, Route } from 'react-router-dom'
import Layout from './pages/Layout.jsx'
import DevicesListPage from './pages/DevicesListPage.jsx'
import DeviceDetailPage from './pages/DeviceDetailPage.jsx'
import DeviceWorkOrdersPage from './pages/DeviceWorkOrdersPage.jsx'
import DeviceFormPage from './pages/DeviceFormPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<DevicesListPage />} />
        <Route path="devices" element={<DevicesListPage />} />
        <Route
          path="devices/new"
          element={
            <ProtectedRoute>
              <DeviceFormPage />
            </ProtectedRoute>
          }
        />
        <Route path="devices/:id" element={<DeviceDetailPage />}>
          <Route path="work-orders" element={<DeviceWorkOrdersPage />} />
        </Route>
        <Route
          path="devices/:id/edit"
          element={
            <ProtectedRoute>
              <DeviceFormPage />
            </ProtectedRoute>
          }
        />
        <Route path="login" element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App