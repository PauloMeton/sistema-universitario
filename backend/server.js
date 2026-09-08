const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { conectarMongo } = require('./config/mongo');

const authRoutes = require('./routes/auth.routes');
const matriculaRoutes = require('./routes/matricula.routes');
const frequenciaRoutes = require('./routes/frequencia.routes');
const documentosRoutes = require('./routes/documentos.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/matriculas', matriculaRoutes);
app.use('/api/frequencias', frequenciaRoutes);
app.use('/api/documentos', documentosRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORTA = process.env.PORT || 3000;

conectarMongo()
  .then(() => {
    app.listen(PORTA, () => {
      console.log(`Servidor rodando em http://localhost:${PORTA}`);
    });
  })
  .catch((erro) => {
    console.error('Falha ao conectar no MongoDB:', erro.message);
    process.exit(1);
  });
