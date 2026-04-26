import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout }              from './components/Layout'
import { getCurrentUser }      from './services/api'
import LoginPage               from './pages/LoginPage'
import RegisterPage            from './pages/RegisterPage'
import ForgotPasswordPage      from './pages/ForgotPasswordPage'
import ChatPage                from './pages/ChatPage'
import MyIncidentsPage         from './pages/MyIncidentsPage'
import CreateIncidentPage      from './pages/CreateIncidentPage'
import IncidentDetailPage      from './pages/IncidentDetailPage'
import ProfilePage             from './pages/ProfilePage'

function Guard({ children }) {
  return getCurrentUser() ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pages publiques */}
        <Route path="/login"               element={<LoginPage />} />
        <Route path="/inscription"         element={<RegisterPage />} />
        <Route path="/mot-de-passe-oublie" element={<ForgotPasswordPage />} />

        {/* Pages protégées */}
        <Route path="/chat"        element={<Guard><Layout><ChatPage /></Layout></Guard>} />
        <Route path="/incidents"   element={<Guard><Layout><MyIncidentsPage /></Layout></Guard>} />
        <Route path="/incidents/:id" element={<Guard><Layout><IncidentDetailPage /></Layout></Guard>} />
        <Route path="/creer"       element={<Guard><Layout><CreateIncidentPage /></Layout></Guard>} />
        <Route path="/profil"      element={<Guard><Layout><ProfilePage /></Layout></Guard>} />

        <Route path="*"            element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
