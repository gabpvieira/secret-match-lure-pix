# Configuração do Vercel para PIX em Produção

## 🚨 Problema: PIX não funciona em produção no Vercel

Este guia resolve o problema onde o sistema de PIX funciona em localhost mas não em produção no Vercel.

## 🔧 Passo a Passo para Configuração

### 1. Variáveis de Ambiente no Vercel

Acesse o dashboard do Vercel e configure as seguintes variáveis:

#### Frontend (Environment Variables)
- `VITE_API_URL`: `https://secret-match-lure.vercel.app`

#### Backend (Environment Variables)
- `NODE_ENV`: `production`
- `PUSHINPAY_ENVIRONMENT`: `production`
- `PUSHINPAY_API_KEY`: Sua chave de API do PushinPay
- `PUSHINPAY_CLIENT_ID`: Seu client ID do PushinPay
- `PUSHINPAY_BASE_URL`: `https://api.pushinpay.com.br`
- `WEBHOOK_BASE_URL`: `https://secret-match-lure.vercel.app`
- `CORS_ORIGIN`: `https://secret-match-lure.vercel.app`
- `DB_PATH`: `./data/pix_transactions.db`
- `RATE_LIMIT_WINDOW_MS`: `900000`
- `RATE_LIMIT_MAX_REQUESTS`: `100`
- `HELMET_ENABLED`: `true`
- `LOG_LEVEL`: `info`

### 2. Como Configurar no Vercel Dashboard

1. **Acesse o Dashboard**
   - Vá para [vercel.com/dashboard](https://vercel.com/dashboard)
   - Selecione seu projeto

2. **Configure as Variáveis**
   - Clique em **Settings** → **Environment Variables**
   - Adicione todas as variáveis listadas acima
   - Certifique-se de adicionar para **Production** e **Preview**

3. **Redeploy**
   - Após configurar, faça um novo deploy
   - Clique em **Redeploy** no dashboard

### 3. Verificação

#### Teste Local das Variáveis
```bash
# Verificar configuração
node check-env.js

# Testar produção (simulação)
npm run test:production
```

#### Teste em Produção
```bash
# URLs para testar
Frontend: https://secret-match-lure.vercel.app
Backend Health: https://secret-match-lure.vercel.app/api/health
API Plans: https://secret-match-lure.vercel.app/api/pix/plans
```

### 4. Comandos de Deploy

#### Via CLI
```bash
# Deploy para produção
npm run deploy:vercel

# Ou direto com vercel
vercel --prod
```

#### Via Dashboard
1. Push para GitHub (main branch)
2. O Vercel faz deploy automaticamente

### 5. Troubleshooting

#### Problemas Comuns

**Erro 500 ao criar PIX**
- Verifique se `PUSHINPAY_API_KEY` está configurado
- Confirme se `PUSHINPAY_ENVIRONMENT` está como `production`

**Erro CORS**
- Verifique se `CORS_ORIGIN` está configurado corretamente
- A URL deve ser exatamente `https://secret-match-lure.vercel.app`

**Erro de Database**
- Verifique se `DB_PATH` está configurado
- O caminho deve ser `./data/pix_transactions.db`

#### Logs do Vercel
1. Acesse o dashboard do Vercel
2. Vá para **Functions** → **Logs**
3. Procure por erros relacionados ao `/api/pix/create`

### 6. Verificação Final

Após configurar, teste:

1. **Health Check**
   ```bash
   curl https://secret-match-lure.vercel.app/api/health
   ```

2. **Teste de PIX**
   ```bash
   curl -X POST https://secret-match-lure.vercel.app/api/pix/create \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","plan_id":"basic_monthly"}'
   ```

3. **Verificar Logs**
   - Acesse o dashboard do Vercel
   - Vá para **Functions** → **Logs**
   - Verifique se não há erros

### 7. Checklist de Configuração

- [ ] `VITE_API_URL` configurado no frontend
- [ ] `PUSHINPAY_API_KEY` configurado no backend
- [ ] `PUSHINPAY_CLIENT_ID` configurado no backend
- [ ] `CORS_ORIGIN` configurado corretamente
- [ ] `WEBHOOK_BASE_URL` configurado
- [ ] Deploy realizado após configuração
- [ ] Teste de PIX funcionando
- [ ] Logs sem erros

### 8. Contato para Suporte

Se ainda tiver problemas:
1. Verifique os logs no Vercel
2. Execute `node check-env.js` para verificar configurações
3. Teste com `npm run test:production`

## 🎯 Sucesso

Após seguir este guia, o sistema de PIX deve funcionar corretamente em produção no Vercel.