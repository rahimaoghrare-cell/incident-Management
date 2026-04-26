import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Navbar }             from './components/Navbar'
import { NotifProvider }      from './components/Notifications'
import { getCurrentUser }     from './services/api'
import PortailPage            from './pages/PortailPage'
import LoginPage              from './pages/LoginPage'
import RegisterPage           from './pages/RegisterPage'
import ForgotPasswordPage     from './pages/ForgotPasswordPage'
import DashboardPage          from './pages/DashboardPage'
import IncidentsListPage      from './pages/IncidentsListPage'
import IncidentDetailPage     from './pages/IncidentDetailPage'
import IncidentFormPage       from './pages/IncidentFormPage'
import IncidentAssignPage     from './pages/IncidentAssignPage'
import UsersPage              from './pages/UsersPage'
import ProfileAdminPage       from './pages/ProfileAdminPage'

function Guard({ children }) {
  return getCurrentUser() ? children : <Navigate to="/login" replace />
}

function Layout({ children }) {
  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#050B18' }}>
      <Navbar />
      <main style={{ flex:1, overflowY:'auto' }}>{children}</main>
    </div>
  )
}

export default function App() {
  return (
    <NotifProvider>
      <BrowserRouter>
        <Routes>
          {/* Pages publiques */}
          <Route path="/portail"               element={<PortailPage />} />
          <Route path="/login"                 element={<LoginPage />} />
          <Route path="/inscription"           element={<RegisterPage />} />
          <Route path="/mot-de-passe-oublie"   element={<ForgotPasswordPage />} />

          {/* Pages protégées */}
          <Route path="/"                      element={<Guard><Layout><DashboardPage /></Layout></Guard>} />
          <Route path="/incidents"             element={<Guard><Layout><IncidentsListPage /></Layout></Guard>} />
          <Route path="/incidents/nouveau"     element={<Guard><Layout><IncidentFormPage /></Layout></Guard>} />
          <Route path="/incidents/:id"         element={<Guard><Layout><IncidentDetailPage /></Layout></Guard>} />
          <Route path="/incidents/:id/modifier" element={<Guard><Layout><IncidentFormPage /></Layout></Guard>} />
          <Route path="/incidents/:id/assigner" element={<Guard><Layout><IncidentAssignPage /></Layout></Guard>} />
          <Route path="/users"                 element={<Guard><Layout><UsersPage /></Layout></Guard>} />
          <Route path="/profil"                element={<Guard><Layout><ProfileAdminPage /></Layout></Guard>} />

          <Route path="*"                      element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </NotifProvider>
  )
}
