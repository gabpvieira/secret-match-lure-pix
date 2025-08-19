#!/usr/bin/env node

/**
 * Script para verificar configuração de variáveis de ambiente no Vercel
 * Execute: node check-env.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Lista de variáveis de ambiente necessárias
const REQUIRED_ENV_VARS = {
  frontend: [
    'VITE_API_URL'
  ],
  backend: [
    'NODE_ENV',
    'PUSHINPAY_API_KEY',
    'PUSHINPAY_CLIENT_ID',
    'PUSHINPAY_BASE_URL',
    'WEBHOOK_BASE_URL',
    'CORS_ORIGIN',
    'DB_PATH',
    'PUSHINPAY_ENVIRONMENT'
  ]
};

// Função para verificar variáveis de ambiente
function checkEnvironmentVariables() {
  console.log('🔍 Verificando variáveis de ambiente...\n');
  
  const results = {
    frontend: {},
    backend: {}
  };
  
  // Verificar variáveis do frontend
  console.log('📱 Frontend (Vercel - Environment Variables):');
  REQUIRED_ENV_VARS.frontend.forEach(varName => {
    const value = process.env[varName];
    results.frontend[varName] = !!value;
    console.log(`  ${varName}: ${value ? '✅' : '❌'} ${value ? `(${value})` : ''}`);
  });
  
  // Verificar variáveis do backend
  console.log('\n⚙️  Backend (Vercel - Environment Variables):');
  REQUIRED_ENV_VARS.backend.forEach(varName => {
    const value = process.env[varName];
    results.backend[varName] = !!value;
    console.log(`  ${varName}: ${value ? '✅' : '❌'} ${value ? `(${value})` : ''}`);
  });
  
  // Verificar arquivos .env locais
  console.log('\n📁 Arquivos .env locais:');
  
  const frontendEnv = path.join(__dirname, '.env');
  const backendEnv = path.join(__dirname, 'backend', '.env');
  const backendEnvExample = path.join(__dirname, 'backend', '.env.example');
  
  console.log(`  Frontend .env: ${fs.existsSync(frontendEnv) ? '✅' : '❌'}`);
  console.log(`  Backend .env: ${fs.existsSync(backendEnv) ? '✅' : '❌'}`);
  console.log(`  Backend .env.example: ${fs.existsSync(backendEnvExample) ? '✅' : '❌'}`);
  
  // Verificar se temos todos os valores necessários
  const missing = {
    frontend: REQUIRED_ENV_VARS.frontend.filter(varName => !process.env[varName]),
    backend: REQUIRED_ENV_VARS.backend.filter(varName => !process.env[varName])
  };
  
  console.log('\n📋 Resumo:');
  if (missing.frontend.length === 0 && missing.backend.length === 0) {
    console.log('✅ Todas as variáveis de ambiente estão configuradas!');
  } else {
    if (missing.frontend.length > 0) {
      console.log(`❌ Frontend: ${missing.frontend.join(', ')}`);
    }
    if (missing.backend.length > 0) {
      console.log(`❌ Backend: ${missing.backend.join(', ')}`);
    }
  }
  
  return { results, missing };
}

// Função para gerar comando de deploy
function generateDeployCommand() {
  console.log('\n🚀 Comandos para configurar no Vercel:');
  console.log('');
  console.log('1. Via CLI:');
  console.log('   vercel --prod');
  console.log('');
  console.log('2. Via Dashboard:');
  console.log('   - Acesse https://vercel.com/dashboard');
  console.log('   - Selecione seu projeto');
  console.log('   - Vá em Settings > Environment Variables');
  console.log('   - Adicione as variáveis listadas acima');
  console.log('');
}

// Função para verificar URLs de produção
function checkProductionUrls() {
  console.log('\n🌐 URLs de produção:');
  console.log('');
  console.log('Frontend: https://secret-match-lure.vercel.app');
  console.log('Backend:  https://secret-match-lure.vercel.app/api');
  console.log('');
  console.log('Endpoints para testar:');
  console.log('  GET  https://secret-match-lure.vercel.app/api/health');
  console.log('  GET  https://secret-match-lure.vercel.app/api/pix/plans');
  console.log('  POST https://secret-match-lure.vercel.app/api/pix/create');
  console.log('');
}

// Executar verificações
const { missing } = checkEnvironmentVariables();
generateDeployCommand();
checkProductionUrls();

if (missing.frontend.length > 0 || missing.backend.length > 0) {
  console.log('⚠️  Configure as variáveis de ambiente antes de fazer deploy!');
  process.exit(1);
}