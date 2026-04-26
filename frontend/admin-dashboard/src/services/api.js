import axios from 'axios'
import { mockIncidents, mockCommentaires, mockUsers, getStats, mockLogin } from './mockData'
import { getValidToken, keycloakLogout } from './keycloak'

export const USE_MOCK = true

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'
const http = axios.create({ baseURL: BASE })

http.interceptors.request.use(async cfg => {
  const token = USE_MOCK ? localStorage.getItem('token') : await getValidToken()
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})
http.interceptors.response.use(res => res, err => {
  if (err.response?.status === 401 && !USE_MOCK) keycloakLogout()
  return Promise.reject(err)
})

// ── INCIDENTS ──────────────────────────────────────────────────────
export const getIncidents = async () => {
  if (USE_MOCK) return [...mockIncidents]
  return (await http.get('/api/incidents')).data
}
export const getIncidentById = async (id) => {
  if (USE_MOCK) return mockIncidents.find(i => i.id === id) || null
  return (await http.get(`/api/incidents/${id}`)).data
}
export const createIncident = async (data) => {
  if (USE_MOCK) {
    const user = getCurrentUser()
    const n = { ...data, id:`INC-${String(mockIncidents.length+1).padStart(3,'0')}`, statut:'Nouveau', utilisateur_id:user?.id, utilisateur_nom:`${user?.prenom} ${user?.nom}`, technicien_nom:null, date_creation:new Date().toISOString() }
    mockIncidents.push(n); mockCommentaires[n.id] = []; return n
  }
  return (await http.post('/api/incidents', data)).data
}
export const updateIncident = async (id, data) => {
  if (USE_MOCK) {
    const idx = mockIncidents.findIndex(i => i.id === id)
    if (idx !== -1) mockIncidents[idx] = { ...mockIncidents[idx], ...data }
    return mockIncidents[idx]
  }
  return (await http.put(`/api/incidents/${id}`, data)).data
}
export const deleteIncident = async (id) => {
  if (USE_MOCK) { const idx = mockIncidents.findIndex(i=>i.id===id); if(idx!==-1) mockIncidents.splice(idx,1); return true }
  await http.delete(`/api/incidents/${id}`); return true
}
export const updateStatut       = (id, statut)        => updateIncident(id, { statut })
export const assignerTechnicien = (id, technicien_nom) => updateIncident(id, { technicien_nom, statut:'Assigné' })

// ── COMMENTAIRES ───────────────────────────────────────────────────
export const getCommentaires = async (incidentId) => {
  if (USE_MOCK) return mockCommentaires[incidentId] || []
  return (await http.get(`/api/comments?incidentId=${incidentId}`)).data
}
export const ajouterCommentaire = async (incidentId, message) => {
  const user = getCurrentUser()
  if (USE_MOCK) {
    const c = { id:`c${Date.now()}`, auteur:`${user?.prenom} ${user?.nom}`, role:user?.role||'Technicien', message, date:new Date().toISOString() }
    if (!mockCommentaires[incidentId]) mockCommentaires[incidentId] = []
    mockCommentaires[incidentId].push(c); return c
  }
  return (await http.post('/api/comments', { incidentId, message })).data
}
export const supprimerCommentaire = async (id) => {
  if (USE_MOCK) {
    for (const k of Object.keys(mockCommentaires)) {
      const idx = mockCommentaires[k].findIndex(c=>c.id===id)
      if (idx!==-1) { mockCommentaires[k].splice(idx,1); return true }
    }
    return true
  }
  await http.delete(`/api/comments/${id}`); return true
}

// ── UTILISATEURS ───────────────────────────────────────────────────
export const getUsers = async () => {
  if (USE_MOCK) return [...mockUsers]
  return (await http.get('/api/users')).data
}

// ── STATS ──────────────────────────────────────────────────────────
export const getStats2 = async () => {
  if (USE_MOCK) return getStats()
  return (await http.get('/api/incidents/stats')).data
}

// ── AUTH ───────────────────────────────────────────────────────────
export const login = async (email, password) => {
  if (USE_MOCK) {
    // mockLogin accepte N'IMPORTE QUEL @usms.ac.ma
    const user = mockLogin(email, password)
    localStorage.setItem('token', 'mock-token-admin')
    localStorage.setItem('user', JSON.stringify(user))
    return user
  }
  throw new Error('En production, Keycloak gère l\'authentification')
}
export const logout = () => {
  if (USE_MOCK) { localStorage.removeItem('token'); localStorage.removeItem('user') }
  else keycloakLogout()
}
export const getCurrentUser = () => {
  try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
}
