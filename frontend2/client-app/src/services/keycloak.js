// ===================================================
// keycloak.js — Adaptateur officiel Keycloak-JS
// Utilisé quand USE_MOCK = false
// Variables configurées dans .env par le Membre 2
// ===================================================

import Keycloak from 'keycloak-js'

// Instance unique Keycloak (singleton)
const keycloak = new Keycloak({
  url:   import.meta.env.VITE_KEYCLOAK_URL   || 'http://localhost:8180',
  realm: import.meta.env.VITE_KEYCLOAK_REALM || 'incidents-realm',
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT || 'client-app',
})

let initialized = false

// Initialiser Keycloak (appeler une seule fois au démarrage)
export const initKeycloak = async () => {
  if (initialized) return keycloak
  try {
    const auth = await keycloak.init({
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
      pkceMethod: 'S256',
    })
    initialized = true
    if (auth) {
      // Stocker le token pour axios
      localStorage.setItem('token', keycloak.token)
      localStorage.setItem('user', JSON.stringify({
        id:          keycloak.tokenParsed?.sub,
        prenom:      keycloak.tokenParsed?.given_name,
        nom:         keycloak.tokenParsed?.family_name,
        email:       keycloak.tokenParsed?.email,
        role:        keycloak.tokenParsed?.realm_access?.roles?.includes('technicien') ? 'Technicien' : 'Utilisateur',
        avatar:      (keycloak.tokenParsed?.given_name?.[0] || '') + (keycloak.tokenParsed?.family_name?.[0] || ''),
        departement: keycloak.tokenParsed?.departement || '—',
      }))
    }
  } catch (e) {
    console.warn('Keycloak init failed, falling back to mock:', e)
  }
  return keycloak
}

// Rafraîchir le token avant expiration
export const getValidToken = async () => {
  try {
    await keycloak.updateToken(30) // rafraîchir si expire dans < 30s
    localStorage.setItem('token', keycloak.token)
    return keycloak.token
  } catch {
    keycloak.login()
    return null
  }
}

// Déconnexion Keycloak
export const keycloakLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  keycloak.logout({ redirectUri: window.location.origin + '/login' })
}

export default keycloak
