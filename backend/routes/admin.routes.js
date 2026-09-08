const express = require('express');
const router = express.Router();
const {
  criarCurso, listarCursos, criarDisciplina, listarDisciplinas, listarProfessores
} = require('../controllers/admin.controller');
const { verificarToken, permitir } = require('../middlewares/auth.middleware');

// Leitura liberada para qualquer usuário logado (precisa listar disciplinas p/ matricular)
router.get('/cursos', verificarToken, listarCursos);
router.get('/disciplinas', verificarToken, listarDisciplinas);
router.get('/professores', verificarToken, permitir('admin'), listarProfessores);

// Escrita só para admin
router.post('/cursos', verificarToken, permitir('admin'), criarCurso);
router.post('/disciplinas', verificarToken, permitir('admin'), criarDisciplina);

module.exports = router;
