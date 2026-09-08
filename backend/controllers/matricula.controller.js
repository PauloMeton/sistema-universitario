const pool = require('../config/db');
const { sincronizarDashboardAluno } = require('../services/sync.service');

async function matricular(req, res) {
  try {
    const alunoId = req.usuario.id;
    const { disciplina_id } = req.body;

    const disciplina = await pool.query('SELECT * FROM disciplinas WHERE id = $1', [disciplina_id]);
    if (disciplina.rows.length === 0) {
      return res.status(404).json({ erro: 'Disciplina não encontrada' });
    }

    const jaMatriculado = await pool.query(
      'SELECT id FROM matriculas WHERE aluno_id = $1 AND disciplina_id = $2',
      [alunoId, disciplina_id]
    );
    if (jaMatriculado.rows.length > 0) {
      return res.status(409).json({ erro: 'Aluno já matriculado nesta disciplina' });
    }

    const resultado = await pool.query(
      `INSERT INTO matriculas (aluno_id, disciplina_id) VALUES ($1, $2) RETURNING *`,
      [alunoId, disciplina_id]
    );

    await sincronizarDashboardAluno(alunoId);

    res.status(201).json({ matricula: resultado.rows[0] });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao matricular aluno' });
  }
}

async function listarMinhasMatriculas(req, res) {
  try {
    const alunoId = req.usuario.id;
    const resultado = await pool.query(
      `SELECT m.id, m.status, m.data_matricula, d.nome AS disciplina_nome
       FROM matriculas m
       JOIN disciplinas d ON d.id = m.disciplina_id
       WHERE m.aluno_id = $1
       ORDER BY m.data_matricula DESC`,
      [alunoId]
    );
    res.json({ matriculas: resultado.rows });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao listar matrículas' });
  }
}

module.exports = { matricular, listarMinhasMatriculas };
