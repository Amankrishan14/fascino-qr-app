# Portfolio QR

A modern web application for creating and sharing professional portfolios with QR codes. Built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

- **User Authentication**: Secure email/password authentication
- **Profile Management**: Create and update your professional profile
- **Media Gallery**: Add images and videos to showcase your work
- **Custom Links**: Add links to your websites, projects, and more
- **Social Media Integration**: Connect all your social profiles
- **QR Code Generation**: Generate and download a QR code for your public profile
- **Admin Dashboard**: Approve or revoke user profiles
- **Public Portfolio Page**: Share your portfolio with a clean, responsive design

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Supabase (Authentication, Database, Storage)
- **Libraries**: 
  - `@supabase/supabase-js`: Supabase client
  - `qrcode`: QR code generation
  - `react-router-dom`: Routing
  - `lucide-react`: Icons

## Local Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd qrportfolio
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create a Supabase Project

1. Go to [Supabase](https://supabase.com/) and create a new project
2. Note your project URL and anon/public key from the project settings

### 4. Set Up Environment Variables

Create a `.env` file in the project root:

```
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 5. Set Up the Database

1. In your Supabase project, go to the SQL Editor
2. Copy and paste the contents of `supabase.sql` from this repository
3. Run the SQL to create all necessary tables and policies

### 6. Run the Development Server

```bash
npm run dev
```

### 7. (Optional) Make Yourself an Admin

To access the admin dashboard, you need to add your user to the admins table:

1. Sign up for an account in the app
2. Get your user ID from the Supabase Authentication dashboard
3. Run this SQL in the Supabase SQL Editor:

```sql
INSERT INTO admins (user_id) VALUES ('your-user-id');
```

## Deployment

### Deploying to Vercel

1. Push your repository to GitHub
2. Go to [Vercel](https://vercel.com/) and create a new project
3. Import your GitHub repository
4. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy the project

### Deploying to Netlify

1. Push your repository to GitHub
2. Go to [Netlify](https://www.netlify.com/) and create a new site
3. Import your GitHub repository
4. Set build command to `npm run build`
5. Set publish directory to `dist`
6. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
7. Deploy the site

### Post-Deployment Configuration

1. In your Supabase project, go to Authentication → URL Configuration
2. Set the Site URL to your deployed domain (e.g., `https://your-app.vercel.app`)
3. Add any additional redirect URLs if needed

## Usage

1. **Sign Up/Login**: Create an account or log in with your email and password
2. **Create Your Profile**: Fill in your handle, headline, bio, and avatar
3. **Add Content**: Add media, links, and social profiles
4. **Generate QR Code**: Your QR code is automatically generated and can be downloaded
5. **Admin Approval**: An admin must approve your profile before it becomes publicly visible
6. **Share Your Portfolio**: Share your public portfolio URL: `/p/your-handle`

## Future Enhancements

- Direct file uploads to Supabase Storage
- Custom themes for public portfolios
- Analytics for profile views
- Custom domains for portfolios

## License

MIT

---

Built with ❤️ using Vite, React, TypeScript, Tailwind CSS, and Supabase