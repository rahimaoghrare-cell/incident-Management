FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY target/*.jar chatbot-service.jar
ENTRYPOINT ["java", "-jar", "chatbot-service.jar"]