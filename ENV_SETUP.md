# 🔧 Configuração de Variáveis de Ambiente

Este arquivo contém instruções detalhadas para configurar as variáveis de ambiente necessárias para o Easy Schedule.

## 📁 Criando o arquivo .env.local

1. **Copie o arquivo de exemplo:**

```bash
cp .env.example .env.local
```

2. **Se não existir, crie manualmente:**

```bash
touch .env.local
```

## 🔑 Variáveis Necessárias

### Supabase (Obrigatório)

#### NEXT_PUBLIC_SUPABASE_URL

- **Onde encontrar**: Painel Supabase > Settings > API > Project URL
- **Formato**: `https://xxxxxxxxxxxxxxxxxxxx.supabase.co`
- **Exemplo**: `NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co`

#### NEXT_PUBLIC_SUPABASE_ANON_KEY

- **Onde encontrar**: Painel Supabase > Settings > API > Project API keys > anon public
- **Formato**: String longa começando com `eyJ`
- **Exemplo**: `NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Next.js (Obrigatório)

#### NEXTAUTH_SECRET

- **Descrição**: String aleatória para criptografia de sessões
- **Como gerar**: Use um gerador online ou comando:

```bash
openssl rand -base64 32
```

- **Exemplo**: `NEXTAUTH_SECRET=abc123def456ghi789jkl012mno345pqr678stu901vwx234yzA567BCD890`

#### NEXTAUTH_URL

- **Desenvolvimento**: `http://localhost:3000`
- **Produção**: URL do seu deploy
- **Exemplo**: `NEXTAUTH_URL=https://meu-app.vercel.app`

## 📝 Arquivo .env.local Completo

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_publica_aqui

# Next.js Authentication
NEXTAUTH_SECRET=sua_string_secreta_aleatoria_aqui
NEXTAUTH_URL=http://localhost:3000

# Opcional - Para desenvolvimento
NODE_ENV=development
```

## ⚠️ Importante

### Segurança

- ✅ **NUNCA** commite arquivos `.env*` no Git
- ✅ Adicione `.env*` no `.gitignore`
- ✅ Use valores diferentes para desenvolvimento e produção
- ✅ Mantenha as chaves seguras e privadas

### Troubleshooting

#### Erro: "Invalid API key"

- Verifique se copiou a chave correta do Supabase
- Confirme que não há espaços extras
- Certifique-se de usar a chave `anon public`, não a `service_role`

#### Erro: "NEXTAUTH_URL não definida"

- Verifique se a variável está no `.env.local`
- Para produção, use a URL completa do deploy
- Reinicie o servidor após alterar variáveis

#### Erro: "Supabase client could not be created"

- Confirme se a URL do Supabase está correta
- Verifique se o projeto Supabase está ativo
- Teste a conexão no painel do Supabase

## 🔍 Verificando Configuração

### Teste rápido no console do navegador:

```javascript
// Deve retornar a URL do Supabase
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL);

// Deve retornar a chave (primeiros caracteres)
console.log(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 10));
```

### Verificação no código:

```typescript
// utils/check-env.ts
export function checkEnvironment() {
  const requiredEnvs = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
  ];

  for (const env of requiredEnvs) {
    if (!process.env[env]) {
      throw new Error(`Variável de ambiente ${env} não encontrada`);
    }
  }

  console.log('✅ Todas as variáveis de ambiente estão configuradas');
}
```

## 🌍 Ambientes Diferentes

### Desenvolvimento (.env.local)

```env
NEXT_PUBLIC_SUPABASE_URL=https://dev-project.supabase.co
NEXTAUTH_URL=http://localhost:3000
NODE_ENV=development
```

### Produção (Vercel/Netlify)

```env
NEXT_PUBLIC_SUPABASE_URL=https://prod-project.supabase.co
NEXTAUTH_URL=https://meuapp.vercel.app
NODE_ENV=production
```

### Teste (.env.test)

```env
NEXT_PUBLIC_SUPABASE_URL=https://test-project.supabase.co
NEXTAUTH_URL=http://localhost:3000
NODE_ENV=test
```

## 📱 Deploy em Plataformas

### Vercel

1. Dashboard > Project > Settings > Environment Variables
2. Adicione cada variável individualmente
3. Selecione ambientes (Development, Preview, Production)

### Netlify

1. Site settings > Build & deploy > Environment variables
2. Adicione key-value pairs
3. Deploy contexts: Production, Deploy previews, Branch deploys

### Railway

1. Project > Variables tab
2. Adicione variáveis uma por uma
3. Restart necessário após mudanças

## 🆘 Suporte

Se ainda tiver problemas:

1. Verifique se seguiu todos os passos
2. Confirme que não há caracteres especiais nas chaves
3. Teste com um projeto Supabase novo
4. Abra uma issue no GitHub com detalhes do erro

---

**💡 Dica**: Mantenha backup das suas chaves em um gerenciador de senhas seguro!
