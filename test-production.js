#!/usr/bin/env node

/**
 * Script para testar a conexão com PushinPay em produção
 * Execute: node test-production.js
 */

import https from 'https';

// Configurações de teste
const TEST_CONFIG = {
  production: {
    url: 'https://secret-match-lure.vercel.app',
    endpoints: [
      '/api/health',
      '/api/pix/plans',
      '/api/pushinpay/test'
    ]
  }
};

// Função para testar endpoints
async function testEndpoint(url, endpoint) {
  return new Promise((resolve) => {
    const fullUrl = `${url}${endpoint}`;
    
    https.get(fullUrl, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({
            endpoint,
            status: res.statusCode,
            success: res.statusCode === 200,
            data: json
          });
        } catch (e) {
          resolve({
            endpoint,
            status: res.statusCode,
            success: false,
            error: 'Invalid JSON'
          });
        }
      });
    }).on('error', (error) => {
      resolve({
        endpoint,
        status: 0,
        success: false,
        error: error.message
      });
    });
  });
}

// Função principal de teste
async function runTests() {
  console.log('🧪 Iniciando testes de produção...\n');
  
  const config = TEST_CONFIG.production;
  
  for (const endpoint of config.endpoints) {
    console.log(`Testing: ${config.url}${endpoint}`);
    const result = await testEndpoint(config.url, endpoint);
    
    if (result.success) {
      console.log(`✅ ${result.endpoint} - Status: ${result.status}`);
      if (result.data) {
        console.log(`   Response: ${JSON.stringify(result.data, null, 2)}`);
      }
    } else {
      console.log(`❌ ${result.endpoint} - Status: ${result.status}`);
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
    }
    console.log('');
  }
  
  console.log('🎯 Teste de criação PIX...');
  const pixTest = await testPixCreation();
  console.log(`PIX Creation: ${pixTest.success ? '✅' : '❌'} - ${pixTest.message}`);
}

// Função para testar criação de PIX
async function testPixCreation() {
  return new Promise((resolve) => {
    const data = JSON.stringify({
      email: 'test@example.com',
      plan_id: 'basic_monthly'
    });

    const options = {
      hostname: 'secret-match-lure.vercel.app',
      path: '/api/pix/create',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let response = '';
      res.on('data', chunk => response += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(response);
          resolve({
            success: json.success === true,
            message: json.success ? 'PIX created successfully' : json.error || 'Unknown error'
          });
        } catch (e) {
          resolve({
            success: false,
            message: 'Invalid response format'
          });
        }
      });
    });

    req.on('error', (error) => {
      resolve({
        success: false,
        message: error.message
      });
    });

    req.write(data);
    req.end();
  });
}

// Executar testes
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests, testEndpoint, testPixCreation };