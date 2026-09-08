const { MongoClient } = require('mongodb');
require('dotenv').config();

let db = null;
const client = new MongoClient(process.env.MONGO_URI);

async function conectarMongo() {
  if (db) return db;
  await client.connect();
  db = client.db(process.env.MONGO_DB_NAME || 'sistema_universitario');
  console.log('Conectado ao MongoDB');
  return db;
}

module.exports = { conectarMongo };
