# Quick Fix for OAuth Error

## Your Actual Vercel URL

Your deployment URL is: `https://parrot-auction-listings-ignas-s-projects.vercel.app`

## Step 1: Update Environment Variables in Vercel

1. Go to: <https://vercel.com/dashboard>
2. Select your project: `parrot-auction-listings`
3. Go to **Settings** → **Environment Variables**
4. **Update or add** these variables with your actual values:

```text
NEXTAUTH_URL=https://parrot-auction-listings-ignas-s-projects.vercel.app
NEXTAUTH_SECRET=your-nextauth-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_SHEET_ID=your-google-sheet-id
```

⚠️ **Important**:

- Make sure `NEXTAUTH_URL` matches your exact Vercel URL (no trailing slash)
- All checkboxes (Production, Preview, Development) must be checked
- Click **Save** for each variable

## Step 2: Update Google OAuth Redirect URI

1. Go to: <https://console.cloud.google.com/apis/credentials>
2. Click on your OAuth 2.0 Client ID
3. Under **Authorized redirect URIs**, make sure this EXACT URL is listed:

```text
https://parrot-auction-listings-ignas-s-projects.vercel.app/api/auth/callback/google
```

⚠️ **Critical**:

- No trailing slash
- No spaces
- Exact match: `https://parrot-auction-listings-ignas-s-projects.vercel.app/api/auth/callback/google`
- Must include `/api/auth/callback/google` at the end

1. If it's not there, click **+ ADD URI** and add it
2. Click **SAVE**

## Step 3: Verify OAuth Client ID/Secret

1. In Google Cloud Console → **Credentials**
2. Find your OAuth 2.0 Client ID
3. **Copy the Client ID** (looks like: `xxxxx.apps.googleusercontent.com`)
4. **Copy the Client Secret** (looks like: `GOCSPX-xxxxx`)
5. Make sure these match what's in Vercel environment variables

## Step 4: Redeploy

After updating environment variables:

1. Go to **Deployments** tab in Vercel
2. Click the **3 dots** (⋯) on the latest deployment
3. Click **Redeploy**
4. Wait 2-3 minutes

## Step 5: Test

1. Visit: <https://parrot-auction-listings-ignas-s-projects.vercel.app>
2. Try signing in with Google
3. If still failing, check browser console (F12) for errors

## Common Issues

### Issue: Environment variables not set

- **Fix**: Make sure all 5 variables are added in Vercel
- Check that values are correct (no typos, no extra spaces)

### Issue: Redirect URI mismatch

- **Fix**: The redirect URI in Google Console must match EXACTLY:
  - `https://parrot-auction-listings-ignas-s-projects.vercel.app/api/auth/callback/google`
- Check for typos, trailing slashes, or missing `/api/auth/callback/google`

### Issue: Wrong Client ID/Secret

- **Fix**: Verify the Client ID and Secret in Google Console match what's in Vercel
- If they don't match, update Vercel environment variables

### Issue: NEXTAUTH_URL doesn't match

- **Fix**: `NEXTAUTH_URL` must be exactly: `https://parrot-auction-listings-ignas-s-projects.vercel.app`
- No trailing slash, no `www`, exact match

## Checklist

- [ ] All 5 environment variables are set in Vercel
- [ ] `NEXTAUTH_URL` matches your Vercel URL exactly
- [ ] `GOOGLE_CLIENT_ID` matches Google Console
- [ ] `GOOGLE_CLIENT_SECRET` matches Google Console
- [ ] Redirect URI is added in Google Console (exact match)
- [ ] Redeployed after updating variables
- [ ] Waited 2-3 minutes after redeploy
