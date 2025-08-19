const { getDatabase } = require('../database/init');

class PixTransaction {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.plan_id = data.plan_id;
    this.plan_name = data.plan_name;
    this.value = data.value;
    this.status = data.status || 'created';
    this.qr_code = data.qr_code;
    this.qr_code_base64 = data.qr_code_base64;
    this.webhook_url = data.webhook_url;
    this.environment = data.environment || 'production';
    this.end_to_end_id = data.end_to_end_id;
    this.payer_name = data.payer_name;
    this.payer_national_registration = data.payer_national_registration;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.raw_response = data.raw_response;
  }

  static async create(transactionData) {
    const db = getDatabase();
    
    const sql = `
      INSERT INTO pix_transactions (
        id, email, plan_id, plan_name, value, status, qr_code, qr_code_base64,
        webhook_url, environment, end_to_end_id, payer_name, payer_national_registration,
        raw_response
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      transactionData.id,
      transactionData.email,
      transactionData.plan_id,
      transactionData.plan_name,
      transactionData.value,
      transactionData.status || 'created',
      transactionData.qr_code,
      transactionData.qr_code_base64,
      transactionData.webhook_url,
      transactionData.environment || 'production',
      transactionData.end_to_end_id,
      transactionData.payer_name,
      transactionData.payer_national_registration,
      JSON.stringify(transactionData.raw_response)
    ];
    
    return new Promise((resolve, reject) => {
      db.run(sql, params, function(err) {
        if (err) {
          console.error('❌ Erro ao criar transação:', err.message);
          reject(err);
          return;
        }
        
        console.log(`✅ Transação criada com ID: ${transactionData.id}`);
        resolve(new PixTransaction(transactionData));
      });
    });
  }

  static async findById(id) {
    const db = getDatabase();
    
    const sql = 'SELECT * FROM pix_transactions WHERE id = ?';
    
    return new Promise((resolve, reject) => {
      db.get(sql, [id], (err, row) => {
        if (err) {
          console.error('❌ Erro ao buscar transação:', err.message);
          reject(err);
          return;
        }
        
        if (!row) {
          resolve(null);
          return;
        }
        
        // Parse do raw_response se existir
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
  }

  static async findByEmail(email, limit = 10) {
    const db = getDatabase();
    
    const sql = `
      SELECT * FROM pix_transactions 
      WHERE email = ? 
      ORDER BY created_at DESC 
      LIMIT ?
    `;
    
    return new Promise((resolve, reject) => {
      db.all(sql, [email, limit], (err, rows) => {
        if (err) {
          console.error('❌ Erro ao buscar transações por email:', err.message);
          reject(err);
          return;
        }
        
        const transactions = rows.map(row => {
          if (row.raw_response) {
            try {
              row.raw_response = JSON.parse(row.raw_response);
            } catch (e) {
              console.warn('⚠️ Erro ao fazer parse do raw_response:', e.message);
            }
          }
          return new PixTransaction(row);
        });
        
        resolve(transactions);
      });
    });
  }

  async updateStatus(newStatus, additionalData = {}) {
    const db = getDatabase();
    
    const updateFields = ['status = ?', 'updated_at = CURRENT_TIMESTAMP'];
    const params = [newStatus];
    
    // Adicionar campos opcionais se fornecidos
    if (additionalData.end_to_end_id) {
      updateFields.push('end_to_end_id = ?');
      params.push(additionalData.end_to_end_id);
    }
    
    if (additionalData.payer_name) {
      updateFields.push('payer_name = ?');
      params.push(additionalData.payer_name);
    }
    
    if (additionalData.payer_national_registration) {
      updateFields.push('payer_national_registration = ?');
      params.push(additionalData.payer_national_registration);
    }
    
    if (additionalData.raw_response) {
      updateFields.push('raw_response = ?');
      params.push(JSON.stringify(additionalData.raw_response));
    }
    
    params.push(this.id); // WHERE id = ?
    
    const sql = `UPDATE pix_transactions SET ${updateFields.join(', ')} WHERE id = ?`;
    
    return new Promise((resolve, reject) => {
      db.run(sql, params, function(err) {
        if (err) {
          console.error('❌ Erro ao atualizar transação:', err.message);
          reject(err);
          return;
        }
        
        if (this.changes === 0) {
          reject(new Error('Transação não encontrada para atualização'));
          return;
        }
        
        console.log(`✅ Status da transação ${this.id} atualizado para: ${newStatus}`);
        resolve(this.changes);
      });
    });
  }

  static async getStats() {
    const db = getDatabase();
    
    const sql = `
      SELECT 
        status,
        COUNT(*) as count,
        SUM(value) as total_value
      FROM pix_transactions 
      GROUP BY status
    `;
    
    return new Promise((resolve, reject) => {
      db.all(sql, [], (err, rows) => {
        if (err) {
          console.error('❌ Erro ao buscar estatísticas:', err.message);
          reject(err);
          return;
        }
        
        resolve(rows);
      });
    });
  }
}

module.exports = PixTransaction;