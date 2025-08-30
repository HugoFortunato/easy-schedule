# 🔧 Environment Variables Configuration

This file contains detailed instructions for configuring the environment variables needed for Easy Schedule.

## 📁 Creating the .env.local file

1. **Copy the example file:**

```bash
cp .env.example .env.local
```

2. **If it doesn't exist, create manually:**

```bash
touch .env.local
```

## 🔑 Required Variables

### Supabase (Required)

#### NEXT_PUBLIC_SUPABASE_URL

- **Where to find**: Supabase Dashboard > Settings > API > Project URL
- **Format**: `https://xxxxxxxxxxxxxxxxxxxx.supabase.co`
- **Example**: `NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co`

#### NEXT_PUBLIC_SUPABASE_ANON_KEY

- **Where to find**: Supabase Dashboard > Settings > API > Project API keys > anon public
- **Format**: Long string starting with `eyJ`
- **Example**: `NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Next.js (Required)

#### NEXTAUTH_SECRET

- **Description**: Random string for session encryption
- **How to generate**: Use an online generator or command:

```bash
openssl rand -base64 32
```

- **Example**: `NEXTAUTH_SECRET=abc123def456ghi789jkl012mno345pqr678stu901vwx234yzA567BCD890`

#### NEXTAUTH_URL

- **Development**: `http://localhost:3000`
- **Production**: Your deployment URL
- **Example**: `NEXTAUTH_URL=https://myapp.vercel.app`

## 📝 Complete .env.local File

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_public_anon_key_here

# Next.js Authentication
NEXTAUTH_SECRET=your_random_secret_string_here
NEXTAUTH_URL=http://localhost:3000

# Optional - For development
NODE_ENV=development
```

## ⚠️ Important

### Security

- ✅ **NEVER** commit `.env*` files to Git
- ✅ Add `.env*` to `.gitignore`
- ✅ Use different values for development and production
- ✅ Keep keys secure and private

### Troubleshooting

#### Error: "Invalid API key"

- Check if you copied the correct key from Supabase
- Confirm there are no extra spaces
- Make sure you're using the `anon public` key, not `service_role`

#### Error: "NEXTAUTH_URL not defined"

- Check if the variable is in `.env.local`
- For production, use the complete deployment URL
- Restart the server after changing variables

#### Error: "Supabase client could not be created"

- Confirm the Supabase URL is correct
- Check if the Supabase project is active
- Test the connection in the Supabase dashboard

## 🔍 Verifying Configuration

### Quick test in browser console:

```javascript
// Should return the Supabase URL
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL);

// Should return the key (first characters)
console.log(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 10));
```

### Verification in code:

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
      throw new Error(`Environment variable ${env} not found`);
    }
  }

  console.log('✅ All environment variables are configured');
}
```

## 🌍 Different Environments

### Development (.env.local)

```env
NEXT_PUBLIC_SUPABASE_URL=https://dev-project.supabase.co
NEXTAUTH_URL=http://localhost:3000
NODE_ENV=development
```

### Production (Vercel/Netlify)

```env
NEXT_PUBLIC_SUPABASE_URL=https://prod-project.supabase.co
NEXTAUTH_URL=https://myapp.vercel.app
NODE_ENV=production
```

### Testing (.env.test)

```env
NEXT_PUBLIC_SUPABASE_URL=https://test-project.supabase.co
NEXTAUTH_URL=http://localhost:3000
NODE_ENV=test
```

## 📱 Deployment on Platforms

### Vercel

1. Dashboard > Project > Settings > Environment Variables
2. Add each variable individually
3. Select environments (Development, Preview, Production)

### Netlify

1. Site settings > Build & deploy > Environment variables
2. Add key-value pairs
3. Deploy contexts: Production, Deploy previews, Branch deploys

### Railway

1. Project > Variables tab
2. Add variables one by one
3. Restart required after changes

## 🆘 Support

If you still have issues:

1. Check if you followed all steps
2. Confirm there are no special characters in keys
3. Test with a new Supabase project
4. Open an issue on GitHub with error details

---

**💡 Tip**: Keep a backup of your keys in a secure password manager!
