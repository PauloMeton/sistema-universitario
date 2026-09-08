-- Execute este script no seu banco PostgreSQL (Supabase, Neon, etc.)

CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  tipo VARCHAR(20) NOT NULL DEFAULT 'aluno', -- aluno, professor, admin
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cursos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  carga_horaria INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS disciplinas (
  id SERIAL PRIMARY KEY,
  curso_id INTEGER REFERENCES cursos(id),
  nome VARCHAR(150) NOT NULL,
  professor_id INTEGER REFERENCES usuarios(id),
  vagas INTEGER NOT NULL DEFAULT 40
);

CREATE TABLE IF NOT EXISTS matriculas (
  id SERIAL PRIMARY KEY,
  aluno_id INTEGER REFERENCES usuarios(id),
  disciplina_id INTEGER REFERENCES disciplinas(id),
  status VARCHAR(20) NOT NULL DEFAULT 'ativa', -- ativa, trancada, concluida
  data_matricula TIMESTAMP DEFAULT NOW(),
  UNIQUE(aluno_id, disciplina_id)
);

CREATE TABLE IF NOT EXISTS frequencias (
  id SERIAL PRIMARY KEY,
  matricula_id INTEGER REFERENCES matriculas(id),
  data_aula DATE NOT NULL,
  presente BOOLEAN NOT NULL DEFAULT FALSE,
  UNIQUE(matricula_id, data_aula)
);

CREATE TABLE IF NOT EXISTS documentos (
  id SERIAL PRIMARY KEY,
  aluno_id INTEGER REFERENCES usuarios(id),
  tipo VARCHAR(80) NOT NULL, -- RG, historico, comprovante_residencia...
  nome_arquivo VARCHAR(255) NOT NULL,
  caminho_arquivo VARCHAR(500) NOT NULL,
  status_validacao VARCHAR(20) NOT NULL DEFAULT 'pendente', -- pendente, aprovado, rejeitado
  created_at TIMESTAMP DEFAULT NOW()
);
