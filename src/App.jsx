import { Routes, Route } from 'react-router-dom'
import Layout from './pages/Layout.jsx'
import DevicesListPage from './pages/DevicesListPage.jsx'
import DeviceDetailPage from './pages/DeviceDetailPage.jsx'
import DeviceWorkOrdersPage from './pages/DeviceWorkOrdersPage.jsx'
import DeviceFormPage from './pages/DeviceFormPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<DevicesListPage />} />
        <Route path="devices" element={<DevicesListPage />} />
        <Route path="devices/new" element={<DeviceFormPage />} />
        <Route path="devices/:id" element={<DeviceDetailPage />}>
          <Route path="work-orders" element={<DeviceWorkOrdersPage />} />
        </Route>
        <Route path="devices/:id/edit" element={<DeviceFormPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App