const pool = require('../config/db');

async function criarCurso(req, res) {
  try {
    const { nome, carga_horaria } = req.body;
    if (!nome || !carga_horaria) {
      return res.status(400).json({ erro: 'Nome e carga horária são obrigatórios' });
    }
    const resultado = await pool.query(
      'INSERT INTO cursos (nome, carga_horaria) VALUES ($1, $2) RETURNING *',
      [nome, carga_horaria]
    );
    res.status(201).json({ curso: resultado.rows[0] });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao criar curso' });
  }
}

async function listarCursos(req, res) {
  try {
    const resultado = await pool.query('SELECT * FROM cursos ORDER BY nome');
    res.json({ cursos: resultado.rows });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao listar cursos' });
  }
}

async function criarDisciplina(req, res) {
  try {
    const { nome, curso_id, professor_id, vagas } = req.body;
    if (!nome || !curso_id) {
      return res.status(400).json({ erro: 'Nome e curso são obrigatórios' });
    }
    const resultado = await pool.query(
      `INSERT INTO disciplinas (nome, curso_id, professor_id, vagas)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [nome, curso_id, professor_id || null, vagas || 40]
    );
    res.status(201).json({ disciplina: resultado.rows[0] });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao criar disciplina' });
  }
}

async function listarDisciplinas(req, res) {
  try {
    const resultado = await pool.query(
      `SELECT d.*, c.nome AS curso_nome, u.nome AS professor_nome
       FROM disciplinas d
       JOIN cursos c ON c.id = d.curso_id
       LEFT JOIN usuarios u ON u.id = d.professor_id
       ORDER BY d.nome`
    );
    res.json({ disciplinas: resultado.rows });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao listar disciplinas' });
  }
}

async function listarProfessores(req, res) {
  try {
    const resultado = await pool.query(
      "SELECT id, nome FROM usuarios WHERE tipo = 'professor' ORDER BY nome"
    );
    res.json({ professores: resultado.rows });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao listar professores' });
  }
}

module.exports = { criarCurso, listarCursos, criarDisciplina, listarDisciplinas, listarProfessores };
