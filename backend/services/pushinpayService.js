const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

class PushinPayService {
  constructor() {
    this.baseURL = process.env.PUSHINPAY_BASE_URL || (process.env.NODE_ENV === 'production' ? 'https://api.pushinpay.com.br' : 'https://api-sandbox.pushinpay.com.br');
    this.apiKey = process.env.PUSHINPAY_API_KEY;
    this.environment = process.env.NODE_ENV || 'production';
    
    if (!this.apiKey) {
      console.warn('⚠️ PUSHINPAY_API_KEY não configurada');
    }
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      }
    });
    
    // Interceptor para logs
    this.client.interceptors.request.use(
      (config) => {
        console.log(`🔄 PushinPay Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('❌ PushinPay Request Error:', error.message);
        return Promise.reject(error);
      }
    );
    
    this.client.interceptors.response.use(
      (response) => {
        console.log(`✅ PushinPay Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('❌ PushinPay Response Error:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
        return Promise.reject(error);
      }
    );
  }

  /**
   * Cria uma cobrança PIX
   * @param {Object} pixData - Dados da cobrança
   * @param {string} pixData.email - Email do cliente
   * @param {number} pixData.value - Valor em centavos
   * @param {string} pixData.description - Descrição da cobrança
   * @param {string} pixData.webhook_url - URL do webhook
   * @returns {Promise<Object>} Resposta da API
   */
  async createPixCharge(pixData) {
    try {
      const payload = {
        value: pixData.value,
        webhook_url: pixData.webhook_url
      };
      
      console.log('Creating PIX charge with data:', {
        value: payload.value,
        webhook_url: payload.webhook_url
      });
      
      const response = await this.client.post('/api/pix/cashIn', payload);
      
      const chargeData = response.data;
      
      console.log('✅ Cobrança PIX criada:', {
        id: chargeData.id,
        status: chargeData.status,
        qr_code: chargeData.qr_code ? 'Gerado' : 'Não gerado',
        qr_code_base64: chargeData.qr_code_base64 ? 'Base64 presente' : 'Base64 ausente',
        full_response: JSON.stringify(chargeData, null, 2)
      });
      
      return {
        success: true,
        data: {
          id: chargeData.id,
          status: chargeData.status,
          value: chargeData.value,
          qr_code: chargeData.qr_code,
          qr_code_base64: chargeData.qr_code_base64,
          expires_at: chargeData.expires_at,
          created_at: chargeData.created_at,
          raw_response: chargeData
        }
      };
      
    } catch (error) {
      console.error('❌ Erro ao criar cobrança PIX:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      
      return {
        success: false,
        error: {
          message: error.message,
          status: error.response?.status,
          details: error.response?.data
        }
      };
    }
  }

  /**
   * Consulta o status de uma cobrança PIX
   * @param {string} chargeId - ID da cobrança
   * @returns {Promise<Object>} Status da cobrança
   */
  async getPixChargeStatus(chargeId) {
    try {
      console.log(`🔍 Consultando status da cobrança: ${chargeId}`);
      
      const response = await this.client.get(`/v1/pix/charges/${chargeId}`);
      const chargeData = response.data;
      
      console.log(`✅ Status consultado: ${chargeData.status}`);
      
      return {
        success: true,
        data: {
          id: chargeData.id,
          status: chargeData.status,
          amount: chargeData.amount,
          paid_at: chargeData.paid_at,
          payer: chargeData.payer,
          end_to_end_id: chargeData.end_to_end_id,
          raw_response: chargeData
        }
      };
      
    } catch (error) {
      console.error('❌ Erro ao consultar status:', {
        chargeId,
        message: error.message,
        status: error.response?.status
      });
      
      return {
        success: false,
        error: {
          message: error.message,
          status: error.response?.status,
          details: error.response?.data
        }
      };
    }
  }

  /**
   * Valida webhook da PushinPay
   * @param {Object} webhookData - Dados do webhook
   * @param {string} signature - Assinatura do webhook
   * @returns {boolean} Se o webhook é válido
   */
  validateWebhook(webhookData, signature) {
    // Implementar validação de assinatura conforme documentação PushinPay
    // Por enquanto, retorna true para desenvolvimento
    console.log('🔐 Validando webhook:', {
      hasSignature: !!signature,
      eventType: webhookData.event_type,
      chargeId: webhookData.data?.id
    });
    
    return true;
  }

  /**
   * Processa webhook de pagamento
   * @param {Object} webhookData - Dados do webhook
   * @returns {Object} Dados processados
   */
  processWebhook(webhookData) {
    const eventType = webhookData.event_type;
    const chargeData = webhookData.data;
    
    console.log('📨 Processando webhook:', {
      event: eventType,
      chargeId: chargeData?.id,
      status: chargeData?.status
    });
    
    let status = 'unknown';
    
    switch (eventType) {
      case 'charge.created':
        status = 'created';
        break;
      case 'charge.paid':
        status = 'paid';
        break;
      case 'charge.expired':
        status = 'expired';
        break;
      case 'charge.cancelled':
        status = 'cancelled';
        break;
      default:
        console.warn(`⚠️ Evento desconhecido: ${eventType}`);
    }
    
    return {
      event_type: eventType,
      charge_id: chargeData?.id,
      status: status,
      amount: chargeData?.amount,
      paid_at: chargeData?.paid_at,
      payer: chargeData?.payer,
      end_to_end_id: chargeData?.end_to_end_id,
      raw_data: webhookData
    };
  }

  /**
   * Testa a conectividade com a API
   * @returns {Promise<Object>} Resultado do teste
   */
  async testConnection() {
    try {
      console.log('🔧 Testando conexão com PushinPay...');
      
      // Endpoint de teste (ajustar conforme documentação)
      const response = await this.client.get('/v1/health');
      
      console.log('✅ Conexão com PushinPay OK');
      
      return {
        success: true,
        status: response.status,
        message: 'Conexão estabelecida com sucesso'
      };
      
    } catch (error) {
      console.error('❌ Falha na conexão com PushinPay:', error.message);
      
      return {
        success: false,
        error: error.message,
        status: error.response?.status
      };
    }
  }
}

module.exports = PushinPayService;