# Stage 1: build bằng Maven
# Use a stable Temurin 17-based Maven image (widely available)
FROM maven:3.9.4-eclipse-temurin-17 AS builder
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Stage 2: run Spring Boot
# Stage 2: run Spring Boot
# Use OpenJDK 17 slim runtime
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
