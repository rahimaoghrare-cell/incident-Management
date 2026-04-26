import axios from 'axios'
import { mockIncidents, mockCommentaires, mockLogin, getBotResponse } from './mockData'
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
export const getMesIncidents = async () => {
  const user = getCurrentUser()
  if (USE_MOCK) return mockIncidents.filter(i => i.utilisateur_id === user?.id)
  return (await http.get('/api/incidents/mes-incidents')).data
}
export const getIncidentById = async (id) => {
  if (USE_MOCK) return mockIncidents.find(i => i.id === id) || null
  return (await http.get(`/api/incidents/${id}`)).data
}
export const createIncident = async (data) => {
  const user = getCurrentUser()
  if (USE_MOCK) {
    const n = { ...data, id:`INC-${String(mockIncidents.length+100).padStart(3,'0')}`, statut:'Nouveau', utilisateur_id:user?.id, utilisateur_nom:`${user?.prenom} ${user?.nom}`, technicien_nom:null, date_creation:new Date().toISOString() }
    mockIncidents.push(n); return n
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

// ── COMMENTAIRES ───────────────────────────────────────────────────
export const getCommentaires = async (incidentId) => {
  if (USE_MOCK) return mockCommentaires[incidentId] || []
  return (await http.get(`/api/comments?incidentId=${incidentId}`)).data
}
export const ajouterCommentaire = async (incidentId, message) => {
  const user = getCurrentUser()
  if (USE_MOCK) {
    const c = { id:`c${Date.now()}`, auteur:`${user?.prenom} ${user?.nom}`, role:'Utilisateur', message, date:new Date().toISOString() }
    if (!mockCommentaires[incidentId]) mockCommentaires[incidentId] = []
    mockCommentaires[incidentId].push(c); return c
  }
  return (await http.post('/api/comments', { incidentId, message })).data
}

// ── CHAT ───────────────────────────────────────────────────────────
export const envoyerMessageChat = async (message) => {
  if (USE_MOCK) { await new Promise(r => setTimeout(r, 900)); return getBotResponse(message) }
  return (await http.post('/api/chat/message', { message })).data
}

// ── AUTH ───────────────────────────────────────────────────────────
export const login = async (email, password) => {
  if (USE_MOCK) {
    const user = mockLogin(email, password)
    localStorage.setItem('token', 'mock-token-client')
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
