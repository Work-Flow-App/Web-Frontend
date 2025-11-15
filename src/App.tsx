import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './layouts/Layout'
import { Signup } from './pages/auth/Signup'
import { Login } from './pages/auth/Login'
import { ForgotPassword } from './pages/auth/ForgotPassword'
import { DashboardPage } from './pages/company/DashboardPage'
import { WorkersPage } from './pages/company/WorkersPage'
import { JobsPage } from './pages/company/JobsPage'
import { ClientsPage } from './pages/company/ClientsPage'
import { EquipmentsPage } from './pages/company/EquipmentsPage'
import { CustomersPage } from './pages/company/CustomersPage'
import { SettingsPage } from './pages/company/SettingsPage'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth routes (without Layout) */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signin" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Company routes (with persistent Layout) */}
        <Route element={<Layout />}>
          <Route path="/company" element={<DashboardPage />} />
          <Route path="/company/workers" element={<WorkersPage />} />
          <Route path="/company/jobs" element={<JobsPage />} />
          <Route path="/company/clients" element={<ClientsPage />} />
          <Route path="/company/equipments" element={<EquipmentsPage />} />
          <Route path="/company/customers" element={<CustomersPage />} />
          <Route path="/company/settings" element={<SettingsPage />} />
        </Route>

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
