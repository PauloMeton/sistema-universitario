const pool = require('../config/db');
const { conectarMongo } = require('../config/mongo');
const { sincronizarFrequencia } = require('../services/sync.service');

// Professor/admin registra presença em uma aula
async function registrarPresenca(req, res) {
  try {
    const { matricula_id, data_aula, presente } = req.body;

    const resultado = await pool.query(
      `INSERT INTO frequencias (matricula_id, data_aula, presente)
       VALUES ($1, $2, $3)
       ON CONFLICT (matricula_id, data_aula)
       DO UPDATE SET presente = EXCLUDED.presente
       RETURNING *`,
      [matricula_id, data_aula, presente]
    );

    await sincronizarFrequencia(matricula_id);

    res.status(201).json({ frequencia: resultado.rows[0] });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao registrar frequência' });
  }
}

// Aluno consulta seu resumo de frequência (lê direto do MongoDB, já tratado)
async function consultarResumoAluno(req, res) {
  try {
    const alunoId = req.usuario.id;
    const mongo = await conectarMongo();
    const resumo = await mongo
      .collection('frequencia_resumo')
      .find({ aluno_id: alunoId })
      .toArray();

    res.json({ resumo });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao consultar frequência' });
  }
}

// Professor consulta a lista de alunos matriculados numa disciplina, para lançar presença
async function listarTurma(req, res) {
  try {
    const { disciplina_id } = req.params;
    const resultado = await pool.query(
      `SELECT m.id AS matricula_id, u.nome AS aluno_nome
       FROM matriculas m
       JOIN usuarios u ON u.id = m.aluno_id
       WHERE m.disciplina_id = $1 AND m.status = 'ativa'
       ORDER BY u.nome`,
      [disciplina_id]
    );
    res.json({ alunos: resultado.rows });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao listar turma' });
  }
}

module.exports = { registrarPresenca, consultarResumoAluno, listarTurma };
