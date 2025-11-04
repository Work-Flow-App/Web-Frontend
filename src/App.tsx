import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Signup } from './pages/auth/Signup'
import { Login } from './pages/auth/Login'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signin" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
