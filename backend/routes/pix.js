const express = require('express');
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');
const PixTransaction = require('../models/PixTransaction');
const PushinPayService = require('../services/pushinpayService');
const plans = require('../config/plans.json');

const router = express.Router();
const pushinpay = new PushinPayService();

// Schema de validação para criação de PIX
const createPixSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email deve ter um formato válido',
    'any.required': 'Email é obrigatório'
  }),
  plan_id: Joi.string().valid('basic_monthly', 'pro_monthly', 'lifetime').required().messages({
    'any.only': 'Plan ID deve ser: basic_monthly, pro_monthly ou lifetime',
    'any.required': 'Plan ID é obrigatório'
  })
});

/**
 * POST /api/pix/create
 * Cria uma nova cobrança PIX
 */
router.post('/create', async (req, res) => {
  try {
    // Validar dados de entrada
    const { error, value } = createPixSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Dados inválidos',
        details: error.details.map(d => d.message)
      });
    }
    
    const { email, plan_id } = value;
    
    // Buscar plano selecionado
    const selectedPlan = plans.plans.find(p => p.id === plan_id);
    if (!selectedPlan) {
      return res.status(400).json({
        success: false,
        error: 'Plano não encontrado'
      });
    }
    
    console.log(`📋 Criando PIX para plano: ${selectedPlan.name} - R$ ${selectedPlan.amount / 100}`);
    
    // Gerar ID único para a transação
    const transactionId = uuidv4();
    
    // Preparar dados para PushinPay
    const pixData = {
      email: email,
      value: selectedPlan.amount, // Valor em centavos
      description: `${selectedPlan.name} - ${selectedPlan.description}`,
      webhook_url: `${process.env.WEBHOOK_BASE_URL || 'https://your-domain.com'}/api/pushinpay/webhook`
    };
    
    // Criar cobrança na PushinPay
    const pushinpayResult = await pushinpay.createPixCharge(pixData);
    
    if (!pushinpayResult.success) {
      console.error('❌ Falha ao criar cobrança PIX:', pushinpayResult.error);
      return res.status(500).json({
        success: false,
        error: 'Erro ao processar pagamento',
        details: pushinpayResult.error.message
      });
    }
    
    // Salvar transação no banco
    const transactionData = {
      id: transactionId,
      email: email,
      plan_id: plan_id,
      plan_name: selectedPlan.name,
      value: selectedPlan.amount,
      status: 'created',
      qr_code: pushinpayResult.data.qr_code,
      qr_code_base64: pushinpayResult.data.qr_code_base64,
      webhook_url: pixData.webhook_url,
      environment: process.env.NODE_ENV || 'production',
      raw_response: pushinpayResult.data.raw_response
    };
    
    const transaction = await PixTransaction.create(transactionData);
    
    console.log(`✅ Transação PIX criada: ${transactionId}`);
    
    // Resposta para o frontend
    res.status(201).json({
      success: true,
      data: {
        transaction_id: transactionId,
        plan: {
          id: selectedPlan.id,
          name: selectedPlan.name,
          amount: selectedPlan.amount,
          description: selectedPlan.description
        },
        pix: {
          qr_code: pushinpayResult.data.qr_code,
          qr_code_base64: pushinpayResult.data.qr_code_base64,
          expires_at: pushinpayResult.data.expires_at
        },
        status: 'created',
        created_at: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('❌ Erro interno ao criar PIX:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      details: error.message
    });
  }
});

/**
 * GET /api/pix/status/:id
 * Consulta o status de uma transação PIX
 */
router.get('/status/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'ID da transação é obrigatório'
      });
    }
    
    console.log(`🔍 Consultando status da transação: ${id}`);
    
    // Buscar transação no banco
    const transaction = await PixTransaction.findById(id);
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transação não encontrada'
      });
    }
    
    // Se a transação já está paga, retornar status local
    if (transaction.status === 'paid') {
      return res.json({
        success: true,
        data: {
          transaction_id: transaction.id,
          status: transaction.status,
          plan: {
            id: transaction.plan_id,
            name: transaction.plan_name,
            amount: transaction.value
          },
          payment_info: {
            payer_name: transaction.payer_name,
            end_to_end_id: transaction.end_to_end_id
          },
          updated_at: transaction.updated_at
        }
      });
    }
    
    // Consultar status atualizado na PushinPay
    if (transaction.raw_response && transaction.raw_response.id) {
      const statusResult = await pushinpay.getPixChargeStatus(transaction.raw_response.id);
      
      if (statusResult.success) {
        const newStatus = statusResult.data.status;
        
        // Atualizar status no banco se mudou
        if (newStatus !== transaction.status) {
          await transaction.updateStatus(newStatus, {
            end_to_end_id: statusResult.data.end_to_end_id,
            payer_name: statusResult.data.payer?.name,
            payer_national_registration: statusResult.data.payer?.national_registration,
            raw_response: statusResult.data.raw_response
          });
          
          transaction.status = newStatus;
          transaction.end_to_end_id = statusResult.data.end_to_end_id;
          transaction.payer_name = statusResult.data.payer?.name;
        }
      }
    }
    
    res.json({
      success: true,
      data: {
        transaction_id: transaction.id,
        status: transaction.status,
        plan: {
          id: transaction.plan_id,
          name: transaction.plan_name,
          amount: transaction.value
        },
        pix: {
          qr_code: transaction.qr_code,
          qr_code_base64: transaction.qr_code_base64
        },
        payment_info: {
          payer_name: transaction.payer_name,
          end_to_end_id: transaction.end_to_end_id
        },
        created_at: transaction.created_at,
        updated_at: transaction.updated_at
      }
    });
    
  } catch (error) {
    console.error('❌ Erro ao consultar status:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      details: error.message
    });
  }
});

/**
 * GET /api/pix/plans
 * Lista todos os planos disponíveis
 */
router.get('/plans', (req, res) => {
  try {
    console.log('📋 Listando planos disponíveis');
    
    res.json({
      success: true,
      data: plans.plans.map(plan => ({
        id: plan.id,
        name: plan.name,
        amount: plan.amount,
        amount_formatted: `R$ ${(plan.amount / 100).toFixed(2).replace('.', ',')}`,
        description: plan.description,
        features: plan.features
      }))
    });
    
  } catch (error) {
    console.error('❌ Erro ao listar planos:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

/**
 * GET /api/pix/transactions/:email
 * Lista transações de um email específico
 */
router.get('/transactions/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const limit = parseInt(req.query.limit) || 10;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email é obrigatório'
      });
    }
    
    console.log(`📋 Listando transações para: ${email}`);
    
    const transactions = await PixTransaction.findByEmail(email, limit);
    
    res.json({
      success: true,
      data: transactions.map(t => ({
        transaction_id: t.id,
        plan: {
          id: t.plan_id,
          name: t.plan_name,
          amount: t.value
        },
        status: t.status,
        created_at: t.created_at,
        updated_at: t.updated_at
      }))
    });
    
  } catch (error) {
    console.error('❌ Erro ao listar transações:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

module.exports = router;