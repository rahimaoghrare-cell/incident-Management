# Architecture — Chatbot Service

## Rôle
Microservice de chatbot IA pour la gestion des incidents.
Permet aux utilisateurs d'interagir en langage naturel avec le système.

## Stack technique
- Java 17
- Spring Boot 3.5.14
- Spring AI 1.0.0-M6 (Claude Anthropic)
- Spring WebSocket (STOMP)
- MongoDB (historique conversations)
- Eureka Client (découverte de services)
- OpenFeign (communication avec incident-service)

## Port : 8084

## Composants internes

| Composant | Rôle |
|---|---|
| WebSocketConfig | Configure STOMP /ws/chat |
| SpringAiConfig | Crée le bean ChatClient |
| ChatService | Logique métier principale |
| ChatRestController | API REST POST /api/chat |
| ChatWebSocketHandler | Gestion messages WebSocket |
| IncidentClient | Appel Feign vers incident-service |
| ConversationRepository | Sauvegarde MongoDB |

## Communication avec les autres services

- Reçoit les requêtes via **API Gateway** (port 8080)
- S'enregistre sur **Eureka** (port 8761)
- Appelle **incident-service** (port 8082) pour le contexte
- Répond au **frontend React** (port 3000) via WebSocket