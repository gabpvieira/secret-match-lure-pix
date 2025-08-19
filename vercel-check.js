const axios = require('axios');

const VERCEL_URL = 'https://secret-match-lure.vercel.app';

async function checkVercelStatus() {
  console.log('🔍 Verificando status do Vercel...\n');
  
  try {
    // Verificar health check
    console.log('1. Health Check...');
    const health = await axios.get(`${VERCEL_URL}/api/health`);
    console.log('✅ Health OK:', health.data);
    
    // Verificar variáveis de ambiente
    console.log('\n2. Variáveis de Ambiente...');
    const env = await axios.get(`${VERCEL_URL}/api/debug/env`);
    console.log('✅ Variáveis carregadas:', env.data.environment);
    
    // Verificar permissões
    console.log('\n3. Permissões do Sistema...');
    const permissions = await axios.get(`${VERCEL_URL}/api/debug/permissions`);
    console.log('✅ Permissões:', permissions.data);
    
    // Testar criação de PIX
    console.log('\n4. Testando criação de PIX...');
    const pixTest = await axios.post(`${VERCEL_URL}/api/pix/create`, {
      email: 'test@example.com',
      planId: 'basic_monthly'
    });
    console.log('✅ PIX criado:', pixTest.data);
    
  } catch (error) {
    console.error('❌ Erro:', error.response?.data || error.message);
  }
}

checkVercelStatus();