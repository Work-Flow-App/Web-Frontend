import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Signup } from './pages/auth/Signup'
import { WorkerSignup } from './pages/auth/WorkerSignup'
import { Login } from './pages/auth/Login'
import { ForgotPassword } from './pages/auth/ForgotPassword'
import { ResetPassword } from './pages/auth/ResetPassword'
import { VerifyEmail } from './pages/auth/VerifyEmail'
import { ResendVerification } from './pages/auth/ResendVerification'
import { CompanyPage } from './pages/company/CompanyPage'
import { CompanyProfile } from './pages/company/CompanyProfile'
import {
  WorkerPage,
  WorkerDashboard,
  WorkerJobWorkflowsList,
  WorkerJobWorkflowDetail,
  WorkerStepsList,
  WorkerStepDetail,
} from './pages/worker'
import { InvitationsPage } from './pages/invitations'
import { ClientPage } from './pages/client/ClientPage'
import { JobsPage } from './pages/jobs/JobsPage'
import { JobDetailsPage } from './pages/jobs/JobDetailsPage'
import { TemplatesPage } from './pages/templates/TemplatesPage'
import { TemplateFieldsPage } from './pages/templates/TemplateFieldsPage'
import { WorkflowsPage } from './pages/workflows/WorkflowsPage'
import { WorkflowBuilderPage } from './pages/workflows/WorkflowBuilderPage'
import { EquipmentPage } from './pages/equipment/EquipmentPage'
import { CustomersPage } from './pages/customers/CustomersPage'
import { SettingsPage } from './pages/settings/SettingsPage'
import { MapsPage, AssetsPage, AssetHistory } from './pages/assets'
import { LineItemsPage } from './pages/lineItems'
import { NotFound } from './pages/NotFound'
import { Layout } from './layouts/Layout'
import { AppConfiguration } from './components/AppConfiguration'
import { GlobalModalOuterContextProvider, GlobalModal } from './components/UI/GlobalModal'
import { GlobalSnackbarProvider } from './contexts/SnackbarContext'
import { CurrencyProvider } from './contexts/CurrencyContext'
import './App.css'

function App() {
  return (
    <GlobalSnackbarProvider>
      <CurrencyProvider>
      <GlobalModalOuterContextProvider>
        <Router>
          <AppConfiguration />
          <Routes>
            {/* Public routes - No layout */}
            <Route path="/signup" element={<Signup />} />
            <Route path="/signup/worker" element={<WorkerSignup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signin" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/resend-verification" element={<ResendVerification />} />

            {/* Protected routes - With Layout (Sidebar + TopNav) */}
            <Route element={<Layout />}>
              <Route path="/company" element={<CompanyPage />} />
              <Route path="/company/profile" element={<CompanyProfile />} />
              <Route path="/company/workers" element={<WorkerPage />} />
              <Route path="/company/invitations" element={<InvitationsPage />} />
              <Route path="/company/clients" element={<ClientPage />} />
              <Route path="/company/equipments" element={<EquipmentPage />} />
              <Route path="/company/customers" element={<CustomersPage />} />
              <Route path="/company/settings" element={<SettingsPage />} />
              <Route path="/company/jobs" element={<JobsPage />} />
              <Route path="/company/jobs/:jobId/details" element={<JobDetailsPage />} />
              <Route path="/company/jobs/templates" element={<TemplatesPage />} />
              <Route path="/company/jobs/templates/:templateId/fields" element={<TemplateFieldsPage />} />
              <Route path="/company/workflows" element={<WorkflowsPage />} />
              <Route path="/company/workflows/:workflowId/builder" element={<WorkflowBuilderPage />} />
              <Route path="/company/assets" element={<AssetsPage />} />
              <Route path="/company/assets/:assetId/history" element={<AssetHistory />} />
              <Route path="/company/assets/maps" element={<MapsPage />} />
              <Route path="/company/line-items" element={<LineItemsPage />} />

              {/* Worker routes */}
              <Route path="/worker" element={<WorkerDashboard />} />
              <Route path="/worker/job-workflows" element={<WorkerJobWorkflowsList />} />
              <Route path="/worker/job-workflows/:jobWorkflowId" element={<WorkerJobWorkflowDetail />} />
              <Route path="/worker/steps" element={<WorkerStepsList />} />
              <Route path="/worker/steps/:stepId" element={<WorkerStepDetail />} />

              {/* Catch all route - 404 with Layout */}
              <Route path="*" element={<NotFound />} />
            </Route>

            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
          <GlobalModal />
        </Router>
      </GlobalModalOuterContextProvider>
      </CurrencyProvider>
    </GlobalSnackbarProvider>
  )
}

export default App
