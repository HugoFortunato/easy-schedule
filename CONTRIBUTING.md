# 🤝 Guia de Contribuição - Easy Schedule

Obrigado por considerar contribuir com o Easy Schedule! Este documento fornece diretrizes para contribuir com o projeto.

## 📋 Antes de Começar

1. Certifique-se de ter lido o [README.md](README.md)
2. Verifique se existe uma [issue](https://github.com/seu-usuario/easy-schedule/issues) relacionada ao que você quer implementar
3. Se não existir, crie uma issue descrevendo a feature ou bug

## 🛠️ Configuração do Ambiente de Desenvolvimento

1. Fork o repositório
2. Clone seu fork:

```bash
git clone https://github.com/SEU-USUARIO/easy-schedule.git
```

3. Siga as instruções do README para configurar o ambiente

## 📝 Padrões de Código

### Estrutura de Commits

Use conventional commits:

```
tipo(escopo): descrição

feat(auth): adicionar autenticação com Google
fix(dashboard): corrigir bug na listagem de agendamentos
docs(readme): atualizar instruções de instalação
style(ui): melhorar responsividade do header
```

### Tipos de Commit

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Mudanças na documentação
- `style`: Mudanças de formatação/estilo
- `refactor`: Refatoração de código
- `test`: Adição ou correção de testes
- `chore`: Mudanças em ferramentas/configurações

### Padrões de Código

- Use TypeScript para todos os arquivos
- Siga as configurações do ESLint
- Use Prettier para formatação
- Nomes de componentes em PascalCase
- Nomes de arquivos em kebab-case
- Use comentários JSDoc quando necessário

## 🔄 Fluxo de Trabalho

1. **Crie uma branch** a partir da `main`:

```bash
git checkout -b feature/nome-da-feature
```

2. **Faça suas alterações** seguindo os padrões estabelecidos

3. **Teste localmente**:

```bash
npm run dev
npm run lint
npm run type-check
```

4. **Commit suas mudanças**:

```bash
git add .
git commit -m "feat(escopo): descrição da mudança"
```

5. **Push para seu fork**:

```bash
git push origin feature/nome-da-feature
```

6. **Abra um Pull Request** com:
   - Título claro e descritivo
   - Descrição detalhada das mudanças
   - Screenshots (se aplicável)
   - Link para a issue relacionada

## 🧪 Testes

- Sempre teste suas mudanças localmente
- Verifique se não há erros de TypeScript
- Teste em diferentes tamanhos de tela
- Verifique se a funcionalidade funciona no mobile

## 📱 Responsividade

- Teste em desktop, tablet e mobile
- Use as classes do Tailwind CSS adequadamente
- Verifique breakpoints: `sm:`, `md:`, `lg:`, `xl:`

## 🎨 UI/UX

- Mantenha consistência com o design atual
- Use os componentes da pasta `components/ui/`
- Siga a paleta de cores estabelecida
- Mantenha o design minimalista

## 🐛 Reportando Bugs

Ao reportar bugs, inclua:

- Descrição clara do problema
- Passos para reproduzir
- Comportamento esperado vs atual
- Screenshots/vídeos (se aplicável)
- Informações do ambiente (SO, navegador, etc.)

## 💡 Sugerindo Features

Para sugerir novas funcionalidades:

- Descreva claramente a feature
- Explique o problema que ela resolve
- Forneça exemplos de uso
- Considere o impacto na UX atual

## ❓ Dúvidas

Se tiver dúvidas:

- Verifique a documentação existente
- Procure em issues fechadas
- Abra uma nova issue com a tag `question`

## 🏆 Reconhecimento

Todos os contribuidores serão reconhecidos no projeto. Obrigado por ajudar a tornar o Easy Schedule melhor!

---

**Lembre-se**: Código de qualidade, commits claros e boa comunicação fazem toda a diferença! 🚀
