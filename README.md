# Sistema Universitário

Projeto simples de portal acadêmico com cadastro, login, matrícula, frequência e envio de documentos.

## Arquitetura

- **Front-end:** HTML5, CSS e JavaScript puro, responsivo (mobile-first).
- **Back-end:** Node.js + Express, autenticação com JWT.
- **PostgreSQL:** armazena os dados brutos (usuários, matrículas, frequências, documentos).
- **MongoDB:** armazena visões já tratadas para leitura rápida (resumo de frequência, dashboard do aluno).

## 1. Bancos de dados gratuitos

**PostgreSQL:**
1. Crie um projeto grátis em https://supabase.com (ou https://neon.tech).
2. Copie a "Connection string" do banco.
3. Rode o script `backend/sql/schema.sql` no editor SQL do painel para criar as tabelas.

**MongoDB:**
1. Crie um cluster gratuito M0 em https://www.mongodb.com/cloud/atlas.
2. Copie a connection string (`mongodb+srv://...`).

## 2. Configurar o back-end

```bash
cd backend
npm install
cp .env.example .env
```

Edite o `.env` com:
- `DATABASE_URL` (PostgreSQL)
- `MONGO_URI` (MongoDB Atlas)
- `JWT_SECRET` (qualquer string secreta)

Rodar o servidor:

```bash
npm run dev
```

A API sobe em `http://localhost:3000/api`.

## 3. Rodar o front-end

O front-end é estático. Abra `frontend/index.html` no navegador, ou sirva a pasta com uma extensão tipo "Live Server" do VS Code. Se o back-end estiver em outra URL/porta, ajuste `API_BASE_URL` em `frontend/js/api.js`.

## 4. Fluxo de uso

1. Cadastre um usuário em `cadastro.html` (escolha o tipo: aluno ou professor).
2. Para ter um usuário **admin**, cadastre-se normalmente e depois rode no Postgres:
   `UPDATE usuarios SET tipo = 'admin' WHERE email = 'seu@email.com';`
3. Faça login em `index.html`.
4. Como admin, acesse **Cursos e disciplinas** no menu para cadastrar cursos e disciplinas (com professor responsável, se quiser).
5. Como aluno, use `matricula.html` para se matricular numa disciplina pelo ID mostrado na tela de admin.
6. Como professor (ou admin), acesse **Lançar frequência** no menu: escolha a disciplina e a data, marque quem esteve presente e salve — isso dispara a sincronização automática para o MongoDB.
7. O aluno consulta o percentual de frequência já calculado em `frequencia.html`.
8. Envie documentos em `documentos.html`.

## Próximos passos sugeridos

- Tela para o admin aprovar/rejeitar documentos.
- Matrícula por nome da disciplina (com busca), em vez de digitar o ID.
- Paginação nas listagens.
- Testes automatizados.
