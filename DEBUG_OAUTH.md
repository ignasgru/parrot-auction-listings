# Debug OAuth Error: invalid_client

## Quick Verification Steps

### Step 1: Verify Environment Variables in Vercel

1. Go to: <https://vercel.com/dashboard>
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. **Check each variable exists**:
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_SHEET_ID`

5. **Verify the values**:
   - Click on each variable to see its value
   - Make sure `GOOGLE_CLIENT_ID` matches what's in Google Console
   - Make sure `GOOGLE_CLIENT_SECRET` matches what's in Google Console
   - Make sure `NEXTAUTH_URL` is exactly: `https://parrotauction-hibid-r8ysomw3i-ignas-s-projects.vercel.app`

6. **Check all environments are selected**:
   - Production ✅
   - Preview ✅
   - Development ✅

### Step 2: Verify OAuth Client in Google Cloud Console

1. Go to: <https://console.cloud.google.com/apis/credentials>
2. **Find your OAuth 2.0 Client ID**
3. **Check the Client ID**:
   - Does it match: `746703918473-fh03d28ic2o2d37crh7t92b3f3fc5kdd.apps.googleusercontent.com`?
   - If different, that's the problem!

4. **Check Authorized redirect URIs**:
   - Must include: `https://parrotauction-hibid-r8ysomw3i-ignas-s-projects.vercel.app/api/auth/callback/google`
   - **Exact match** - no trailing slash, no spaces
   - Check for typos

5. **Check Authorized JavaScript origins**:
   - Should include: `https://parrotauction-hibid-r8ysomw3i-ignas-s-projects.vercel.app`
   - No trailing slash

### Step 3: Common Issues

#### Issue 1: Client ID/Secret Mismatch

**Symptom**: `invalid_client` error

**Fix**:

1. In Google Cloud Console, check the actual Client ID
2. If it's different from what's in Vercel, update Vercel environment variable
3. If you can't see the Client Secret, you need to create a new OAuth client

#### Issue 2: OAuth Client Doesn't Exist

**Symptom**: `invalid_client` error

**Fix**:

1. The Client ID `746703918473-fh03d28ic2o2d37crh7t92b3f3fc5kdd.apps.googleusercontent.com` might not exist
2. Create a new OAuth client in Google Cloud Console
3. Copy the new Client ID and Client Secret
4. Update Vercel environment variables
5. Add the redirect URI to the new client

#### Issue 3: Wrong Google Cloud Project

**Symptom**: `invalid_client` error

**Fix**:

1. Make sure you're looking at the correct Google Cloud project
2. The OAuth client must be in the same project where APIs are enabled
3. Check the project dropdown at the top of Google Cloud Console

#### Issue 4: Redirect URI Mismatch

**Symptom**: `invalid_client` or `redirect_uri_mismatch` error

**Fix**:

1. In Google Cloud Console → OAuth Client → Authorized redirect URIs
2. Must have EXACTLY: `https://parrotauction-hibid-r8ysomw3i-ignas-s-projects.vercel.app/api/auth/callback/google`
3. No trailing slash, no spaces, exact match

### Step 4: Create New OAuth Client (If Needed)

If the Client ID doesn't exist or you can't verify it:

1. Go to: <https://console.cloud.google.com/apis/credentials>
2. Click **+ Create Credentials** → **OAuth client ID**
3. If prompted, configure OAuth consent screen:
   - App name: `Parrot Ops`
   - User support email: Your email
   - Add scopes: `.../auth/spreadsheets` and `.../auth/drive.file`
   - Add test users: Your email
4. Create OAuth client:
   - Application type: **Web application**
   - Name: `Parrot Ops Web Client`
   - **Authorized JavaScript origins**:
     - `http://localhost:3000`
     - `https://parrotauction-hibid-r8ysomw3i-ignas-s-projects.vercel.app`
   - **Authorized redirect URIs**:
     - `http://localhost:3000/api/auth/callback/google`
     - `https://parrotauction-hibid-r8ysomw3i-ignas-s-projects.vercel.app/api/auth/callback/google`
   - Click **Create**
   - **Copy the new Client ID and Client Secret**
5. Update Vercel:
   - Go to Vercel → Settings → Environment Variables
   - Update `GOOGLE_CLIENT_ID` with new value
   - Update `GOOGLE_CLIENT_SECRET` with new value
   - Save
6. Redeploy:
   - Go to Deployments → Click 3 dots → Redeploy

### Step 5: Test After Changes

1. Wait 2-3 minutes after updating (changes need to propagate)
2. Visit: <https://parrotauction-hibid-r8ysomw3i-ignas-s-projects.vercel.app>
3. Try signing in with Google
4. Check browser console (F12) for any error messages

## What to Check Right Now

1. **In Vercel**: Do you see all 5 environment variables?
2. **In Google Cloud Console**: Does the OAuth Client ID `746703918473-fh03d28ic2o2d37crh7t92b3f3fc5kdd` exist?
3. **In Google Cloud Console**: Is the redirect URI added exactly as shown above?
4. **In Vercel**: Did you redeploy after adding environment variables?

## Still Not Working?

Share:

1. The exact error message you see
2. Whether the OAuth Client ID exists in Google Cloud Console
3. Whether environment variables are set in Vercel
4. Whether you redeployed after adding variables
