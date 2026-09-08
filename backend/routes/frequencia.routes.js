const express = require('express');
const router = express.Router();
const { registrarPresenca, consultarResumoAluno, listarTurma } = require('../controllers/frequencia.controller');
const { verificarToken, permitir } = require('../middlewares/auth.middleware');

router.post('/', verificarToken, permitir('professor', 'admin'), registrarPresenca);
router.get('/resumo', verificarToken, consultarResumoAluno);
router.get('/turma/:disciplina_id', verificarToken, permitir('professor', 'admin'), listarTurma);

module.exports = router;
