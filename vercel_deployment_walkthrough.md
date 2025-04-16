# Vercel Deployment Walkthrough

This guide provides detailed step-by-step instructions for deploying your ERP application to Vercel, including setting up a PostgreSQL database and configuring environment variables.

## Part 1: Setting Up a Vercel PostgreSQL Database

1. **Sign in to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Sign In" and use your preferred authentication method (GitHub, GitLab, etc.)

2. **Create a New PostgreSQL Database**
   - From your Vercel dashboard, click on the "Storage" tab in the top navigation
   - Click "Create" and select "PostgreSQL Database"
   - Choose a name for your database (e.g., "erp-app-db")
   - Select the region closest to your users for optimal performance
   - Choose the plan that fits your needs (there's a free tier for development)
   - Click "Create" to provision your database

3. **Get Database Connection Details**
   - Once your database is created, you'll be taken to the database dashboard
   - Click on the "Connect" tab
   - You'll see a connection string in the format: `postgres://username:password@hostname:port/database`
   - Save this connection string as you'll need it for your environment variables

## Part 2: Configuring Environment Variables

1. **Create a New Project on Vercel**
   - From your Vercel dashboard, click "Add New" and select "Project"
   - Import your GitHub repository or upload your project files
   - If importing from GitHub, you'll need to connect your GitHub account if you haven't already

2. **Configure Project Settings**
   - Set the Framework Preset to "Next.js"
   - Set the Root Directory to "./" (or the directory containing your Next.js app)
   - Leave the Build Command as "npm run build" (default)
   - Leave the Output Directory as ".next" (default)

3. **Add Environment Variables**
   - Scroll down to the "Environment Variables" section
   - Add the following variables:
     - `DATABASE_URL`: Paste the PostgreSQL connection string from Part 1
     - `NEXTAUTH_SECRET`: Generate a secure random string (you can use [this generator](https://generate-secret.vercel.app/32))
     - `NEXTAUTH_URL`: This will be your deployed application URL (e.g., `https://your-app-name.vercel.app`)
   - Click "Add" for each variable
   - Make sure to add these variables to all environments (Production, Preview, Development)

## Part 3: Deploying the Application

1. **Finalize Deployment Settings**
   - Review all settings to ensure they're correct
   - Click "Deploy" to start the deployment process

2. **Monitor Deployment Progress**
   - Vercel will show you the build logs in real-time
   - If there are any errors, review the logs to identify and fix the issues
   - Common issues include:
     - Missing environment variables
     - Build errors related to TypeScript or ESLint (which can be ignored using the settings in your next.config.js)
     - Database connection issues

3. **Run Database Migrations**
   - After successful deployment, you'll need to run Prisma migrations
   - Install Vercel CLI locally: `npm install -g vercel`
   - Login to Vercel CLI: `vercel login`
   - Link to your project: `vercel link`
   - Pull environment variables: `vercel env pull`
   - Run Prisma migrations: `npx prisma migrate deploy`

4. **Verify Deployment**
   - Once deployment is complete, click on the provided URL to visit your application
   - Test the authentication system by creating an account and logging in
   - Verify that all features are working correctly with the database

## Part 4: Troubleshooting Common Issues

### Database Connection Issues
- Ensure your `DATABASE_URL` environment variable is correct
- Check if your database allows connections from Vercel's IP addresses
- Try appending `?sslmode=require` to your connection string if SSL is required

### Build Errors
- If you encounter TypeScript or ESLint errors, make sure your `next.config.js` has the following settings:
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

### Authentication Issues
- Verify your `NEXTAUTH_SECRET` and `NEXTAUTH_URL` environment variables
- Ensure your `NEXTAUTH_URL` matches your actual deployment URL
- Check that your database tables for authentication are properly created

## Part 5: Ongoing Maintenance

1. **Updating Your Application**
   - Push changes to your GitHub repository (if using GitHub integration)
   - Vercel will automatically deploy the changes
   - Or, use the Vercel CLI to deploy manually: `vercel`

2. **Monitoring Performance**
   - Use Vercel's Analytics to monitor your application's performance
   - Check database usage in the Storage tab
   - Set up alerts for any issues

3. **Scaling Your Application**
   - Upgrade your database plan if you need more storage or connections
   - Configure auto-scaling for your application if needed
   - Consider adding a CDN for static assets

By following these steps, you should have a fully deployed ERP application on Vercel with a PostgreSQL database. If you encounter any specific issues during the deployment process, refer to the troubleshooting guide or Vercel's documentation for more detailed assistance.
