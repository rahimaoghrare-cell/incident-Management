# Frontend — Membre 5 — Système GestIncident USMS

Deux applications React **100% indépendantes**, chacune représente un microservice frontend dans l'architecture globale.

---

## Architecture

```
frontend/
├── admin-dashboard/   → Interface techniciens  (port 3000)
└── client-app/        → Interface utilisateurs (port 3001)
```

Chaque app communique uniquement via le **Gateway (port 8080)** du Membre 1.

---

## Lancement rapide

### Admin Dashboard
```bash
cd admin-dashboard
npm install
npm run dev
# → http://localhost:3000
```
**Compte test :** `hasnae.zouhiri@usms.ac.ma` / `12345678`

### App Client
```bash
cd client-app
npm install
npm run dev
# → http://localhost:3001
```
**Compte test :** `chaymae.alaoui@usms.ac.ma` / `12345678`

---

## Connexion au backend (microservices)

Dans chaque `src/services/api.js`, changer :
```js
export const USE_MOCK = false  // ← était true
```

Les variables d'environnement `.env` :
```
VITE_API_URL=http://localhost:8080          # Gateway (Membre 1)
VITE_KEYCLOAK_URL=http://localhost:8180     # Keycloak (Membre 2)
VITE_KEYCLOAK_REALM=incidents-realm
VITE_KEYCLOAK_CLIENT=admin-dashboard       # ou client-app
```

---

## Pages — Admin Dashboard

| Route | Page | Fonctionnalités |
|---|---|---|
| `/login` | Connexion | Email + MDP, validation |
| `/` | Dashboard | Stats, incidents récents |
| `/incidents` | Liste | Recherche, filtres, CRUD |
| `/incidents/nouveau` | Création | Formulaire + upload |
| `/incidents/:id` | Détail | Statut, commentaires, notifications |
| `/incidents/:id/modifier` | Modification | Édition complète |
| `/incidents/:id/assigner` | Assignation | Choisir technicien |
| `/users` | Utilisateurs | Liste équipe |
| `/profil` | Mon profil | Infos + historique |

## Pages — App Client

| Route | Page | Fonctionnalités |
|---|---|---|
| `/login` | Connexion | Email + MDP, validation |
| `/chat` | Bot assistant | IA, suggestions, créer ticket |
| `/incidents` | Mes tickets | Liste + filtres + suppression |
| `/incidents/:id` | Détail ticket | Suivi + commentaires |
| `/creer` | Nouveau ticket | Formulaire + capture d'écran |
| `/profil` | Mon profil | Infos + historique + avatar |

---

## Communication avec les microservices

```
App Client (3001) ─────────┐
                            ├──→ Gateway :8080 ──→ Service Incident  :8082
App Admin  (3000) ─────────┘                  ──→ Service Comment   :8083
                                               ──→ Service Utilisateur :8081
                                               ──→ Service Chat      :8084
                                               ──→ Keycloak          :8180
```
