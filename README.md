# Chatbot-Psicologico-TCC

# Chatbot de Apoio Psicológico Inicial com IA

Este projeto é o Trabalho de Conclusão de Curso (TCC) que propõe o desenvolvimento de um sistema de chatbot utilizando Inteligência Artificial para fornecer suporte emocional inicial a usuários. O objetivo é oferecer uma ferramenta acessível e segura para primeiros atendimentos de acolhimento psicológico, respeitando limites éticos e sem substituir atendimento profissional.

## 📚 Descrição

O chatbot é integrado a um modelo de linguagem natural (LLM) local via Ollama, utilizando o modelo **Gemma 3:4b**. Ele é capaz de interpretar mensagens dos usuários e fornecer respostas empáticas e coerentes. Todo o histórico das conversas é armazenado em um banco de dados PostgreSQL, permitindo rastreabilidade e análise.

## 🧩 Tecnologias Utilizadas

- **Backend**: Java 17, Spring Boot, Spring Security, Spring AI
- **Frontend**: Angular 18
- **IA**: Ollama com modelo Gemma 3:4b
- **Banco de Dados**: PostgreSQL
- **Autenticação**: JWT (JSON Web Token)
- **Containerização**: Docker, Docker Compose

## 📐 Arquitetura

A aplicação segue uma arquitetura **cliente-servidor com microsserviços**, estruturada em contêineres Docker:

- **Frontend Angular** comunica-se com o backend via REST.
- **Backend Spring Boot** expõe endpoints protegidos e se comunica com o modelo de IA.
- **Ollama (container separado)** roda o modelo `gemma3:4b` localmente.
- **PostgreSQL** persiste o histórico das conversas.

## 🚀 Como Executar o Projeto

### Pré-requisitos

- Docker e Docker Compose instalados

### Passos

1. Clone este repositório:
   ```bash
   git clone https://github.com/MartiniCode90/chatbot-psicologico.git
   cd chatbot-psicologico

2. Suba os containers:
  docker-compose up --build

3. Acesse o frontend:

  http://localhost:4200

4. Acesse a API backend:

  http://localhost:8080

🧠 Funcionalidades
   Cadastro e login de usuários

   Geração de respostas com IA local

   Armazenamento de mensagens no banco de dados

   Histórico de conversas por usuário

   Autenticação e proteção via JWT

⚠️ Aviso
  Este chatbot não substitui atendimento psicológico profissional. Ele é apenas uma ferramenta de acolhimento inicial para suporte emocional leve.

📄 Licença
  Este projeto é de uso acadêmico e não deve ser utilizado comercialmente sem autorização prévia.
