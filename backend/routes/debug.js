const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Endpoint para debug de variáveis de ambiente
router.get('/env', (req, res) => {
  res.json({
    success: true,
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      DB_FILE_PATH: process.env.DB_FILE_PATH,
      DATA_DIR: process.env.DATA_DIR,
      PORT: process.env.PORT,
      PUSHINPAY_ENVIRONMENT: process.env.PUSHINPAY_ENVIRONMENT,
      CORS_ORIGIN: process.env.CORS_ORIGIN
    },
    computed: {
      dbPath: process.env.DB_FILE_PATH || path.join(__dirname, '../database/pix_transactions.db'),
      dbDir: path.dirname(process.env.DB_FILE_PATH || path.join(__dirname, '../database/pix_transactions.db'))
    },
    system: {
      cwd: process.cwd(),
      __dirname: __dirname,
      platform: process.platform
    }
  });
});

// Endpoint para verificar permissões do diretório
router.get('/permissions', (req, res) => {
  const dbPath = process.env.DB_FILE_PATH || path.join(__dirname, '../database/pix_transactions.db');
  const dbDir = path.dirname(dbPath);
  
  const result = {
    success: true,
    paths: {
      dbPath,
      dbDir
    },
    checks: {}
  };
  
  try {
    result.checks.dbDirExists = fs.existsSync(dbDir);
    result.checks.dbDirWritable = fs.accessSync(dbDir, fs.constants.W_OK) === undefined;
    result.checks.dbExists = fs.existsSync(dbPath);
    
    if (fs.existsSync(dbPath)) {
      result.checks.dbWritable = fs.accessSync(dbPath, fs.constants.W_OK) === undefined;
    }
  } catch (err) {
    result.checks.error = err.message;
  }
  
  res.json(result);
});

module.exports = router;