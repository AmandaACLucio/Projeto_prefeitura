# Prefeitura Digital - Sistema de Acompanhamento Infantil

Este projeto é uma plataforma para gestão de prontuários infantis, focada em áreas de Saúde, Educação e Assistência Social. O sistema permite o monitoramento de vulnerabilidades, frequências escolares e status de vacinação.

## 🚀 Como rodar o projeto localmente

O projeto está totalmente containerizado com Docker, garantindo que o ambiente de desenvolvimento seja idêntico ao de produção.

### Pré-requisitos
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado.
- [Node.js](https://nodejs.org/) (opcional, para rodar scripts locais).

### Rodando

#### Docker

1. **Clone o repositório:**
   ```bash
   git clone <url-do-repositorio>
   ```

2. . **Suba os Containers:**
   ```bash
   docker compose up -d --build
   ```
   *Este comando irá subir o Banco de Dados (PostgreSQL), o Backend (Node.js/Prisma) e o Frontend (Next.js). Além disso, cria as migrations e popula com o seed.json*

3. . **Acesse o Sistema:**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:3001`
   - Prisma Studio: `http://localhost:5555`

---

## 🏛️ Decisões Arquiteturais e Trade-offs

### 1. Next.js 14+ (App Router)
**Decisão:** Utilizar o Next.js com App Router para o frontend.
**Trade-off:** Embora a curva de aprendizado do App Router seja maior que a do Pages Router, ganhamos em performance com Server Components, reduzindo o bundle JS enviado ao cliente e facilitando o SEO (importante para portais públicos).

### 2. Dockerização Completa
**Decisão:** Rodar tudo em containers, incluindo o banco de dados.
**Trade-off:** O consumo de RAM é maior durante o desenvolvimento, mas elimina o problema do "na minha máquina funciona".

### 3. Prisma ORM com PostgreSQL
**Decisão:** Uso do Prisma pela sua tipagem forte e facilidade em lidar com relações complexas (como os objetos aninhados de Saúde e Educação).
**Trade-off:** O Prisma pode ser ligeiramente mais lento que queries SQL puras em operações massivas, mas para um sistema de gestão (CRUD pesado), a produtividade e a segurança de tipos (Typescript) compensam.

### 4. Middleware de Autenticação
**Decisão:** Centralizar a proteção de rotas no `middleware.ts` do Next.js.
**Trade-off:** Tivemos que ajustar finamente o `matcher` para não bloquear arquivos estáticos e chunks de otimização (`_next/image`), o que gerou erros de carregamento inicialmente, mas garante que nenhuma página sensível seja acessada sem token.

---

## ⏳ O que faria diferente com mais tempo

1. **Testes Automatizados:** Implementaria uma suíte de testes E2E com **Cypress** ou **Playwright**, especialmente para o fluxo crítico de edição de prontuários (onde o fuso horário pode ser um vilão).

2. **Arquitetura de Micro-serviços:** Se o sistema escalasse para toda a prefeitura, separaria os módulos de Saúde, Educação e Social em serviços independentes para que pudessem escalar individualmente.

4. **Design mais responivo:** Implementaria responsividade nas telas, que devido ao curto prazo, não foi uma prioridade

5. **Acessibilidade (WCAG):** Realizaria uma auditoria completa de acessibilidade para garantir que o sistema seja utilizável por todos os cidadãos e servidores públicos, seguindo os padrões governamentais.


