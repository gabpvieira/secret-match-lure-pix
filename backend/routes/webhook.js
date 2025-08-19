const express = require('express');
const PixTransaction = require('../models/PixTransaction');
const PushinPayService = require('../services/pushinpayService');

const router = express.Router();
const pushinpay = new PushinPayService();

/**
 * POST /api/pushinpay/webhook
 * Recebe notificações de pagamento da PushinPay
 */
router.post('/webhook', async (req, res) => {
  try {
    const webhookData = req.body;
    const signature = req.headers['x-pushinpay-signature'] || req.headers['authorization'];
    
    console.log('📨 Webhook recebido:', {
      event: webhookData.event_type,
      chargeId: webhookData.data?.id,
      timestamp: new Date().toISOString()
    });
    
    // Validar assinatura do webhook
    if (!pushinpay.validateWebhook(webhookData, signature)) {
      console.error('❌ Webhook com assinatura inválida');
      return res.status(401).json({
        success: false,
        error: 'Assinatura inválida'
      });
    }
    
    // Processar dados do webhook
    const processedData = pushinpay.processWebhook(webhookData);
    
    if (!processedData.charge_id) {
      console.error('❌ Webhook sem charge_id');
      return res.status(400).json({
        success: false,
        error: 'Dados do webhook inválidos'
      });
    }
    
    // Buscar transação correspondente no banco
    // Nota: Precisamos buscar pela referência da PushinPay, não pelo nosso ID
    const transaction = await findTransactionByPushinPayId(processedData.charge_id);
    
    if (!transaction) {
      console.warn(`⚠️ Transação não encontrada para charge_id: ${processedData.charge_id}`);
      // Ainda assim retornamos 200 para evitar reenvios
      return res.status(200).json({
        success: true,
        message: 'Webhook processado (transação não encontrada)'
      });
    }
    
    console.log(`🔄 Atualizando transação ${transaction.id}: ${transaction.status} → ${processedData.status}`);
    
    // Atualizar status da transação
    await transaction.updateStatus(processedData.status, {
      end_to_end_id: processedData.end_to_end_id,
      payer_name: processedData.payer?.name,
      payer_national_registration: processedData.payer?.national_registration,
      raw_response: processedData.raw_data
    });
    
    // Log específico para pagamentos confirmados
    if (processedData.status === 'paid') {
      console.log(`💰 PAGAMENTO CONFIRMADO! Transação: ${transaction.id}, Plano: ${transaction.plan_name}, Email: ${transaction.email}`);
      
      // Aqui você pode adicionar lógica adicional para pagamentos confirmados:
      // - Enviar email de confirmação
      // - Ativar acesso do usuário
      // - Integrar com sistema de usuários
      // - Etc.
      
      await handlePaymentConfirmed(transaction, processedData);
    }
    
    // Log para outros status importantes
    if (processedData.status === 'expired') {
      console.log(`⏰ PIX expirado: ${transaction.id}`);
    }
    
    if (processedData.status === 'cancelled') {
      console.log(`❌ PIX cancelado: ${transaction.id}`);
    }
    
    res.status(200).json({
      success: true,
      message: 'Webhook processado com sucesso',
      transaction_id: transaction.id,
      new_status: processedData.status
    });
    
  } catch (error) {
    console.error('❌ Erro ao processar webhook:', error);
    
    // Retornar 500 para que a PushinPay reenvie o webhook
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      details: error.message
    });
  }
});

/**
 * GET /api/pushinpay/webhook/test
 * Endpoint para testar o webhook (desenvolvimento)
 */
router.get('/webhook/test', (req, res) => {
  console.log('🧪 Teste de webhook solicitado');
  
  res.json({
    success: true,
    message: 'Webhook endpoint está funcionando',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

/**
 * POST /api/pushinpay/webhook/simulate
 * Simula um webhook para testes (apenas desenvolvimento)
 */
router.post('/webhook/simulate', async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({
      success: false,
      error: 'Simulação não permitida em produção'
    });
  }
  
  try {
    const { transaction_id, status = 'paid' } = req.body;
    
    if (!transaction_id) {
      return res.status(400).json({
        success: false,
        error: 'transaction_id é obrigatório'
      });
    }
    
    console.log(`🧪 Simulando webhook: ${transaction_id} → ${status}`);
    
    const transaction = await PixTransaction.findById(transaction_id);
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transação não encontrada'
      });
    }
    
    // Simular dados do webhook
    const simulatedWebhookData = {
      event_type: `charge.${status}`,
      data: {
        id: 'simulated_charge_id',
        status: status,
        amount: transaction.value,
        paid_at: status === 'paid' ? new Date().toISOString() : null,
        payer: status === 'paid' ? {
          name: 'Usuário Teste',
          national_registration: '12345678901'
        } : null,
        end_to_end_id: status === 'paid' ? `E${Date.now()}` : null
      }
    };
    
    const processedData = pushinpay.processWebhook(simulatedWebhookData);
    
    await transaction.updateStatus(processedData.status, {
      end_to_end_id: processedData.end_to_end_id,
      payer_name: processedData.payer?.name,
      payer_national_registration: processedData.payer?.national_registration,
      raw_response: simulatedWebhookData
    });
    
    if (status === 'paid') {
      await handlePaymentConfirmed(transaction, processedData);
    }
    
    res.json({
      success: true,
      message: 'Webhook simulado com sucesso',
      transaction_id: transaction_id,
      new_status: status
    });
    
  } catch (error) {
    console.error('❌ Erro ao simular webhook:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

/**
 * Busca transação pelo ID da PushinPay
 * @param {string} pushinpayChargeId - ID da cobrança na PushinPay
 * @returns {Promise<PixTransaction|null>} Transação encontrada
 */
async function findTransactionByPushinPayId(pushinpayChargeId) {
  // Como salvamos o raw_response, podemos buscar por ele
  // Esta é uma implementação simplificada - em produção, considere indexar este campo
  
  try {
    const { getDatabase } = require('../database/init');
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT * FROM pix_transactions 
        WHERE raw_response LIKE ? 
        ORDER BY created_at DESC 
        LIMIT 1
      `;
      
      db.get(sql, [`%"id":"${pushinpayChargeId}"%`], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        
        if (!row) {
          resolve(null);
          return;
        }
        
        // Parse do raw_response
        if (row.raw_response) {
          try {
            row.raw_response = JSON.parse(row.raw_response);
          } catch (e) {
            console.warn('⚠️ Erro ao fazer parse do raw_response:', e.message);
          }
        }
        
        resolve(new PixTransaction(row));
      });
    });
    
  } catch (error) {
    console.error('❌ Erro ao buscar transação por PushinPay ID:', error);
    return null;
  }
}

/**
 * Processa ações específicas quando um pagamento é confirmado
 * @param {PixTransaction} transaction - Transação paga
 * @param {Object} paymentData - Dados do pagamento
 */
async function handlePaymentConfirmed(transaction, paymentData) {
  try {
    console.log(`🎉 Processando pagamento confirmado para ${transaction.email}`);
    
    // Aqui você pode implementar:
    
    // 1. Envio de email de confirmação
    // await sendConfirmationEmail(transaction.email, transaction.plan_name);
    
    // 2. Ativação do acesso do usuário
    // await activateUserAccess(transaction.email, transaction.plan_id);
    
    // 3. Integração com sistema de usuários
    // await updateUserSubscription(transaction.email, transaction.plan_id);
    
    // 4. Log para analytics
    console.log(`📊 Analytics: Venda confirmada - Plano: ${transaction.plan_name}, Valor: R$ ${transaction.value / 100}`);
    
    // 5. Webhook para outros sistemas
    // await notifyExternalSystems(transaction);
    
  } catch (error) {
    console.error('❌ Erro ao processar pagamento confirmado:', error);
    // Não relançar o erro para não afetar o processamento do webhook
  }
}

module.exports = router;