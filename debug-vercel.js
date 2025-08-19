// Script para debugar o erro 500 no Vercel usando fetch
async function debugVercel() {
  console.log('Iniciando debug do Vercel...');
  
  const testData = {
    email: 'test@example.com',
    plan_id: 'basic_monthly'
  };

  try {
    console.log('Testando endpoint de criação PIX...');
    const response = await fetch('https://secret-match.vercel.app/api/pix/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });
    
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Resposta:', data);
  } catch (error) {
    console.error('Erro completo:', error);
  }
}

async function testHealth() {
  try {
    console.log('Testando health check...');
    const response = await fetch('https://secret-match.vercel.app/api/health');
    const data = await response.json();
    console.log('Health status:', response.status);
    console.log('Health data:', data);
  } catch (error) {
    console.error('Health erro:', error);
  }
}

async function testPlans() {
  try {
    console.log('Testando endpoint de planos...');
    const response = await fetch('https://secret-match.vercel.app/api/pix/plans');
    const data = await response.json();
    console.log('Plans status:', response.status);
    console.log('Plans data:', data);
  } catch (error) {
    console.error('Plans erro:', error);
  }
}

// Executar testes sequencialmente
async function runAllTests() {
  await testHealth();
  await testPlans();
  await debugVercel();
}

runAllTests();