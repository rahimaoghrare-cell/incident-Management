# 🚨 Incident Management — Microservices

Projet de gestion des incidents en architecture microservices.
Équipe de 5 personnes — Spring Boot + React.

## 👥 Répartition des services

| Membre | Service | Port |
|--------|---------|------|
| Membre 1 | DevOps / Infra (Eureka, Gateway, Config) | 8761 / 8080 |
| Membre 2 | Auth & Utilisateurs (Keycloak) | 8888 / 8081 |
| Membre 3 | Incident Service + Comment Service | 8082 / 8083 |
| Membre 4 | Chatbot IA (Spring AI + WebSocket) | 8084 |
| Membre 5 | Frontend React (Dashboard + App Client) | 3000 |

## 🚀 Lancer le projet

### Prérequis
- Docker & Docker Compose installés
- Java 17+
- Node.js 20+ (pour le frontend)

### Démarrage
```bash
# 1. Cloner le repo
git clone https://github.com/votre-org/incident-management.git
cd incident-management

# 2. Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos vraies valeurs

# 3. Lancer tous les services
docker-compose up --build

# 4. Lancer un seul service (ex: chatbot)
docker-compose up chatbot-service mongodb
```

## 🌐 URLs utiles

| Service | URL |
|---------|-----|
| Eureka Dashboard | http://localhost:8761 |
| API Gateway | http://localhost:8080 |
| Keycloak Admin | http://localhost:8888 |
| Frontend | http://localhost:3000 |
| Chatbot WS | ws://localhost:8084/ws/chat |

## 📁 Structure du projet
incident-management/
├── infra/               → Membre 1
├── auth-service/        → Membre 2
├── incident-service/    → Membre 3
├── chatbot-service/     → Membre 4
├── frontend/            → Membre 5
├── docker-compose.yml
├── .env.example
└── README.md
## 🔀 Workflow Git
## 🔀 Workflow Git

```bash
# Chaque membre travaille sur sa branche
git checkout -b feature/chatbot-service

# Commit régulier
git add .
git commit -m "feat(chatbot): add WebSocket handler"

# Push et Pull Request vers main
git push origin feature/chatbot-service
```

## 📡 Contrats d'interface (à respecter par tous)

- `POST /api/incidents` → créer un incident
- `GET /api/incidents/active` → incidents actifs (utilisé par le chatbot)
- `POST /api/chat` → envoyer un message au chatbot
- `WS /ws/chat` → connexion WebSocket STOMP