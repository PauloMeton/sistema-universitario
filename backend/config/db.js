const { Pool } = require('pg');
require('dotenv').config();

// Pool de conexões com o PostgreSQL (Supabase, Neon ou qualquer Postgres gratuito)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

pool.on('connect', () => {
  console.log('Conectado ao PostgreSQL');
});

pool.on('error', (err) => {
  console.error('Erro inesperado no PostgreSQL:', err.message);
});

module.exports = pool;
