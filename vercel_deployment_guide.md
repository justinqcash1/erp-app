# Vercel Deployment Guide for ERP Application

This guide provides detailed instructions for deploying your ERP application to Vercel. The application is built with Next.js, React, TypeScript, and Prisma with PostgreSQL.

## Prerequisites

Before deploying, ensure you have:

1. A [Vercel account](https://vercel.com/signup)
2. A PostgreSQL database (Vercel Postgres, Supabase, or any other PostgreSQL provider)
3. Git installed on your local machine

## Step 1: Prepare Your Database

1. Create a PostgreSQL database with your preferred provider
2. Note down the following connection details:
   - Database URL (format: `postgresql://username:password@hostname:port/database`)
   - Database name
   - Username and password

## Step 2: Resolve Remaining Build Issues

Before deploying, you'll need to resolve a few remaining build issues:

### 1. Add Suspense Boundaries for Client Components

Add Suspense boundaries around components that use hooks like `useSearchParams()`. For example, in `/src/app/invoices/create/page.tsx`:

```tsx
import { Suspense } from 'react';

export default function CreateInvoicePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateInvoiceContent />
    </Suspense>
  );
}

function CreateInvoiceContent() {
  // Your existing component code that uses useSearchParams
  const searchParams = useSearchParams();
  // ...rest of the component
}
```

Apply this pattern to all pages that use `useSearchParams()` or other hooks that require suspense boundaries.

### 2. Fix Authentication in Server Components

For pages that use authentication, ensure they're properly marked as client components and handle authentication states correctly:

```tsx
"use client";

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function ProtectedPage() {
  const { data: session, status } = useSession();
  
  if (status === "loading") {
    return <div>Loading...</div>;
  }
  
  if (status === "unauthenticated") {
    redirect('/auth/signin');
    return null;
  }
  
  // Your protected page content
}
```

## Step 3: Configure Environment Variables

Create a `.env.local` file in your project root with the following variables:

```
# Database
DATABASE_URL="postgresql://username:password@hostname:port/database"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="https://your-vercel-deployment-url.vercel.app"

# In production, set this to your actual deployment URL
```

## Step 4: Deploy to Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy the application:
   ```bash
   vercel
   ```

4. Follow the prompts to configure your project:
   - Set up and deploy: `Y`
   - Link to existing project: `N` (unless you've already created a project)
   - Project name: `erp-app` (or your preferred name)
   - Directory: `.` (current directory)
   - Override settings: `N`

### Option 2: Deploy via GitHub Integration

1. Push your code to a GitHub repository
2. Log in to [Vercel](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Configure project settings:
   - Framework Preset: Next.js
   - Root Directory: `./` (or the directory containing your Next.js app)
   - Build Command: `npm run build`
   - Output Directory: `.next`
6. Add environment variables from Step 3
7. Click "Deploy"

## Step 5: Configure Vercel PostgreSQL (Optional)

If you're using Vercel Postgres:

1. In your Vercel project dashboard, go to "Storage"
2. Click "Create" and select "Postgres"
3. Follow the setup instructions
4. Vercel will automatically add the required environment variables to your project

## Step 6: Run Database Migrations

After deployment, you'll need to run Prisma migrations:

1. Connect to your Vercel project:
   ```bash
   vercel link
   ```

2. Pull environment variables:
   ```bash
   vercel env pull
   ```

3. Run Prisma migrations:
   ```bash
   npx prisma migrate deploy
   ```

## Troubleshooting

### Build Errors

If you encounter build errors related to TypeScript or ESLint:

1. Ensure your `next.config.js` has the following settings:
   ```js
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     typescript: {
       ignoreBuildErrors: true,
     },
     eslint: {
       ignoreDuringBuilds: true,
     },
   };
   
   module.exports = nextConfig;
   ```

### Database Connection Issues

If your application can't connect to the database:

1. Verify your `DATABASE_URL` environment variable is correct
2. Ensure your database allows connections from Vercel's IP addresses
3. Check if your database requires SSL by appending `?sslmode=require` to your connection string

### Authentication Issues

If authentication isn't working:

1. Verify your `NEXTAUTH_SECRET` and `NEXTAUTH_URL` environment variables
2. Ensure your `NEXTAUTH_URL` matches your actual deployment URL
3. Check that your database tables for authentication are properly created

## Maintenance and Updates

To update your deployed application:

1. Make changes to your local codebase
2. Push changes to your GitHub repository (if using GitHub integration)
3. Vercel will automatically deploy the changes
4. Or, run `vercel` again from your project directory if using the CLI

## Support

If you encounter any issues with your deployment, refer to:

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
