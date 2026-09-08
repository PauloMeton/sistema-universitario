const express = require('express');
const multer = require('multer');
const router = express.Router();
const { enviarDocumento, listarMeusDocumentos } = require('../controllers/documentos.controller');
const { verificarToken } = require('../middlewares/auth.middleware');

const upload = multer({ dest: 'uploads/' });

router.post('/', verificarToken, upload.single('arquivo'), enviarDocumento);
router.get('/', verificarToken, listarMeusDocumentos);

module.exports = router;
