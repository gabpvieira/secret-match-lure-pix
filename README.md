# Funil FakeTinder

Aplicação de funil de conversão simulando um app de relacionamentos, desenvolvida com React, TypeScript e Vite.

## 🚀 Funcionalidades

- **Onboarding Interativo**: Processo de cadastro com upload de foto via ImgBB
- **Sistema de Swipe**: Interface similar ao Tinder para curtir perfis
- **Análise de Matches**: Página de resultados com animações e foto do usuário
- **Funil de Conversão**: Fluxo completo direcionando para checkout premium
- **Design Responsivo**: Interface moderna e adaptável

## 🛠️ Tecnologias

- **React 18** com TypeScript
- **Vite** para build e desenvolvimento
- **Tailwind CSS** para estilização
- **Radix UI** para componentes acessíveis
- **React Router** para navegação
- **ImgBB API** para upload de imagens

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/gabpvieira/Funil-FakeTinder.git

# Entre no diretório
cd Funil-FakeTinder

# Instale as dependências
npm install

# Execute em modo de desenvolvimento
npm run dev
```

## 🌐 Deploy

O projeto está configurado para deploy no Vercel:

```bash
# Build para produção
npm run build

# Preview do build
npm run preview
```

## 📱 Fluxo da Aplicação

1. **Página Inicial**: Apresentação e call-to-action
2. **Onboarding**: Cadastro com upload de foto
3. **Curtir Perfis**: Sistema de swipe com perfis fictícios
4. **Análise de Matches**: Resultados com foto do usuário
5. **Checkout**: Oferta premium ou continuação gratuita

## 🔧 Configuração

Para usar o upload de imagens, configure a API key do ImgBB no componente `ProfileOnboarding.tsx`.

## 📄 Licença

Este projeto é para fins educacionais e demonstração de funil de conversão.
