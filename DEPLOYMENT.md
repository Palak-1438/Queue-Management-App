# Deployment Guide - QueueFlow

This guide covers all steps required to successfully deploy QueueFlow to Vercel.

## Prerequisites

- A Neon PostgreSQL database (free tier available at https://console.neon.tech)
- Vercel account (https://vercel.com)
- GitHub repository with this code

## Environment Variables Required

All of these must be set in your Vercel project settings:

### 1. **DATABASE_URL** (Required)
- **Description**: PostgreSQL connection string for your database
- **Example**: `postgresql://user:password@ep-xyz.us-east-2.aws.neon.tech/queueflow`
- **How to get it**:
  1. Go to https://console.neon.tech
  2. Create a new project (or use existing)
  3. Copy the connection string from the dashboard
  4. Keep the default user and auto-generated password

### 2. **NEXTAUTH_SECRET** (Required)
- **Description**: Secret key for NextAuth session encryption
- **How to generate**:
  ```bash
  openssl rand -base64 32
  ```
- **Example output**: `o+4x7k/2XxZqL9mK1P3JvN5R8W9Y0a=`

### 3. **NEXTAUTH_URL** (Required)
- **Description**: Your deployment URL for authentication
- **For Vercel**: Use your Vercel project URL
- **Example**: `https://queueflow-app.vercel.app`

### 4. **ADMIN_EMAIL** (Optional)
- **Description**: Email for the default admin account created during deployment
- **Default**: `admin@queueflow.com`
- **Can be overridden** during the seeding process

### 5. **ADMIN_PASSWORD** (Optional)
- **Description**: Password for the default admin account
- **Default**: `Password123!`
- **⚠️ WARNING**: Change this immediately after first login!

### 6. **ADMIN_NAME** (Optional)
- **Description**: Name for the default admin account
- **Default**: `Admin Manager`

## Step-by-Step Deployment

### Step 1: Set Up Database

1. **Create a Neon Database**:
   - Go to https://console.neon.tech
   - Sign up or log in
   - Create a new project
   - Copy the connection string (includes username and password)
   - Keep it safe - you'll need it for Vercel

### Step 2: Generate Auth Secret

Run this command locally:
```bash
openssl rand -base64 32
```

Copy the output - you'll need it for Vercel.

### Step 3: Deploy to Vercel

1. **Connect Your GitHub Repository**:
   - Go to https://vercel.com/new
   - Select "Import Git Repository"
   - Choose this GitHub repository
   - Click "Import"

2. **Configure Environment Variables**:
   - In the "Environment Variables" section, add:
     - `DATABASE_URL`: Your Neon connection string
     - `NEXTAUTH_SECRET`: The generated secret from Step 2
     - `NEXTAUTH_URL`: Your Vercel project URL (e.g., `https://queueflow-app.vercel.app`)
     - `ADMIN_EMAIL`: (optional) Default admin email
     - `ADMIN_PASSWORD`: (optional) Default admin password
     - `ADMIN_NAME`: (optional) Default admin name

3. **Click "Deploy"**:
   - Vercel will automatically:
     - Install dependencies
     - Generate Prisma Client
     - Run the build
     - Deploy the app
   - This may take 2-5 minutes

### Step 4: Verify Deployment

1. **Check Deployment Status**:
   - Go to your Vercel project dashboard
   - Wait for the deployment to complete (shows "Ready")

2. **Test the Application**:
   - Click the deployment link or go to your URL
   - You should see the login page
   - Log in with the credentials you set (default: `admin@queueflow.com` / `Password123!`)

3. **Verify Database Connection**:
   - After login, navigate to Analytics
   - You should see the dashboard load (confirms database works)

## Troubleshooting

### Issue: "DATABASE_URL environment variable is not set"

**Solution**:
1. Go to your Vercel project settings
2. Go to "Environment Variables"
3. Add `DATABASE_URL` with your Neon connection string
4. Trigger a new deployment

### Issue: "NEXTAUTH_SECRET not set"

**Solution**:
1. Go to your Vercel project settings
2. Go to "Environment Variables"
3. Add `NEXTAUTH_SECRET` with the generated secret
4. Trigger a new deployment

### Issue: "NEXTAUTH_URL not set correctly"

**Solution**:
1. Go to your Vercel project settings
2. Go to "Environment Variables"
3. Set `NEXTAUTH_URL` to your deployment URL (e.g., `https://queueflow-app.vercel.app`)
4. Make sure there's no trailing slash
5. Trigger a new deployment

### Issue: Login fails with "Invalid credentials"

**Solution**:
1. Go to Vercel project settings → Functions → Run Build Step
2. Look for seed output to see what credentials were set
3. Or check the ADMIN_EMAIL and ADMIN_PASSWORD environment variables
4. Reset by updating the environment variables and redeploying

### Issue: Database connection fails

**Solution**:
1. Verify your Neon connection string is correct
   - Should start with `postgresql://`
   - Should include username and password
   - Should be an active project in Neon console
2. Check that your Neon project is active (not suspended)
3. Update DATABASE_URL and redeploy

## Post-Deployment

### 1. Change Default Admin Password

⚠️ **Important**: The default password is visible in environment variables!

1. Log in with the default credentials
2. Go to Settings
3. Change the admin password immediately
4. Remove or update ADMIN_PASSWORD environment variable in Vercel

### 2. Enable HTTPS

Vercel automatically provides HTTPS certificates - no action needed!

### 3. Custom Domain (Optional)

1. Go to Vercel project settings
2. Click "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions
5. Update NEXTAUTH_URL to use your custom domain

## Security Considerations

1. **Never commit `.env` files**: All environment variables must be set in Vercel
2. **Rotate NEXTAUTH_SECRET regularly**: Generate a new one periodically
3. **Use strong passwords**: The default admin password is weak - change immediately
4. **Keep dependencies updated**: Run `npm audit` regularly
5. **Monitor logs**: Check Vercel project logs for any errors
6. **Database backups**: Set up backups with Neon (included with free tier)

## Scaling & Optimization

For production use:

1. **Upgrade Neon Plan**: Free tier has limited connections
2. **Enable Caching**: Add Redis for session caching if needed
3. **Monitor Performance**: Use Vercel Analytics dashboard
4. **Set up Alerts**: Configure Vercel alerts for build failures

## Additional Resources

- **Neon Docs**: https://neon.tech/docs
- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **NextAuth.js Docs**: https://next-auth.js.org
- **Prisma Docs**: https://www.prisma.io/docs

## Getting Help

If you encounter issues:

1. Check this deployment guide
2. Review Vercel deployment logs (Vercel Dashboard → Deployments → Logs)
3. Check application logs (Vercel Dashboard → Logs)
4. Review environment variables are correctly set
5. Contact Neon support for database issues
6. Contact Vercel support for deployment issues
