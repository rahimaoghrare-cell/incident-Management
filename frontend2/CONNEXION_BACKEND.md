# Guide connexion Frontend ↔ Backend

## Pour connecter le frontend au backend (quand vous êtes prêts)

### Étape 1 — Changer USE_MOCK dans les deux apps

**admin-dashboard/src/services/api.js** ligne 18 :
```js
export const USE_MOCK = false
```

**client-app/src/services/api.js** ligne 14 :
```js
export const USE_MOCK = false
```

---

### Étape 2 — Remplir les .env

**admin-dashboard/.env** :
```
VITE_API_URL=http://localhost:8080
VITE_KEYCLOAK_URL=http://localhost:8180
VITE_KEYCLOAK_REALM=incidents-realm
VITE_KEYCLOAK_CLIENT=admin-dashboard
```

**client-app/.env** :
```
VITE_API_URL=http://localhost:8080
VITE_KEYCLOAK_URL=http://localhost:8180
VITE_KEYCLOAK_REALM=incidents-realm
VITE_KEYCLOAK_CLIENT=client-app
```

---

### Étape 3 — Configurer Keycloak (Membre 2)

Dans Keycloak, créer 2 clients :
- `admin-dashboard` avec redirect URI : `http://localhost:3000/*`
- `client-app` avec redirect URI : `http://localhost:3001/*`

Ajouter CORS : `http://localhost:3000` et `http://localhost:3001`

---

### Routes API attendues par le frontend (Membre 1 & 3)

| Méthode | Route | Service |
|---------|-------|---------|
| GET | /api/incidents | Membre 3 |
| GET | /api/incidents/:id | Membre 3 |
| POST | /api/incidents | Membre 3 |
| PUT | /api/incidents/:id | Membre 3 |
| DELETE | /api/incidents/:id | Membre 3 |
| GET | /api/incidents/stats | Membre 3 |
| GET | /api/incidents/mes-incidents | Membre 3 |
| GET | /api/comments?incidentId=X | Membre 3 |
| POST | /api/comments | Membre 3 |
| DELETE | /api/comments/:id | Membre 3 |
| GET | /api/users | Membre 2 |
| POST | /api/chat/message | Membre 4 |

---

### Format JSON attendu — Incident

```json
{
  "id": "INC-001",
  "titre": "...",
  "description": "...",
  "statut": "Nouveau|Assigné|En cours|Résolu|Fermé",
  "priorite": "Basse|Moyenne|Haute",
  "categorie": "Matériel|Logiciel|Réseau|Sécurité|Autre",
  "utilisateur_id": "uuid",
  "utilisateur_nom": "Prénom Nom",
  "technicien_nom": "Prénom Nom ou null",
  "date_creation": "2024-04-10T09:30:00"
}
```

### Format JSON attendu — Commentaire

```json
{
  "id": "uuid",
  "auteur": "Prénom Nom",
  "role": "Technicien|Utilisateur",
  "message": "...",
  "date": "2024-04-10T10:00:00"
}
```
