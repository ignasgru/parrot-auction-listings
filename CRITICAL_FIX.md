# ⚠️ CRITICAL: Fix OAuth Error - Environment Variables Missing

## The Problem

Your app is using **dummy credentials** because environment variables are **NOT SET in Vercel**. This causes the `invalid_client` error.

## The Solution: Set Environment Variables in Vercel

### Step-by-Step Instructions

1. **Go to Vercel Dashboard**
   - Open: <https://vercel.com/dashboard>
   - Sign in if needed

2. **Select Your Project**
   - Click on: `parrot-auction-listings`

3. **Go to Environment Variables**
   - Click **Settings** (top menu)
   - Click **Environment Variables** (left sidebar)

4. **Add Each Variable One by One**

   Click **Add New** and add these 5 variables:

   **Variable 1:**
   - Key: `NEXTAUTH_URL`
   - Value: `https://parrot-auction-listings-ignas-s-projects.vercel.app`
   - Check: Production, Preview, Development
   - Click **Save**

   **Variable 2:**
   - Key: `NEXTAUTH_SECRET`
   - Value: `your-nextauth-secret-here` (generate with `openssl rand -base64 32`)
   - Check: Production, Preview, Development
   - Click **Save**

   **Variable 3:**
   - Key: `GOOGLE_CLIENT_ID`
   - Value: `your-google-client-id.apps.googleusercontent.com` (from Google Cloud Console)
   - Check: Production, Preview, Development
   - Click **Save**

   **Variable 4:**
   - Key: `GOOGLE_CLIENT_SECRET`
   - Value: `your-google-client-secret` (from Google Cloud Console)
   - Check: Production, Preview, Development
   - Click **Save**

   **Variable 5:**
   - Key: `GOOGLE_SHEET_ID`
   - Value: `1tpLKu0W6PFQbFvP0_P86k4kaYlKqScDQD06ubVOeEKI`
   - Check: Production, Preview, Development
   - Click **Save**

5. **Verify All Variables Are Added**
   - You should see all 5 variables listed
   - Each should have checkmarks for Production, Preview, Development

6. **Redeploy**
   - Go to **Deployments** tab
   - Click the **3 dots** (⋯) on the latest deployment
   - Click **Redeploy**
   - Wait 2-3 minutes

7. **Update Google OAuth Redirect URI**
   - Go to: <https://console.cloud.google.com/apis/credentials>
   - Click your OAuth 2.0 Client ID
   - Under **Authorized redirect URIs**, add:
     ```
     https://parrot-auction-listings-ignas-s-projects.vercel.app/api/auth/callback/google
     ```
   - Click **SAVE**

8. **Test**
   - Visit: <https://parrot-auction-listings-ignas-s-projects.vercel.app>
   - You should see "Sign in with Google" button
   - Click it and sign in

## Why This Is Required

Without environment variables in Vercel:
- The app uses `clientId: "dummy"` and `clientSecret: "dummy"`
- Google rejects these credentials → `invalid_client` error
- The app cannot authenticate users

With environment variables set:
- The app uses real Google OAuth credentials
- Authentication works correctly
- Users can sign in

## Verification Checklist

After setting variables, verify:

- [ ] All 5 variables are visible in Vercel Settings → Environment Variables
- [ ] Each variable has Production, Preview, Development checked
- [ ] `NEXTAUTH_URL` matches your Vercel URL exactly
- [ ] `GOOGLE_CLIENT_ID` matches what's in Google Cloud Console
- [ ] `GOOGLE_CLIENT_SECRET` matches what's in Google Cloud Console
- [ ] Redirect URI is added in Google Cloud Console
- [ ] You redeployed after adding variables
- [ ] You waited 2-3 minutes after redeploy

## Still Not Working?

If you've set all variables and it's still not working:

1. **Double-check the values** - Make sure there are no typos or extra spaces
2. **Check Google Cloud Console** - Verify the OAuth Client ID exists
3. **Check the redirect URI** - Must match exactly (no trailing slash)
4. **Wait a few minutes** - Changes can take time to propagate
5. **Check Vercel logs** - Go to your project → Logs tab for errors

