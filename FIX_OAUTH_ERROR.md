# Fix OAuth Error: invalid_client

## The Error

```text
The OAuth client was not found.
Error 401: invalid_client
```

This means Google can't find or validate your OAuth credentials.

## Step-by-Step Fix

### Step 1: Verify OAuth Client Exists in Google Cloud Console

1. Go to: <https://console.cloud.google.com/apis/credentials>
2. Look for your OAuth 2.0 Client ID
3. Check if it exists and is active
4. If it's missing or deleted, you need to create a new one (see Step 2)

### Step 2: Create/Verify OAuth Client (If Missing)

1. In Google Cloud Console → **APIs & Services** → **Credentials**
2. Click **+ Create Credentials** → **OAuth client ID**
3. If prompted, configure OAuth consent screen first:
   - Go to **OAuth consent screen**
   - Choose **External** (or Internal if using Workspace)
   - Fill in required fields:
     - App name: `Parrot Ops`
     - User support email: Your email
     - Developer contact: Your email
   - Click **Save and Continue**
   - Add scopes: `.../auth/spreadsheets` and `.../auth/drive.file`
   - Click **Save and Continue**
   - Add test users (if External): Your email
   - Click **Save and Continue**
   - Click **Back to Dashboard**

4. Now create OAuth client:
   - Application type: **Web application**
   - Name: `Parrot Ops Web Client`
   - **Authorized JavaScript origins**:
     - `http://localhost:3000`
     - `https://parrotauction-hibid-r8ysomw3i-ignas-s-projects.vercel.app`
   - **Authorized redirect URIs**:
     - `http://localhost:3000/api/auth/callback/google`
     - `https://parrotauction-hibid-r8ysomw3i-ignas-s-projects.vercel.app/api/auth/callback/google`
   - Click **Create**
   - ⚠️ **Copy the Client ID and Client Secret immediately!**

### Step 3: Verify Environment Variables in Vercel

1. Go to: <https://vercel.com/dashboard>
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Verify these exist and are correct:

| Variable | Should Match |
|----------|-------------|
| `GOOGLE_CLIENT_ID` | The Client ID from Google Console (format: `xxxxx.apps.googleusercontent.com`) |
| `GOOGLE_CLIENT_SECRET` | The Client Secret from Google Console (format: `GOCSPX-xxxxx`) |

1. **Important**:
   - Make sure there are NO extra spaces
   - Make sure the values are exactly as shown in Google Console
   - Make sure all checkboxes (Production, Preview, Development) are checked

### Step 4: Verify Redirect URI Matches Exactly

1. In Google Cloud Console → **Credentials** → Click your OAuth Client ID
2. Check **Authorized redirect URIs**
3. Make sure this EXACT URL is listed:

```text
https://parrotauction-hibid-r8ysomw3i-ignas-s-projects.vercel.app/api/auth/callback/google
```

⚠️ **Important checks**:

- No trailing slash
- No spaces
- Exact match (including `https://` and `/api/auth/callback/google`)
- Case-sensitive

### Step 5: Update Vercel Environment Variables (If Changed)

If you created a new OAuth client or updated credentials:

1. Go to Vercel → **Settings** → **Environment Variables**
2. Update `GOOGLE_CLIENT_ID` with the new Client ID
3. Update `GOOGLE_CLIENT_SECRET` with the new Client Secret
4. Click **Save**

### Step 6: Redeploy

After updating environment variables:

1. Go to **Deployments** tab
2. Click the **3 dots** (⋯) on latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete

### Step 7: Test Again

1. Visit your Vercel URL
2. Try signing in with Google
3. If still failing, check browser console for more error details

## Common Issues

### Issue: "Client ID doesn't match"

- **Fix**: Make sure the Client ID in Vercel matches exactly what's in Google Console
- Check for typos, extra spaces, or missing characters

### Issue: "Redirect URI mismatch"

- **Fix**: The redirect URI in Google Console must match exactly:
  - `https://your-vercel-url.vercel.app/api/auth/callback/google`
- No trailing slash, no spaces, exact match

### Issue: "OAuth client not found"

- **Fix**: The Client ID might be from a different project or deleted
- Create a new OAuth client in Google Cloud Console
- Update Vercel environment variables with new credentials

### Issue: "Consent screen not configured"

- **Fix**: Configure OAuth consent screen first (Step 2 above)
- Make sure scopes are added: `spreadsheets` and `drive.file`

## Verification Checklist

- [ ] OAuth client exists in Google Cloud Console
- [ ] Client ID matches in Vercel environment variables
- [ ] Client Secret matches in Vercel environment variables
- [ ] Redirect URI is added in Google Console
- [ ] Redirect URI matches exactly (no trailing slash, no spaces)
- [ ] OAuth consent screen is configured
- [ ] Scopes are added (spreadsheets, drive.file)
- [ ] Environment variables are saved in Vercel
- [ ] Deployment is redeployed after updating variables
- [ ] Tested the sign-in flow

## Still Not Working?

If you're still getting the error:

1. **Double-check the Client ID format**:
   - Should be: `xxxxx-xxxxx.apps.googleusercontent.com`
   - NOT: `xxxxx-xxxxx@apps.googleusercontent.com` (no @ symbol)

2. **Check if you're using the right Google Cloud project**:
   - Make sure the OAuth client is in the same project where APIs are enabled

3. **Wait a few minutes**:
   - Changes in Google Console can take 5-10 minutes to propagate

4. **Check Vercel logs**:
   - Go to Vercel dashboard → Your project → Logs
   - Look for any error messages
