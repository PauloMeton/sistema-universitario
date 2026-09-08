const pool = require('../config/db');
const { conectarMongo } = require('../config/mongo');

// Recalcula o resumo de frequência de uma matrícula no Postgres
// e grava o resultado já tratado no MongoDB para leitura rápida.
async function sincronizarFrequencia(matriculaId) {
  const resultado = await pool.query(
    `SELECT m.id AS matricula_id, m.aluno_id, m.disciplina_id, d.nome AS disciplina_nome,
            COUNT(f.id) AS total_aulas,
            COUNT(f.id) FILTER (WHERE f.presente) AS presencas
     FROM matriculas m
     JOIN disciplinas d ON d.id = m.disciplina_id
     LEFT JOIN frequencias f ON f.matricula_id = m.id
     WHERE m.id = $1
     GROUP BY m.id, m.aluno_id, m.disciplina_id, d.nome`,
    [matriculaId]
  );

  const linha = resultado.rows[0];
  if (!linha) return;

  const total = Number(linha.total_aulas);
  const presencas = Number(linha.presencas);
  const percentual = total > 0 ? Number(((presencas / total) * 100).toFixed(1)) : 0;

  const mongo = await conectarMongo();
  await mongo.collection('frequencia_resumo').updateOne(
    { matricula_id: linha.matricula_id },
    {
      $set: {
        matricula_id: linha.matricula_id,
        aluno_id: linha.aluno_id,
        disciplina_id: linha.disciplina_id,
        disciplina_nome: linha.disciplina_nome,
        total_aulas: total,
        presencas,
        percentual,
        atualizado_em: new Date()
      }
    },
    { upsert: true }
  );
}

// Recalcula o dashboard consolidado de um aluno (matrículas ativas + documentos pendentes)
async function sincronizarDashboardAluno(alunoId) {
  const matriculas = await pool.query(
    `SELECT m.id, m.status, d.nome AS disciplina_nome
     FROM matriculas m
     JOIN disciplinas d ON d.id = m.disciplina_id
     WHERE m.aluno_id = $1`,
    [alunoId]
  );

  const documentos = await pool.query(
    `SELECT tipo, status_validacao FROM documentos WHERE aluno_id = $1`,
    [alunoId]
  );

  const mongo = await conectarMongo();
  await mongo.collection('dashboard_aluno').updateOne(
    { aluno_id: alunoId },
    {
      $set: {
        aluno_id: alunoId,
        matriculas: matriculas.rows,
        documentos: documentos.rows,
        atualizado_em: new Date()
      }
    },
    { upsert: true }
  );
}

module.exports = { sincronizarFrequencia, sincronizarDashboardAluno };
