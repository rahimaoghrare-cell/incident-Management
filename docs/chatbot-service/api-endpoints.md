# API Endpoints — Chatbot Service

## REST

### POST /api/chat
Envoie un message au chatbot.

**Request Body :**
```json
{
  "conversationId": "conv-001",
  "content": "Quels sont les incidents critiques ?"
}
```

**Response :**
```json
{
  "conversationId": "conv-001",
  "role": "assistant",
  "content": "Il y a actuellement 3 incidents critiques...",
  "timestamp": "2026-04-24T10:30:00"
}
```

### GET /api/chat/health
Vérifie que le service est actif.

**Response :** `chatbot-service OK - port 8084`

---

## WebSocket (STOMP)

### Connexion
`ws://localhost:8084/ws/chat`

### Envoyer un message
- Destination : `/app/chat.send`

### Recevoir la réponse
- Subscribe : `/topic/chat/{conversationId}`