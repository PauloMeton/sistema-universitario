const API_BASE_URL = window.location.hostname === 'localhost' || window.location.protocol === 'file:'
  ? 'http://localhost:3000/api'
  : '/api';

function getToken() {
  return localStorage.getItem('token');
}

async function apiFetch(caminho, opcoes = {}) {
  const token = getToken();
  const headers = { ...(opcoes.headers || {}) };

  if (!(opcoes.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const resposta = await fetch(`${API_BASE_URL}${caminho}`, { ...opcoes, headers });
  const dados = await resposta.json().catch(() => ({}));

  if (!resposta.ok) {
    throw new Error(dados.erro || 'Erro na requisição');
  }
  return dados;
}

const api = {
  cadastrar: (dados) => apiFetch('/auth/cadastro', { method: 'POST', body: JSON.stringify(dados) }),
  login: (dados) => apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(dados) }),
  minhasMatriculas: () => apiFetch('/matriculas/minhas'),
  matricular: (disciplina_id) => apiFetch('/matriculas', { method: 'POST', body: JSON.stringify({ disciplina_id }) }),
  resumoFrequencia: () => apiFetch('/frequencias/resumo'),
  meusDocumentos: () => apiFetch('/documentos'),
  enviarDocumento: (formData) => apiFetch('/documentos', { method: 'POST', body: formData }),
  listarCursos: () => apiFetch('/admin/cursos'),
  criarCurso: (dados) => apiFetch('/admin/cursos', { method: 'POST', body: JSON.stringify(dados) }),
  listarDisciplinas: () => apiFetch('/admin/disciplinas'),
  criarDisciplina: (dados) => apiFetch('/admin/disciplinas', { method: 'POST', body: JSON.stringify(dados) }),
  listarProfessores: () => apiFetch('/admin/professores'),
  listarTurma: (disciplinaId) => apiFetch(`/frequencias/turma/${disciplinaId}`),
  registrarPresenca: (dados) => apiFetch('/frequencias', { method: 'POST', body: JSON.stringify(dados) }),
};
