# Google Cloud Console Setup Guide

## What You Need from Google Cloud Console

You need to create **OAuth 2.0 credentials** to enable Google Sign-In and access to Google Sheets/Drive.

## Step-by-Step Setup

### 1. Create/Select a Google Cloud Project

1. Go to: https://console.cloud.google.com/
2. Sign in with your Google account
3. Click the project dropdown at the top
4. Either:
   - **Select an existing project**, OR
   - **Create a new project**: Click "New Project" → Enter name (e.g., "Parrot Ops") → Click "Create"

### 2. Enable Required APIs

1. Go to: **APIs & Services** → **Library**
2. Search for and **Enable** these APIs:
   - ✅ **Google Sheets API**
   - ✅ **Google Drive API**

### 3. Configure OAuth Consent Screen

1. Go to: **APIs & Services** → **OAuth consent screen**
2. Choose user type:
   - **External** (if you want anyone with a Google account to sign in)
   - **Internal** (only for Google Workspace users in your organization)
3. Fill in the required fields:
   - **App name**: Parrot Ops (or your choice)
   - **User support email**: Your email
   - **Developer contact information**: Your email
4. Click **Save and Continue**
5. **Scopes** (click "Add or Remove Scopes"):
   - Add: `.../auth/spreadsheets`
   - Add: `.../auth/drive.file`
   - Click **Update** → **Save and Continue**
6. **Test users** (if External):
   - Add your email address as a test user
   - Click **Save and Continue**
7. Click **Back to Dashboard**

### 4. Create OAuth 2.0 Credentials

1. Go to: **APIs & Services** → **Credentials**
2. Click **+ Create Credentials** → **OAuth client ID**
3. Application type: **Web application**
4. Name: **Parrot Ops Web Client** (or your choice)
5. **Authorized JavaScript origins**:
   - For local dev: `http://localhost:3000`
   - For production: `https://parrotauction-hibid-r8ysomw3i-ignas-s-projects.vercel.app`
6. **Authorized redirect URIs**:
   - For local dev: `http://localhost:3000/api/auth/callback/google`
   - For production: `https://parrotauction-hibid-r8ysomw3i-ignas-s-projects.vercel.app/api/auth/callback/google`
7. Click **Create**
8. **IMPORTANT**: A popup will show your credentials:
   - **Client ID** (looks like: `746703918473-xxxxx.apps.googleusercontent.com`)
   - **Client Secret** (looks like: `GOCSPX-xxxxx`)
   - ⚠️ **Copy these immediately!** You won't see the secret again.

### 5. What You Need to Copy

You need these **2 values**:

1. **Client ID**: `746703918473-xxxxx.apps.googleusercontent.com`
2. **Client Secret**: `GOCSPX-xxxxx`

## Where to Use These Values

### In Vercel (Production):
1. Go to your Vercel project dashboard
2. **Settings** → **Environment Variables**
3. Add:
   - `GOOGLE_CLIENT_ID` = Your Client ID
   - `GOOGLE_CLIENT_SECRET` = Your Client Secret

### In Local Development (`.env.local`):
```bash
GOOGLE_CLIENT_ID=your-client-id-here
GOOGLE_CLIENT_SECRET=your-client-secret-here
```

## Your Google Sheet

You also need the **Google Sheet ID**:

1. Open your Google Sheet
2. Look at the URL: `https://docs.google.com/spreadsheets/d/1tpLKu0W6PFQbFvP0_P86k4kaYlKqScDQD06ubVOeEKI/edit`
3. The ID is the part between `/d/` and `/edit`: `1tpLKu0W6PFQbFvP0_P86k4kaYlKqScDQD06ubVOeEKI`
4. Add as environment variable: `GOOGLE_SHEET_ID`

## Summary: What You Need

✅ **Client ID** (from OAuth credentials)  
✅ **Client Secret** (from OAuth credentials)  
✅ **Google Sheet ID** (from your spreadsheet URL)  
✅ **OAuth Consent Screen** configured  
✅ **Google Sheets API** enabled  
✅ **Google Drive API** enabled  
✅ **Redirect URIs** configured for both local and production

## Security Notes

- ⚠️ Never commit Client Secret to Git
- ⚠️ Keep your Client Secret secure
- ⚠️ If you lose the secret, create a new OAuth client
- ✅ Store secrets in environment variables only

## Troubleshooting

**"Redirect URI mismatch" error:**
- Make sure the redirect URI in Google Console matches exactly (including `/api/auth/callback/google`)
- Check for typos in the URL
- Wait a few minutes after updating - changes can take time to propagate

**"Access blocked" error:**
- If using External app type, make sure you added test users in OAuth consent screen
- Or publish the app (requires verification for production use)

