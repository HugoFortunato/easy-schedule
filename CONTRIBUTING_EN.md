# 🤝 Contributing Guide - Easy Schedule

Thank you for considering contributing to Easy Schedule! This document provides guidelines for contributing to the project.

## 📋 Before You Start

1. Make sure you have read the [README.md](README_EN.md)
2. Check if there's an existing [issue](https://github.com/your-username/easy-schedule/issues) related to what you want to implement
3. If none exists, create an issue describing the feature or bug

## 🛠️ Development Environment Setup

1. Fork the repository
2. Clone your fork:

```bash
git clone https://github.com/YOUR-USERNAME/easy-schedule.git
```

3. Follow the README instructions to set up the environment

## 📝 Code Standards

### Commit Structure

Use conventional commits:

```
type(scope): description

feat(auth): add Google authentication
fix(dashboard): fix bug in appointment listing
docs(readme): update installation instructions
style(ui): improve header responsiveness
```

### Commit Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Formatting/style changes
- `refactor`: Code refactoring
- `test`: Adding or fixing tests
- `chore`: Changes to tools/configurations

### Code Standards

- Use TypeScript for all files
- Follow ESLint configurations
- Use Prettier for formatting
- Component names in PascalCase
- File names in kebab-case
- Use JSDoc comments when necessary

## 🔄 Workflow

1. **Create a branch** from `main`:

```bash
git checkout -b feature/feature-name
```

2. **Make your changes** following established standards

3. **Test locally**:

```bash
npm run dev
npm run lint
npm run type-check
```

4. **Commit your changes**:

```bash
git add .
git commit -m "feat(scope): description of change"
```

5. **Push to your fork**:

```bash
git push origin feature/feature-name
```

6. **Open a Pull Request** with:
   - Clear and descriptive title
   - Detailed description of changes
   - Screenshots (if applicable)
   - Link to related issue

## 🧪 Testing

- Always test your changes locally
- Check for TypeScript errors
- Test on different screen sizes
- Verify functionality works on mobile

## 📱 Responsiveness

- Test on desktop, tablet, and mobile
- Use appropriate Tailwind CSS classes
- Check breakpoints: `sm:`, `md:`, `lg:`, `xl:`

## 🎨 UI/UX

- Maintain consistency with current design
- Use components from `components/ui/` folder
- Follow established color palette
- Keep the minimalist design

## 🐛 Reporting Bugs

When reporting bugs, include:

- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots/videos (if applicable)
- Environment information (OS, browser, etc.)

## 💡 Suggesting Features

To suggest new features:

- Clearly describe the feature
- Explain what problem it solves
- Provide usage examples
- Consider impact on current UX

## ❓ Questions

If you have questions:

- Check existing documentation
- Look through closed issues
- Open a new issue with the `question` tag

## 🏆 Recognition

All contributors will be recognized in the project. Thank you for helping make Easy Schedule better!

---

**Remember**: Quality code, clear commits, and good communication make all the difference! 🚀
