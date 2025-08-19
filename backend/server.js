const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares de segurança
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:8080', 'http://localhost:3000'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // máximo 100 requests por IP
  message: {
    error: 'Muitas tentativas. Tente novamente em 15 minutos.'
  }
});
app.use('/api/', limiter);

// Middleware para parsing JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Middleware de logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} ${req.method} ${req.path} - IP: ${req.ip}`);
  next();
});

// Rotas de saúde
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// Teste de conectividade com PushinPay
app.get('/api/pushinpay/test', async (req, res) => {
  try {
    const PushinPayService = require('./services/pushinpayService');
    const pushinpay = new PushinPayService();
    const result = await pushinpay.testConnection();
    
    res.json({
      success: true,
      pushinpay_connection: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao testar PushinPay',
      details: error.message
    });
  }
});

// Rotas PIX
app.use('/api/pix', require('./routes/pix'));

// Rotas Webhook
app.use('/api/pushinpay', require('./routes/webhook'));

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('❌ Erro não tratado:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });
  
  res.status(500).json({
    success: false,
    error: 'Erro interno do servidor',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Rota 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint não encontrado',
    path: req.originalUrl
  });
});

// Inicializar banco de dados e servidor
async function startServer() {
  try {
    console.log('🚀 Iniciando servidor API PIX...');
    console.log(`📍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    
    // Inicializar banco de dados
    const { initDatabase } = require('./database/init');
    await initDatabase();
    console.log('✅ Banco de dados inicializado');
    
    // Testar configurações essenciais
    if (!process.env.PUSHINPAY_API_KEY) {
      console.warn('⚠️ PUSHINPAY_API_KEY não configurada - algumas funcionalidades podem não funcionar');
    }
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
      console.log(`💰 API PIX: http://localhost:${PORT}/api/pix`);
      console.log(`📋 Planos: http://localhost:${PORT}/api/pix/plans`);
      console.log(`🔗 Webhook: http://localhost:${PORT}/api/pushinpay/webhook`);
      console.log(`🧪 Teste PushinPay: http://localhost:${PORT}/api/pushinpay/test`);
      console.log('✅ Servidor pronto para receber requisições!');
    });
    
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Recebido SIGINT. Encerrando servidor...');
  await gracefulShutdown();
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Recebido SIGTERM. Encerrando servidor...');
  await gracefulShutdown();
});

async function gracefulShutdown() {
  try {
    const { closeDatabase } = require('./database/init');
    await closeDatabase();
    console.log('✅ Banco de dados fechado');
  } catch (error) {
    console.error('❌ Erro ao fechar banco:', error);
  }
  
  console.log('👋 Servidor encerrado com sucesso');
  process.exit(0);
}

// Capturar erros não tratados
process.on('uncaughtException', (error) => {
  console.error('❌ Erro não capturado:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promise rejeitada não tratada:', reason);
  process.exit(1);
});

startServer();

module.exports = app;