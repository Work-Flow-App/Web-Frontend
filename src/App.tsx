import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Signup } from './pages/auth/Signup'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Navigate to="/signup" replace />} />
      </Routes>
    </Router>
  )
}

export default App
