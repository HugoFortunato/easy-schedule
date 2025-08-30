# 🚀 Deployment Guide - Easy Schedule

This document provides detailed instructions for deploying Easy Schedule on different platforms.

## 📋 Prerequisites for Deployment

1. ✅ Project running locally
2. ✅ Supabase database configured
3. ✅ All migrations applied
4. ✅ Environment variables configured
5. ✅ Build working (`npm run build`)

## 🌐 Deploy on Vercel (Recommended)

### Step 1: Prepare the repository

```bash
# Make sure you're on the main branch
git checkout main
git push origin main
```

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Select the `easy-schedule` repository
5. Configure settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: .next

### Step 3: Configure environment variables

In the Vercel dashboard, go to **Settings > Environment Variables** and add:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXTAUTH_SECRET=secure_random_string_for_production
NEXTAUTH_URL=https://your-project.vercel.app
```

### Step 4: Update Supabase

In the Supabase dashboard:

1. **Authentication > Settings > Site URL**: `https://your-project.vercel.app`
2. **Authentication > Settings > Redirect URLs**: `https://your-project.vercel.app/auth/callback`

### Step 5: Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Test the project at the provided URL

## 🛡️ Deploy on Netlify

### Step 1: Prepare for Netlify

1. Create `netlify.toml` file in the root:

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

### Step 2: Deploy

1. Go to [netlify.com](https://netlify.com)
2. Connect with GitHub
3. Select the repository
4. Configure environment variables
5. Automatic deployment

## 🚂 Deploy on Railway

### Step 1: Configure Railway

```bash
# Install CLI (optional)
npm install -g @railway/cli

# Or use the web dashboard
```

### Step 2: Deploy

1. Go to [railway.app](https://railway.app)
2. Connect GitHub
3. Select the project
4. Configure environment variables
5. Automatic deployment

## ☁️ Deploy on AWS Amplify

### Step 1: Configure build

Create `amplify.yml`:

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
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

### Step 2: Deploy on AWS

1. AWS Console > Amplify
2. Connect repository
3. Configure build settings
4. Add environment variables
5. Deploy

## 🐳 Deploy with Docker

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

### Deploy with Docker

```bash
# Build
docker build -t easy-schedule .

# Run
docker run -p 3000:3000 easy-schedule
```

## 🔧 Specific Configurations

### Next.js Config for Deployment

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // For Docker
  images: {
    domains: ['your-domain.com'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

module.exports = nextConfig;
```

### Production Optimizations

1. **Bundle Analyzer**:

```bash
npm install --save-dev @next/bundle-analyzer
```

2. **Compression**:

```javascript
// next.config.js
const nextConfig = {
  compress: true,
  poweredByHeader: false,
};
```

## 🔍 Post-Deployment Monitoring

### Essential checks:

- ✅ Login/Registration working
- ✅ Dashboard loading
- ✅ Appointment creation
- ✅ Shareable links working
- ✅ Mobile responsiveness
- ✅ Performance (Core Web Vitals)

### Monitoring tools:

- **Vercel Analytics** (for Vercel)
- **Google Analytics**
- **Sentry** (for errors)
- **LogRocket** (for sessions)

## 🚨 Troubleshooting

### Common issues:

1. **Build fails**:

```bash
# Clear cache and reinstall
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

2. **Supabase doesn't connect**:

- Check URLs in environment variables
- Confirm CORS configurations
- Validate API keys

3. **Authentication doesn't work**:

- Check NEXTAUTH_URL
- Confirm redirect URLs in Supabase
- Validate NEXTAUTH_SECRET

4. **Images don't load**:

- Configure domains in next.config.js
- Check image paths
- Confirm image optimization

## 📊 Performance

### Important metrics:

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

### Optimizations:

```javascript
// Lazy loading
import dynamic from 'next/dynamic';
const Component = dynamic(() => import('./Component'));

// Image optimization
import Image from 'next/image';
<Image src="/image.jpg" width={500} height={300} alt="Description" />;
```

## 🔐 Security

### Security checklist:

- ✅ HTTPS enabled
- ✅ Security headers configured
- ✅ Secure environment variables
- ✅ Input validation
- ✅ Rate limiting implemented
- ✅ CORS configured correctly

---

**🎉 Congratulations! Your project is live!**

For additional support, consult the chosen platform's documentation or open an issue on GitHub.
