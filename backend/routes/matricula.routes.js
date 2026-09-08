const express = require('express');
const router = express.Router();
const { matricular, listarMinhasMatriculas } = require('../controllers/matricula.controller');
const { verificarToken } = require('../middlewares/auth.middleware');

router.post('/', verificarToken, matricular);
router.get('/minhas', verificarToken, listarMinhasMatriculas);

module.exports = router;
