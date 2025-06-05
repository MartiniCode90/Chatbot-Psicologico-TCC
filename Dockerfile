# Stage 1: Construção da aplicação Angular
FROM node:18-alpine AS builder
WORKDIR /app

# Copia os arquivos de dependências que estão na raiz (package.json e package-lock.json)
COPY package*.json ./
RUN npm install

# Copia o restante do código-fonte e constrói a aplicação em modo de produção
COPY . .
RUN npm run build -- --configuration production

# Stage 2: Servir a aplicação com Nginx
FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
# Se o outputPath no angular.json for "dist", ou "dist/chatbot-frontend", ajuste abaixo:
COPY --from=builder /app/dist/chatbot-frontend /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
