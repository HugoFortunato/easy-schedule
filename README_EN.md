# 📅 Easy Schedule

A modern and intuitive platform for professional appointment management, built with Next.js, TypeScript, and Supabase.

![Easy Schedule](./public/easyschedule.png)

## ✨ Features

- 🔐 **Secure authentication** with Supabase Auth
- 📱 **Responsive design** and minimalist UI
- 🔗 **Shareable appointment links**
- 📊 **Intuitive dashboard** for appointment management
- 🎨 **Modern interface** with Tailwind CSS
- 🚀 **Optimized performance** with Next.js 14
- 🛡️ **TypeScript** for enhanced type safety

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI Components
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Validation**: Zod
- **Icons**: Lucide React
- **Date formatting**: Date-fns

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)
- A [Supabase](https://supabase.com/) account

## 🚀 Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/easy-schedule.git
cd easy-schedule
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Supabase Configuration

#### 3.1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com)
2. Create a new account or sign in
3. Click "New Project"
4. Choose your organization and configure:
   - **Project name**: easy-schedule
   - **Database password**: (create a secure password)
   - **Region**: choose the closest to your location

#### 3.2. Set up database tables

In the Supabase dashboard, go to **SQL Editor** and run the following commands:

```sql
-- Create professionals table
CREATE TABLE professionals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create appointments table
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

-- Create schedule settings table
CREATE TABLE schedule_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL, -- 0 = Sunday, 1 = Monday, etc.
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for professionals (users only see their own data)
CREATE POLICY "Users can view own profile" ON professionals
  FOR SELECT USING (auth.uid()::text = email);

CREATE POLICY "Users can update own profile" ON professionals
  FOR UPDATE USING (auth.uid()::text = email);

CREATE POLICY "Users can insert own profile" ON professionals
  FOR INSERT WITH CHECK (auth.uid()::text = email);

-- Create policies for appointments
CREATE POLICY "Professionals can view own appointments" ON appointments
  FOR SELECT USING (
    professional_id IN (
      SELECT id FROM professionals WHERE email = auth.uid()::text
    )
  );

CREATE POLICY "Anyone can create appointments" ON appointments
  FOR INSERT WITH CHECK (true);

-- Create policies for schedule settings
CREATE POLICY "Professionals can manage own schedule" ON schedule_settings
  FOR ALL USING (
    professional_id IN (
      SELECT id FROM professionals WHERE email = auth.uid()::text
    )
  );
```

#### 3.3. Configure authentication

1. In the Supabase dashboard, go to **Authentication > Settings**
2. Under **Site URL**, add: `http://localhost:3000`
3. Under **Redirect URLs**, add: `http://localhost:3000/auth/callback`

### 4. Configure environment variables

1. Copy the example file:

```bash
cp .env.example .env.local
```

2. In the Supabase dashboard, go to **Settings > API**
3. Copy the keys and configure the `.env.local` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Next.js
NEXTAUTH_SECRET=your_random_secret_here
NEXTAUTH_URL=http://localhost:3000
```

### 5. Add project logos

Place the following files in the `public/` folder:

- `easyschedule.png` - Main logo
- `easyschedule-white.jpg` - Logo for dark backgrounds

### 6. Run the project

```bash
npm run dev
# or
yarn dev
```

The project will be available at [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
easy-schedule/
├── src/
│   ├── app/                  # App Router (Next.js 14)
│   │   ├── (auth)/          # Authentication routes
│   │   │   ├── signin/      # Login page
│   │   │   └── signup/      # Registration page
│   │   ├── (private)/       # Protected routes
│   │   │   ├── dashboard/   # Main dashboard
│   │   │   └── appointments/ # Appointments page
│   │   ├── (schedule)/      # Public appointment routes
│   │   ├── logout/          # Logout actions
│   │   └── layout.tsx       # Global layout
│   ├── components/          # Reusable components
│   │   ├── ui/             # Base components (Radix UI)
│   │   ├── header.tsx      # Application header
│   │   ├── signin-form.tsx # Login form
│   │   └── ...
│   ├── lib/                # Utilities and configurations
│   ├── types/              # TypeScript types
│   └── utils/              # Utility functions
│       └── supabase/       # Supabase configuration
├── public/                 # Public files
├── package.json
└── README.md
```

## 🔧 Available Scripts

```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Linting
npm run lint

# Type checking
npm run type-check
```

## 🌟 Features

### For Professionals

- ✅ Secure registration and login
- ✅ Dashboard with appointment overview
- ✅ Generate shareable appointment links
- ✅ View and manage appointments
- ✅ Configure available hours

### For Clients

- ✅ Book appointments through shared links
- ✅ Intuitive interface for time selection
- ✅ Automatic email confirmations

## 🚢 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables in the Vercel dashboard
3. Update the **Site URL** in Supabase to your production URL
4. Automatic deployment on every push to main branch

### Other platforms

The project can be deployed on any platform that supports Next.js:

- Netlify
- Railway
- Heroku
- AWS Amplify

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check if you followed all installation steps
2. Verify that environment variables are correct
3. Ensure Supabase is configured properly
4. Open an [issue](https://github.com/your-username/easy-schedule/issues) on GitHub

## 📞 Contact

- **Developer**: Your Name
- **Email**: your.email@example.com
- **LinkedIn**: [Your LinkedIn](https://linkedin.com/in/your-profile)

---

⭐ **If this project was helpful to you, please give it a star on GitHub!**
