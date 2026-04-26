# Guide de démarrage — Chatbot Service

## Prérequis
- Java 17 installé
- Maven installé
- MongoDB en cours d'exécution (port 27017)
- Clé API Anthropic

## Variables d'environnement
Crée un fichier `.env` à la racine ou configure dans application.yml :
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxx
SPRING_DATA_MONGODB_URI=mongodb://localhost:27017/chatbot_db
EUREKA_URI=http://localhost:8761/eureka/
INCIDENT_SERVICE_URL=http://localhost:8082
## Lancer le service

```powershell
# Compiler
mvn clean package -DskipTests

# Lancer
mvn spring-boot:run
```

## Tester

### REST (Thunder Client ou Postman)
POST http://localhost:8084/api/chat
Content-Type: application/json
{
"content": "Bonjour, quels incidents sont ouverts ?"
}
### Health check
GET http://localhost:8084/api/chat/health
## Docker
```powershell
# Build
mvn clean package -DskipTests
docker build -t chatbot-service .

# Run
docker run -p 8084:8084 \
  -e ANTHROPIC_API_KEY=sk-ant-xxx \
  chatbot-service
