# Deployment Guide - Vercel

## Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com
   - Sign in with your GitHub account

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select repository: `parrot-auction-listings`
   - Click "Import"

3. **Configure Environment Variables**
   Add these in Vercel dashboard (Settings → Environment Variables):
   ```
   NEXTAUTH_URL=https://your-project-name.vercel.app
   NEXTAUTH_SECRET=your-nextauth-secret-here
   GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GOOGLE_SHEET_ID=your-google-sheet-id
   ```
   ⚠️ **Get these values from**:
   - `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
   - `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`: From Google Cloud Console
   - `GOOGLE_SHEET_ID`: From your Google Sheet URL
   ⚠️ **Important**: Update `NEXTAUTH_URL` after deployment with your actual Vercel URL!

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your app will be live at: `https://your-project-name.vercel.app`

## Option 2: Deploy via CLI

1. **Login to Vercel**
   ```bash
   vercel login
   ```

2. **Link Project** (first time only)
   ```bash
   cd /Users/ignasgru/parrot-ops
   vercel link
   ```
   - Select or create a project
   - Select scope (your team/account)

3. **Add Environment Variables**
   ```bash
   vercel env add NEXTAUTH_URL
   vercel env add NEXTAUTH_SECRET
   vercel env add GOOGLE_CLIENT_ID
   vercel env add GOOGLE_CLIENT_SECRET
   vercel env add GOOGLE_SHEET_ID
   ```
   Enter values when prompted.

4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## After Deployment

1. **Update NEXTAUTH_URL**
   - Get your deployment URL from Vercel dashboard
   - Update `NEXTAUTH_URL` environment variable in Vercel
   - Redeploy (or wait for auto-deploy)

2. **Update Google OAuth Redirect URI**
   - Go to Google Cloud Console → APIs & Services → Credentials
   - Edit your OAuth 2.0 Client ID
   - Add authorized redirect URI: `https://your-project-name.vercel.app/api/auth/callback/google`
   - Save changes

3. **Test Your App**
   - Visit: `https://your-project-name.vercel.app`
   - Sign in with Google
   - Test all functionality

## Auto-Deployment

Once connected, Vercel will automatically deploy:
- Every push to `main` branch = Production deployment
- Every pull request = Preview deployment

## Troubleshooting

- **Authentication errors**: Check NEXTAUTH_URL matches your Vercel URL
- **API errors**: Verify all environment variables are set
- **Google OAuth errors**: Check redirect URI is configured in Google Console

