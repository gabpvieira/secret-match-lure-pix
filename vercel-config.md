# Configuração Completa para Deploy no Vercel

## ✅ Variáveis de Ambiente Necessárias

### 1. Frontend (Vercel Dashboard)
```
VITE_API_URL=https://secret-match-lure.vercel.app
```

### 2. Backend (Vercel Dashboard)
```
NODE_ENV=production
PUSHINPAY_ENVIRONMENT=production
PUSHINPAY_API_KEY=your_production_api_key_here
PUSHINPAY_TOKEN=your_production_token_here
WEBHOOK_BASE_URL=https://secret-match-lure.vercel.app
CORS_ORIGIN=https://secret-match-lure.vercel.app
DB_PATH=./database/pix_transactions.db
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
HELMET_ENABLED=true
LOG_LEVEL=info
```

## 🔧 Passo a Passo para Configurar

### Passo 1: Dashboard do Vercel
1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto: `secret-match-lure`
3. Vá para: Settings → Environment Variables
4. Adicione TODAS as variáveis acima

### Passo 2: Verificar Configuração
- **Frontend**: A variável `VITE_API_URL` deve apontar para o domínio do Vercel
- **Backend**: Certifique-se de que `PUSHINPAY_API_KEY` e `PUSHINPAY_TOKEN` são válidas

### Passo 3: Testar Endpoints
```bash
# Testar API de PIX
curl -X POST https://secret-match-lure.vercel.app/api/pix/create \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","plan_id":"basic_monthly"}'

# Testar Health Check
curl https://secret-match-lure.vercel.app/api/health
```

### Passo 4: Verificar Logs
1. No dashboard do Vercel
2. Vá para: Functions → Logs
3. Verifique erros relacionados ao PushinPay

## ⚠️ Problemas Comuns e Soluções

### 1. "Cannot find module" no Vercel
- Verifique se `package.json` tem todas as dependências
- Execute: `npm install` antes do deploy

### 2. CORS Error
- Certifique-se que `CORS_ORIGIN` está configurado corretamente
- Teste com o domínio exato do Vercel

### 3. PushinPay API Error
- Verifique se as chaves da API são válidas
- Teste com o ambiente `sandbox` primeiro

### 4. Database Error
- O SQLite funciona no Vercel mas é limitado
- Considere migrar para PostgreSQL para produção

## 🚀 Comandos de Deploy

```bash
# Deploy manual com CLI
npm install -g vercel
vercel --prod

# Ou deploy automático via GitHub push
git push origin main
```

## ✅ Checklist Final

- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] PushinPay API key válida
- [ ] Domínio correto nas variáveis
- [ ] Testes de API realizados
- [ ] Logs verificados
- [ ] Frontend apontando para API correta