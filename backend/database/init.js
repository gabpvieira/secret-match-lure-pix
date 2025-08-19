const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'pix_transactions.db');

let db;

function initDatabase() {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('❌ Erro ao conectar com o banco:', err.message);
        reject(err);
        return;
      }
      
      console.log('✅ Conectado ao banco SQLite');
      
      // Criar tabela pix_transactions
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS pix_transactions (
          id TEXT PRIMARY KEY,
          email TEXT NOT NULL,
          plan_id TEXT NOT NULL,
          plan_name TEXT NOT NULL,
          value INTEGER NOT NULL,
          status TEXT NOT NULL DEFAULT 'created',
          qr_code TEXT,
          qr_code_base64 TEXT,
          webhook_url TEXT,
          environment TEXT NOT NULL DEFAULT 'production',
          end_to_end_id TEXT,
          payer_name TEXT,
          payer_national_registration TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          raw_response TEXT
        )
      `;
      
      db.run(createTableSQL, (err) => {
        if (err) {
          console.error('❌ Erro ao criar tabela:', err.message);
          reject(err);
          return;
        }
        
        console.log('✅ Tabela pix_transactions criada/verificada');
        
        // Criar índices para melhor performance
        const createIndexes = [
          'CREATE INDEX IF NOT EXISTS idx_email ON pix_transactions(email)',
          'CREATE INDEX IF NOT EXISTS idx_status ON pix_transactions(status)',
          'CREATE INDEX IF NOT EXISTS idx_created_at ON pix_transactions(created_at)',
          'CREATE INDEX IF NOT EXISTS idx_plan_id ON pix_transactions(plan_id)'
        ];
        
        let indexCount = 0;
        createIndexes.forEach(indexSQL => {
          db.run(indexSQL, (err) => {
            if (err) {
              console.error('⚠️ Erro ao criar índice:', err.message);
            }
            indexCount++;
            if (indexCount === createIndexes.length) {
              console.log('✅ Índices criados/verificados');
              resolve(db);
            }
          });
        });
      });
    });
  });
}

function getDatabase() {
  if (!db) {
    throw new Error('Banco de dados não inicializado. Chame initDatabase() primeiro.');
  }
  return db;
}

function closeDatabase() {
  return new Promise((resolve, reject) => {
    if (db) {
      db.close((err) => {
        if (err) {
          reject(err);
        } else {
          console.log('✅ Conexão com banco fechada');
          resolve();
        }
      });
    } else {
      resolve();
    }
  });
}

module.exports = {
  initDatabase,
  getDatabase,
  closeDatabase
};