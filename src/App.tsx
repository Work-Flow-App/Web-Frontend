import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Signup } from './pages/auth/Signup'
import { Login } from './pages/auth/Login'
import { ForgotPassword } from './pages/auth/ForgotPassword'
import { ResetPassword } from './pages/auth/ResetPassword'
import { CompanyPage } from './pages/company/CompanyPage'
import { WorkerPage } from './pages/worker/WorkerPage'
import { AppConfiguration } from './components/AppConfiguration'
import { GlobalModalOuterContextProvider, GlobalModal } from './components/UI/GlobalModal'
import { GlobalSnackbarProvider } from './contexts/SnackbarContext'
import './App.css'

function App() {
  return (
    <GlobalSnackbarProvider>
      <GlobalModalOuterContextProvider>
        <Router>
          <AppConfiguration />
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signin" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/company" element={<CompanyPage />} />
            <Route path="/worker" element={<WorkerPage />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
          <GlobalModal />
        </Router>
      </GlobalModalOuterContextProvider>
    </GlobalSnackbarProvider>
  )
}

export default App
