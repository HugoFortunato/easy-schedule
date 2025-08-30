# 📅 Easy Schedule

Uma plataforma moderna e intuitiva para gerenciamento de agendamentos profissionais, desenvolvida com Next.js, TypeScript e Supabase.

![Easy Schedule](./public/easyschedule.png)

## ✨ Características

- 🔐 **Autenticação segura** com Supabase Auth
- 📱 **Design responsivo** e minimalista
- 🔗 **Links de agendamento compartilháveis**
- 📊 **Dashboard intuitivo** para gerenciar agendamentos
- 🎨 **Interface moderna** com Tailwind CSS
- 🚀 **Performance otimizada** com Next.js 14
- 🛡️ **TypeScript** para maior segurança de tipos

## 🛠️ Tecnologias Utilizadas

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI Components
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Validação**: Zod
- **Icons**: Lucide React
- **Formatação**: Date-fns

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)
- Uma conta no [Supabase](https://supabase.com/)

## 🚀 Instalação e Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/easy-schedule.git
cd easy-schedule
```

### 2. Instale as dependências

```bash
npm install
# ou
yarn install
```

### 3. Configuração do Supabase

#### 3.1. Criar projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma nova conta ou faça login
3. Clique em "New Project"
4. Escolha sua organização e configure:
   - **Nome do projeto**: easy-schedule
   - **Senha do banco**: (crie uma senha segura)
   - **Região**: escolha a mais próxima da sua localização

#### 3.2. Configurar as tabelas do banco

No painel do Supabase, vá para **SQL Editor** e execute os seguintes comandos:

```sql
-- Criar tabela de profissionais
CREATE TABLE professionals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de agendamentos
CREATE TABLE appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE,
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255),
  date DATE NOT NULL,
  time TIME NOT NULL,
  status VARCHAR(50) DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de configurações de horários
CREATE TABLE schedule_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL, -- 0 = domingo, 1 = segunda, etc.
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar políticas RLS (Row Level Security)
ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_settings ENABLE ROW LEVEL SECURITY;

-- Política para profissionais (usuários só veem seus próprios dados)
CREATE POLICY "Users can view own profile" ON professionals
  FOR SELECT USING (auth.uid()::text = email);

CREATE POLICY "Users can update own profile" ON professionals
  FOR UPDATE USING (auth.uid()::text = email);

CREATE POLICY "Users can insert own profile" ON professionals
  FOR INSERT WITH CHECK (auth.uid()::text = email);

-- Política para agendamentos
CREATE POLICY "Professionals can view own appointments" ON appointments
  FOR SELECT USING (
    professional_id IN (
      SELECT id FROM professionals WHERE email = auth.uid()::text
    )
  );

CREATE POLICY "Anyone can create appointments" ON appointments
  FOR INSERT WITH CHECK (true);

-- Política para configurações de horário
CREATE POLICY "Professionals can manage own schedule" ON schedule_settings
  FOR ALL USING (
    professional_id IN (
      SELECT id FROM professionals WHERE email = auth.uid()::text
    )
  );
```

#### 3.3. Configurar autenticação

1. No painel do Supabase, vá para **Authentication > Settings**
2. Em **Site URL**, adicione: `http://localhost:3000`
3. Em **Redirect URLs**, adicione: `http://localhost:3000/auth/callback`

### 4. Configurar variáveis de ambiente

1. Copie o arquivo de exemplo:

```bash
cp .env.example .env.local
```

2. No painel do Supabase, vá para **Settings > API**
3. Copie as chaves e configure o arquivo `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase

# Next.js
NEXTAUTH_SECRET=seu_secret_aleatorio_aqui
NEXTAUTH_URL=http://localhost:3000
```

### 5. Adicionar logos do projeto

Coloque os seguintes arquivos na pasta `public/`:

- `easyschedule.png` - Logo principal
- `easyschedule-white.jpg` - Logo para fundo escuro

### 6. Executar o projeto

```bash
npm run dev
# ou
yarn dev
```

O projeto estará disponível em [http://localhost:3000](http://localhost:3000)

## 📁 Estrutura do Projeto

```
easy-schedule/
├── src/
│   ├── app/                  # App Router (Next.js 14)
│   │   ├── (auth)/          # Rotas de autenticação
│   │   │   ├── signin/      # Página de login
│   │   │   └── signup/      # Página de registro
│   │   ├── (private)/       # Rotas protegidas
│   │   │   ├── dashboard/   # Dashboard principal
│   │   │   └── appointments/ # Página de agendamentos
│   │   ├── (schedule)/      # Rotas públicas de agendamento
│   │   ├── logout/          # Ações de logout
│   │   └── layout.tsx       # Layout global
│   ├── components/          # Componentes reutilizáveis
│   │   ├── ui/             # Componentes base (Radix UI)
│   │   ├── header.tsx      # Cabeçalho da aplicação
│   │   ├── signin-form.tsx # Formulário de login
│   │   └── ...
│   ├── lib/                # Utilitários e configurações
│   ├── types/              # Tipos TypeScript
│   └── utils/              # Funções utilitárias
│       └── supabase/       # Configuração do Supabase
├── public/                 # Arquivos públicos
├── package.json
└── README.md
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar servidor de produção
npm run start

# Linting
npm run lint

# Verificação de tipos
npm run type-check
```

## 🌟 Funcionalidades

### Para Profissionais

- ✅ Registro e login seguro
- ✅ Dashboard com visão geral dos agendamentos
- ✅ Geração de link compartilhável para agendamentos
- ✅ Visualização e gerenciamento de agendamentos
- ✅ Configuração de horários disponíveis

### Para Clientes

- ✅ Agendamento através de link compartilhado
- ✅ Interface intuitiva para seleção de horários
- ✅ Confirmação automática por email

## 🚢 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório GitHub ao Vercel
2. Configure as variáveis de ambiente no painel da Vercel
3. Atualize a **Site URL** no Supabase para sua URL de produção
4. Deploy automático a cada push na branch main

### Outras plataformas

O projeto pode ser deployado em qualquer plataforma que suporte Next.js:

- Netlify
- Railway
- Heroku
- AWS Amplify

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

Se você encontrar algum problema ou tiver dúvidas:

1. Verifique se seguiu todos os passos de instalação
2. Confira se as variáveis de ambiente estão corretas
3. Verifique se o Supabase está configurado corretamente
4. Abra uma [issue](https://github.com/seu-usuario/easy-schedule/issues) no GitHub

## 📞 Contato

- **Desenvolvedor**: Seu Nome
- **Email**: seu.email@example.com
- **LinkedIn**: [Seu LinkedIn](https://linkedin.com/in/seu-perfil)

---

⭐ **Se este projeto foi útil para você, deixe uma estrela no GitHub!**
