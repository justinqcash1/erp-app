# ERP Application Deployment Documentation

## Application Architecture

### Overview
This ERP application is built using a modern web stack optimized for Vercel deployment:

- **Frontend**: Next.js 14 with React, TypeScript, and Tailwind CSS
- **Backend**: Next.js API routes (serverless functions)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Deployment**: Vercel

### Architecture Diagram
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Client Browser │────▶│  Vercel Edge    │────▶│  Next.js App    │
│                 │     │  Network        │     │                 │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                                                         ▼
                        ┌─────────────────┐     ┌─────────────────┐
                        │                 │     │                 │
                        │  PostgreSQL     │◀───▶│  Prisma ORM     │
                        │  Database       │     │                 │
                        └─────────────────┘     └─────────────────┘
```

### Key Components

1. **Pages and Components**
   - App Router-based architecture (`/src/app/`)
   - Shared UI components (`/src/components/`)
   - API routes (`/src/app/api/`)

2. **Data Layer**
   - Prisma schema (`/prisma/schema.prisma`)
   - Database client (`/src/lib/prisma.ts`)
   - API route handlers

3. **Authentication**
   - NextAuth.js configuration (`/src/app/api/auth/[...nextauth]/route.ts`)
   - Authentication utilities (`/src/lib/auth.ts`)

4. **Core Modules**
   - Trucking Ticket Management
   - Invoice Verification System
   - Material-Freight Tracking
   - Scope Change Calculator

## Database Setup Instructions

### Prerequisites
- PostgreSQL 14+ installed locally for development
- PostgreSQL database hosted on a service like Vercel Postgres, Supabase, or Railway for production

### Local Development Setup

1. **Install PostgreSQL**
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   
   # macOS with Homebrew
   brew install postgresql
   brew services start postgresql
   ```

2. **Create a Database**
   ```bash
   sudo -u postgres psql
   CREATE DATABASE erp_app;
   CREATE USER erp_user WITH ENCRYPTED PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE erp_app TO erp_user;
   \q
   ```

3. **Configure Environment Variables**
   Create or update your `.env` file with the following:
   ```
   DATABASE_URL="postgresql://erp_user:your_password@localhost:5432/erp_app?schema=public"
   ```

4. **Run Prisma Migrations**
   ```bash
   npx prisma migrate dev
   ```

### Production Database Setup

1. **Create a PostgreSQL Database on Vercel**
   - Go to the Vercel dashboard
   - Select your project
   - Go to "Storage" tab
   - Click "Connect Database"
   - Select "Postgres" and follow the setup wizard

2. **Get the Connection String**
   - After setup, Vercel will provide a connection string
   - This will be automatically added to your environment variables

3. **Run Migrations on Production**
   ```bash
   npx prisma migrate deploy
   ```

## Vercel Deployment Guide

### Prerequisites
- Node.js 18+ installed
- Vercel CLI installed: `npm install -g vercel`
- GitHub account (recommended for continuous deployment)

### Deployment Steps

1. **Prepare Your Application**
   - Ensure all environment variables are properly set up
   - Make sure your application runs locally without errors
   - Commit all changes to your repository

2. **Deploy Using Vercel CLI**
   ```bash
   # Login to Vercel
   vercel login
   
   # Deploy from project directory
   cd /path/to/erp-app
   vercel
   ```

3. **Deploy Using Vercel Dashboard**
   - Push your code to GitHub
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository
   - Configure project settings:
     - Framework Preset: Next.js
     - Root Directory: ./
     - Build Command: `npm run build`
     - Output Directory: .next
   - Add environment variables
   - Click "Deploy"

4. **Configure Custom Domain (Optional)**
   - In the Vercel dashboard, go to your project
   - Click "Domains"
   - Add your custom domain
   - Follow the instructions to configure DNS settings

### Continuous Deployment

Vercel automatically sets up continuous deployment when connected to GitHub:
- Every push to the main branch will trigger a production deployment
- Pull requests will create preview deployments

## Environment Variables Configuration

### Required Environment Variables

```
# Database
DATABASE_URL="postgresql://username:password@host:port/database?schema=public"

# NextAuth.js
NEXTAUTH_URL="https://your-production-url.com"
NEXTAUTH_SECRET="your-random-secret-key"

# Authentication (if using email provider)
EMAIL_SERVER_HOST="smtp.example.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@example.com"
EMAIL_SERVER_PASSWORD="your-email-password"
EMAIL_FROM="noreply@example.com"
```

### How to Generate NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

### Setting Environment Variables

1. **Local Development**
   - Create a `.env.local` file in the project root
   - Add all required variables

2. **Vercel Deployment**
   - Go to your project in the Vercel dashboard
   - Navigate to "Settings" > "Environment Variables"
   - Add each variable and its value
   - Click "Save"

## System Administration Manual

### User Management

1. **Creating Admin Users**
   - The first user created will automatically be assigned admin role
   - Additional admin users can be created through the admin panel

2. **User Roles and Permissions**
   - **Admin**: Full access to all features and settings
   - **Manager**: Access to all operational features but not system settings
   - **User**: Limited access based on assigned modules

3. **Managing Users**
   - Navigate to Admin > Users
   - Add new users by providing email and role
   - Edit existing users to change roles or deactivate accounts

### Database Maintenance

1. **Backups**
   - Vercel Postgres automatically handles backups
   - For additional safety, schedule regular exports:
     ```bash
     pg_dump -U username -d database_name > backup_$(date +%Y%m%d).sql
     ```

2. **Performance Monitoring**
   - Monitor database performance through Vercel dashboard
   - Set up alerts for high usage or errors

### Troubleshooting Common Issues

1. **Application Not Loading**
   - Check Vercel deployment logs
   - Verify environment variables are correctly set
   - Ensure database connection is working

2. **Database Connection Issues**
   - Verify DATABASE_URL is correct
   - Check if IP restrictions are in place
   - Ensure database service is running

3. **Authentication Problems**
   - Verify NEXTAUTH_URL and NEXTAUTH_SECRET are set correctly
   - Check email provider settings if using email authentication

### Updating the Application

1. **Deploying Updates**
   - Push changes to your GitHub repository
   - Vercel will automatically deploy updates
   - Monitor deployment logs for any errors

2. **Database Schema Updates**
   - When schema changes, create and test migrations locally:
     ```bash
     npx prisma migrate dev --name description_of_changes
     ```
   - Deploy migrations to production:
     ```bash
     npx prisma migrate deploy
     ```

3. **Rollback Procedures**
   - Use Vercel's rollback feature to revert to a previous deployment
   - For database rollbacks, restore from a backup

### Monitoring and Logging

1. **Application Logs**
   - Access logs through Vercel dashboard
   - Filter logs by type, status, and date

2. **Performance Monitoring**
   - Set up Vercel Analytics to monitor performance
   - Consider adding additional monitoring tools like Sentry for error tracking

3. **Usage Statistics**
   - View deployment statistics in Vercel dashboard
   - Monitor database usage and performance
