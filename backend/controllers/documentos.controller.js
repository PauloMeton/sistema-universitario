const pool = require('../config/db');
const { sincronizarDashboardAluno } = require('../services/sync.service');

async function enviarDocumento(req, res) {
  try {
    const alunoId = req.usuario.id;
    const { tipo } = req.body;

    if (!req.file) {
      return res.status(400).json({ erro: 'Nenhum arquivo enviado' });
    }

    const resultado = await pool.query(
      `INSERT INTO documentos (aluno_id, tipo, nome_arquivo, caminho_arquivo)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [alunoId, tipo, req.file.originalname, req.file.path]
    );

    await sincronizarDashboardAluno(alunoId);

    res.status(201).json({ documento: resultado.rows[0] });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao enviar documento' });
  }
}

async function listarMeusDocumentos(req, res) {
  try {
    const alunoId = req.usuario.id;
    const resultado = await pool.query(
      'SELECT id, tipo, nome_arquivo, status_validacao, created_at FROM documentos WHERE aluno_id = $1 ORDER BY created_at DESC',
      [alunoId]
    );
    res.json({ documentos: resultado.rows });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao listar documentos' });
  }
}

module.exports = { enviarDocumento, listarMeusDocumentos };
