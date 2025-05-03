# Stage 1: Builder
FROM maven:3.8.7-eclipse-temurin-17 AS build
WORKDIR /app

# Copia o arquivo pom.xml e baixa as dependências
COPY pom.xml .
RUN mvn dependency:go-offline

# Copia o restante do código-fonte e compila o aplicativo
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Imagem de execução
FROM openjdk:17-jdk-slim
WORKDIR /app

# Copia o jar gerado na etapa de build
COPY --from=build /app/target/chatbot-0.0.1-SNAPSHOT.jar app.jar

# Expõe a porta definida na aplicação (por padrão, 8080)
EXPOSE 8080

# Comando para iniciar a aplicação
ENTRYPOINT ["java", "-jar", "app.jar"]
