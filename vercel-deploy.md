# Guia Rápido de Deploy no Vercel

## Configuração de Variáveis de Ambiente no Vercel

### Passo 1: Configurar Variáveis no Dashboard
1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto
3. Vá para: Settings → Environment Variables
4. Adicione as seguintes variáveis:

#### Frontend (Production)
```
VITE_API_URL=https://secret-match-lure.vercel.app
```

#### Backend (Production)
```
NODE_ENV=production
PUSHINPAY_ENVIRONMENT=production
PUSHINPAY_API_KEY=your_production_api_key_here
PUSHINPAY_CLIENT_ID=your_production_client_id_here
WEBHOOK_BASE_URL=https://secret-match-lure.vercel.app
CORS_ORIGIN=https://secret-match-lure.vercel.app
PORT=3001
```

### Passo 2: Deploy com CLI
```bash
# Instalar Vercel CLI (se ainda não tiver)
npm install -g vercel

# Fazer login
vercel login

# Deploy para produção
vercel --prod
```

### Passo 3: Verificar Deploy
- Frontend: https://secret-match-lure.vercel.app
- API: https://secret-match-lure.vercel.app/api/pix/create
- Health Check: https://secret-match-lure.vercel.app/api/health

### Solução de Problemas

**Erro: Environment Variable "VITE_API_URL" references Secret "vite_api_url"**
- Remova qualquer referência a secrets não existentes
- Use valores diretos nas variáveis de ambiente
- Verifique se todas as variáveis estão configuradas no dashboard

**Testar localmente antes do deploy:**
```bash
# Frontend
npm run build
npm run preview

# Backend
cd backend
npm start
```