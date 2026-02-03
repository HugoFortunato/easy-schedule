# 🚀 Guia de Deploy - Easy Schedule

Este documento fornece instruções detalhadas para fazer deploy do Easy Schedule em diferentes plataformas.

## 📋 Pré-requisitos para Deploy

1. ✅ Projeto funcionando localmente
2. ✅ Banco Supabase configurado
3. ✅ Todas as migrações aplicadas
4. ✅ Variáveis de ambiente configuradas
5. ✅ Build funcionando (`npm run build`)

## 🌐 Deploy na Vercel (Recomendado)

### Passo 1: Preparar o repositório

```bash
# Certifique-se de que está na branch main
git checkout main
git push origin main
```

### Passo 2: Conectar ao Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Faça login com GitHub
3. Clique em "New Project"
4. Selecione o repositório `easy-schedule`
5. Configure as settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: .next

### Passo 3: Configurar variáveis de ambiente

No painel da Vercel, vá para **Settings > Environment Variables** e adicione:

```
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
NEXTAUTH_SECRET=string_aleatoria_segura_para_producao
NEXTAUTH_URL=https://seu-projeto.vercel.app
```

### Passo 4: Atualizar Supabase

No painel do Supabase:

1. **Authentication > Settings > Site URL**: `https://seu-projeto.vercel.app`
2. **Authentication > Settings > Redirect URLs**: `https://seu-projeto.vercel.app/auth/callback`

### Passo 5: Deploy

1. Clique em "Deploy"
2. Aguarde o build completar
3. Teste o projeto na URL fornecida

## 🛡️ Deploy na Netlify

### Passo 1: Preparar para Netlify

1. Crie o arquivo `netlify.toml` na raiz:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

### Passo 2: Deploy

1. Acesse [netlify.com](https://netlify.com)
2. Conecte com GitHub
3. Selecione o repositório
4. Configure as variáveis de ambiente
5. Deploy automático

## 🚂 Deploy na Railway

### Passo 1: Configurar Railway

```bash
# Instalar CLI (opcional)
npm install -g @railway/cli

# Ou usar o dashboard web
```

### Passo 2: Deploy

1. Acesse [railway.app](https://railway.app)
2. Conecte GitHub
3. Selecione o projeto
4. Configure variáveis de ambiente
5. Deploy automático

## ☁️ Deploy na AWS Amplify

### Passo 1: Configurar build

Crie `amplify.yml`:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - "**/*"
  cache:
    paths:
      - node_modules/**/*
```

### Passo 2: Deploy na AWS

1. Console AWS > Amplify
2. Conectar repositório
3. Configurar build settings
4. Adicionar variáveis de ambiente
5. Deploy

## 🐳 Deploy com Docker

### Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

### Deploy com Docker

```bash
# Build
docker build -t easy-schedule .

# Run
docker run -p 3000:3000 easy-schedule
```

## 🔧 Configurações Específicas

### Next.js Config para Deploy

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone", // Para Docker
  images: {
    domains: ["your-domain.com"],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

module.exports = nextConfig;
```

### Otimizações para Produção

1. **Bundle Analyzer**:

```bash
npm install --save-dev @next/bundle-analyzer
```

2. **Compressão**:

```javascript
// next.config.js
const nextConfig = {
  compress: true,
  poweredByHeader: false,
};
```

## 🔍 Monitoramento Pós-Deploy

### Verificações essenciais:

- ✅ Login/Registro funcionando
- ✅ Dashboard carregando
- ✅ Criação de agendamentos
- ✅ Links compartilháveis funcionando
- ✅ Responsividade em mobile
- ✅ Performance (Core Web Vitals)

### Ferramentas de monitoramento:

- **Vercel Analytics** (para Vercel)
- **Google Analytics**
- **Sentry** (para erros)
- **LogRocket** (para sessões)

## 🚨 Troubleshooting

### Problemas comuns:

1. **Build falha**:

```bash
# Limpar cache e reinstalar
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

2. **Supabase não conecta**:

- Verificar URLs nas variáveis de ambiente
- Confirmar configurações de CORS
- Validar chaves de API

3. **Autenticação não funciona**:

- Verificar NEXTAUTH_URL
- Confirmar redirect URLs no Supabase
- Validar NEXTAUTH_SECRET

4. **Images não carregam**:

- Configurar domínios no next.config.js
- Verificar caminhos das imagens
- Confirmar otimização de imagens

## 📊 Performance

### Métricas importantes:

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

### Otimizações:

```javascript
// Lazy loading
import dynamic from "next/dynamic";
const Component = dynamic(() => import("./Component"));

// Image optimization
import Image from "next/image";
<Image src="/image.jpg" width={500} height={300} alt="Description" />;
```

## 🔐 Segurança

### Checklist de segurança:

- ✅ HTTPS habilitado
- ✅ Headers de segurança configurados
- ✅ Variáveis de ambiente seguras
- ✅ Validação de inputs
- ✅ Rate limiting implementado
- ✅ CORS configurado corretamente

---

**🎉 Parabéns! Seu projeto está no ar!**

Para suporte adicional, consulte a documentação da plataforma escolhida ou abra uma issue no GitHub.
