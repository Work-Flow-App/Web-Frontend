import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import axios from 'axios'
import './index.css'
import App from './App.tsx'
import theme from './theme/theme'
import { setupInterceptors } from './services/api/interceptors'
import { initializeSession } from './services/api/config'

// Setup interceptors on global axios instance
setupInterceptors(axios)

// Initialize session (restore token if available)
initializeSession().catch(error => {
  console.error('Failed to initialize session:', error)
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
)
