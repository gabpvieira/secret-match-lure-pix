# Deploy Guide - Secret Match Lure

## 🚀 Deploy para Produção

### Pré-requisitos
1. Conta no [Vercel](https://vercel.com)
2. Conta no [GitHub](https://github.com)
3. Chaves da API PushinPay configuradas

### Configuração de Variáveis de Ambiente

#### Frontend (.env.local - desenvolvimento)
```
VITE_API_URL=http://localhost:3001
VITE_API_BASE_URL=http://localhost:3001/api
```

#### Frontend (.env.production - produção)
```
VITE_API_URL=https://secret-match-lure.vercel.app
VITE_API_BASE_URL=https://secret-match-lure.vercel.app/api
```

#### Backend (.env - produção)
```
NODE_ENV=production
PUSHINPAY_ENVIRONMENT=production
PUSHINPAY_API_KEY=your_production_api_key
PUSHINPAY_CLIENT_ID=your_production_client_id
WEBHOOK_BASE_URL=https://secret-match-lure.vercel.app
CORS_ORIGIN=https://secret-match-lure.vercel.app
PORT=3001
```

### Deploy com Vercel

1. **Instalar Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login no Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

4. **Configurar variáveis de ambiente no Vercel Dashboard**:
   Acesse: Settings > Environment Variables no dashboard do Vercel
   
   **Frontend**:
   - VITE_API_URL: `https://secret-match-lure.vercel.app`
   
   **Backend**:
   - NODE_ENV: `production`
   - PUSHINPAY_ENVIRONMENT: `production`
   - PUSHINPAY_API_KEY: `sua_chave_pushinpay_producao`
   - PUSHINPAY_CLIENT_ID: `seu_client_id_pushinpay`
   - WEBHOOK_BASE_URL: `https://secret-match-lure.vercel.app`
   - CORS_ORIGIN: `https://secret-match-lure.vercel.app`
   - PORT: `3001`

### Testes Locais

#### Backend:
```bash
cd backend
npm start
```

#### Frontend:
```bash
npm run dev
```

### URLs de Teste

- **Frontend**: http://localhost:8082
- **Backend**: http://localhost:3001
- **API PIX**: http://localhost:3001/api/pix/create
- **Planos**: http://localhost:3001/api/pix/plans

### Troubleshooting

1. **Erro de CORS**: Verificar se CORS_ORIGIN está configurado corretamente
2. **Erro de conexão**: Verificar se as variáveis de ambiente estão corretas
3. **Erro de build**: Executar `npm run build` localmente antes do deploy

### Estrutura do Projeto

```
secret-match-lure/
├── backend/
│   ├── server.js
│   ├── data/
│   └── .env
├── src/
│   ├── components/
│   └── hooks/
├── .env.local
├── .env.production
├── vercel.json
└── package.json
```