# Next Steps Checklist

## ✅ Current Status

- ✅ Code is deployed to Vercel
- ✅ GitHub repo is connected
- ✅ Local build works
- ✅ Google Cloud credentials are ready

## 🔧 Step 1: Configure Environment Variables in Vercel

1. Go to: <https://vercel.com/dashboard>
2. Click on your project: `parrot-auction-listings`
3. Go to **Settings** → **Environment Variables**
4. Add these 5 variables:

| Variable Name | Value |
|--------------|-------|
| `NEXTAUTH_URL` | `https://your-project-name.vercel.app` (your actual Vercel URL) |
| `NEXTAUTH_SECRET` | Your NextAuth secret (generate with `openssl rand -base64 32`) |
| `GOOGLE_CLIENT_ID` | Your Google OAuth Client ID from Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | Your Google OAuth Client Secret from Google Cloud Console |
| `GOOGLE_SHEET_ID` | Your Google Sheet ID from the spreadsheet URL |

1. Make sure **Production**, **Preview**, and **Development** are all checked for each variable
2. Click **Save** for each one

## 🔧 Step 2: Update Google OAuth Redirect URI

1. Go to: <https://console.cloud.google.com/apis/credentials>
2. Click on your OAuth 2.0 Client ID
3. Under **Authorized redirect URIs**, click **+ ADD URI**
4. Add: `https://parrotauction-hibid-r8ysomw3i-ignas-s-projects.vercel.app/api/auth/callback/google`
5. Click **SAVE**

⚠️ **Important**: Make sure there are NO trailing slashes or spaces!

## 🔧 Step 3: Redeploy on Vercel

After adding environment variables:

1. Go to **Deployments** tab in Vercel
2. Click the **3 dots** (⋯) on the latest deployment
3. Click **Redeploy**
4. Wait 2-3 minutes for deployment to complete

OR make a small commit to trigger auto-deploy:

```bash
git commit --allow-empty -m "Trigger redeploy"
git push origin main
```

## 🔧 Step 4: Test Your App

1. Visit: <https://parrotauction-hibid-r8ysomw3i-ignas-s-projects.vercel.app>
2. You should see a "Sign in with Google" button
3. Click it and sign in with your Google account
4. Grant permissions for Sheets and Drive
5. Test the app:
   - ✅ View the map
   - ✅ View bins
   - ✅ Create lots
   - ✅ Search functionality

## 🐛 If Build Still Fails

If you see build errors, check the build logs:

1. Go to Vercel dashboard → Deployments
2. Click on the failed deployment
3. Check **Build Logs** tab
4. Look for the error message
5. Share the error and we'll fix it!

## ✅ Success Checklist

- [ ] Environment variables added to Vercel
- [ ] Google OAuth redirect URI updated
- [ ] Deployment successful (green checkmark)
- [ ] Can access the app URL
- [ ] Can sign in with Google
- [ ] App loads without errors
